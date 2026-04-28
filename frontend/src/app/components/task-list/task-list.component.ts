import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Output() taskToggle = new EventEmitter<Task>();
  @Output() taskEdit = new EventEmitter<Task>();
  @Output() taskDelete = new EventEmitter<string>();

  confirmDeleteId: string | null = null;

  /** trackBy for performant re-rendering — avoids tearing down DOM on every tasks[] mutation */
  trackByTaskId(_index: number, task: Task): string {
    return task._id || _index.toString();
  }

  onToggle(task: Task) {
    this.taskToggle.emit({
      ...task,
      status: task.status === 'pending' ? 'completed' : 'pending'
    });
  }

  onEdit(task: Task) {
    this.taskEdit.emit(task);
  }

  initiateDelete(id: string | undefined) {
    if (id) {
      this.confirmDeleteId = id;
    }
  }

  cancelDelete() {
    this.confirmDeleteId = null;
  }

  confirmDelete(id: string | undefined) {
    if (id) {
      this.taskDelete.emit(id);
      this.confirmDeleteId = null;
    }
  }

  getPriorityClass(priority: string): string {
    return `badge-${priority}`;
  }

  /** Returns accessible label for the toggle button based on current task status */
  getToggleLabel(task: Task): string {
    return task.status === 'pending' ? 'Mark as completed' : 'Mark as pending';
  }

  isOverdue(task: Task): boolean {
    if (task.status === 'completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  }
}
