import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../models/task.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent implements OnInit {
  tasks: Task[] = [];
  currentUser: User | null = null;
  isLoading = true;

  // Computed stats
  totalTasks = 0;
  completedTasks = 0;
  pendingTasks = 0;
  inProgressTasks = 0;
  overdueTasks = 0;
  completionRate = 0;

  // Priority breakdown
  highPriority = 0;
  mediumPriority = 0;
  lowPriority = 0;

  // Upcoming (due in next 7 days)
  upcomingTasks: Task[] = [];

  constructor(private taskService: TaskService, private authService: AuthService) {}

  ngOnInit() {
    this.authService.user$.subscribe(u => this.currentUser = u);
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.computeAnalytics();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  computeAnalytics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    this.totalTasks = this.tasks.length;
    this.completedTasks = this.tasks.filter(t => t.status === 'completed').length;
    this.pendingTasks = this.tasks.filter(t => t.status === 'pending').length;
    this.inProgressTasks = this.tasks.filter(t => t.status === 'in-progress').length;
    this.overdueTasks = this.tasks.filter(t => {
      if (t.status === 'completed') return false;
      const d = new Date(t.dueDate); d.setHours(0, 0, 0, 0);
      return d < today;
    }).length;
    this.completionRate = this.totalTasks > 0 ? Math.round((this.completedTasks / this.totalTasks) * 100) : 0;

    this.highPriority = this.tasks.filter(t => t.priority === 'high').length;
    this.mediumPriority = this.tasks.filter(t => t.priority === 'medium').length;
    this.lowPriority = this.tasks.filter(t => t.priority === 'low').length;

    this.upcomingTasks = this.tasks.filter(t => {
      if (t.status === 'completed') return false;
      const d = new Date(t.dueDate); d.setHours(0, 0, 0, 0);
      return d >= today && d <= nextWeek;
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  getBarWidth(count: number): string {
    if (this.totalTasks === 0) return '0%';
    return `${Math.round((count / this.totalTasks) * 100)}%`;
  }

  priorityBarWidth(count: number): string {
    const max = Math.max(this.highPriority, this.mediumPriority, this.lowPriority, 1);
    return `${Math.round((count / max) * 100)}%`;
  }
}
