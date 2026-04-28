import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnChanges {
  @Input() task: Task | null = null;
  @Output() taskSubmit = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();

  taskForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  /** Minimum selectable date — today in YYYY-MM-DD format */
  get minDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(120)]],
      description: ['', [Validators.maxLength(500)]],
      priority: ['medium', [Validators.required]],
      dueDate: ['', [Validators.required]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task) {
      this.isEditMode = true;
      this.isSubmitting = false;

      // Format date for input type="date"
      let formattedDate = '';
      if (this.task.dueDate) {
        const d = new Date(this.task.dueDate);
        formattedDate = d.toISOString().split('T')[0];
      }

      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description || '',
        priority: this.task.priority,
        dueDate: formattedDate
      });
    } else {
      this.isEditMode = false;
      this.isSubmitting = false;
      this.taskForm.reset({ priority: 'medium' });
    }
  }

  onSubmit() {
    if (this.taskForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;

    const newTask: Task = {
      ...this.taskForm.value,
      status: this.isEditMode && this.task ? this.task.status : 'pending'
    };

    if (this.isEditMode && this.task && this.task._id) {
      newTask._id = this.task._id;
    }

    this.taskSubmit.emit(newTask);
    // Parent resets the form by setting task=null, which triggers ngOnChanges
  }

  onCancel() {
    this.isSubmitting = false;
    this.cancel.emit();
  }
}
