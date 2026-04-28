import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskService } from '../../services/task.service';
import { SearchService } from '../../services/search.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-tasks-view',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskFormComponent, TaskListComponent],
  templateUrl: './tasks-view.component.html',
  styleUrl: './tasks-view.component.css'
})
export class TasksViewComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  isLoading = true;

  // Filters
  filterStatus: string = '';
  filterPriority: string = '';
  searchTerm: string = '';

  // Stats
  totalTasks = 0;
  pendingTasks = 0;
  completedTasks = 0;
  overdueTasks = 0;

  // View mode
  viewMode: 'list' | 'kanban' = 'list';
  today = new Date();

  // Modal State
  showModal = false;
  editingTask: Task | null = null;

  // Toast
  toastMessage: string | null = null;
  toastType: 'success' | 'error' = 'success';
  toastTimeout: any;

  private destroy$ = new Subject<void>();

  constructor(private taskService: TaskService, public searchService: SearchService) {}

  ngOnInit() {
    this.loadTasks();
    // Sync search term from the shared header search bar
    this.searchService.searchTerm$.pipe(takeUntil(this.destroy$)).subscribe(term => {
      this.searchTerm = term;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.showModal) this.closeModal();
  }

  loadTasks() {
    this.isLoading = true;
    this.taskService.getTasks(this.filterStatus, this.filterPriority).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.calculateStats();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading tasks', err);
        this.showToast('Failed to load tasks', 'error');
        this.isLoading = false;
      }
    });
  }

  calculateStats() {
    this.totalTasks = this.tasks.length;
    this.completedTasks = this.tasks.filter(t => t.status === 'completed').length;
    this.pendingTasks = this.tasks.filter(t => t.status === 'pending').length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.overdueTasks = this.tasks.filter(t => {
      if (t.status === 'completed') return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    }).length;
  }

  get filteredTasks(): Task[] {
    if (!this.searchTerm) return this.tasks;
    const term = this.searchTerm.toLowerCase();
    return this.tasks.filter(t =>
      t.title.toLowerCase().includes(term) ||
      (t.description && t.description.toLowerCase().includes(term))
    );
  }

  get pendingTasksList(): Task[] {
    return this.filteredTasks.filter(t => t.status === 'pending');
  }

  get inProgressTasksList(): Task[] {
    return this.filteredTasks.filter(t => t.status === 'in-progress');
  }

  get completedTasksList(): Task[] {
    return this.filteredTasks.filter(t => t.status === 'completed');
  }

  onFilterChange() { this.loadTasks(); }

  openModal(task?: Task) {
    this.editingTask = task || null;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingTask = null;
  }

  onTaskSubmit(task: Task) {
    if (this.editingTask && this.editingTask._id) {
      this.taskService.updateTask(this.editingTask._id, task).subscribe({
        next: (updatedTask) => {
          const index = this.tasks.findIndex(t => t._id === updatedTask._id);
          if (index !== -1) this.tasks[index] = updatedTask;
          this.calculateStats();
          this.closeModal();
          this.showToast('Task updated successfully');
        },
        error: () => {
          this.showToast('Failed to update task', 'error');
          this.editingTask = { ...this.editingTask! };
        }
      });
    } else {
      this.taskService.createTask(task).subscribe({
        next: (newTask) => {
          this.tasks.push(newTask);
          this.calculateStats();
          this.closeModal();
          this.showToast('Task created successfully');
        },
        error: () => {
          this.showToast('Failed to create task', 'error');
          this.editingTask = null;
        }
      });
    }
  }

  onTaskEdit(task: Task) { this.openModal(task); }

  onTaskToggle(task: Task) {
    if (!task._id) return;
    this.taskService.updateTask(task._id, task).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t._id === updatedTask._id);
        if (index !== -1) this.tasks[index] = updatedTask;
        this.calculateStats();
        this.showToast(updatedTask.status === 'completed' ? 'Task completed ✓' : 'Task reopened');
      },
      error: () => this.showToast('Failed to update task', 'error')
    });
  }

  onTaskDelete(id: string) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t._id !== id);
        this.calculateStats();
        this.showToast('Task deleted');
      },
      error: () => this.showToast('Failed to delete task', 'error')
    });
  }

  isOverdue(task: Task): boolean {
    if (task.status === 'completed') return false;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const d = new Date(task.dueDate); d.setHours(0, 0, 0, 0);
    return d < today;
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => { this.toastMessage = null; }, 3000);
  }
}
