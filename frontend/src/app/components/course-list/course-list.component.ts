import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/models';
import { CourseFormDialogComponent } from './course-form-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  private courseService = inject(CourseService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  courses: Course[] = [];
  displayedColumns: string[] = ['name', 'description', 'credits', 'actions'];

  ngOnInit(): void {
    // Subscribe to course updates from service
    this.courseService.courses$.subscribe(courses => {
      this.courses = courses;
    });
  }

  openAddDialog(): void {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(CourseFormDialogComponent, {
      width: '500px',
      data: { isEditMode: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.courseService.createCourse(result).subscribe(
          () => this.showSuccess('Course created!'),
          error => this.showError(error.error?.message || 'Failed to create')
        );
      }
    });
  }

  openEditDialog(course: Course): void {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(CourseFormDialogComponent, {
      width: '500px',
      data: { course, isEditMode: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.courseService.updateCourse(course.id!, result).subscribe(
          () => this.showSuccess('Course updated!'),
          error => this.showError(error.error?.message || 'Update failed')
        );
      }
    });
  }

  openDeleteDialog(course: Course): void {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Course',
        message: `Delete ${course.name}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.courseService.deleteCourse(course.id!).subscribe(
          () => this.showSuccess('Deleted!'),
          error => this.showError(error.error?.message || 'Failed to delete')
        );
      }
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { 
      duration: 5000, 
      panelClass: ['error'] 
    });
  }
}
