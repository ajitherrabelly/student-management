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
  template: `
    <div class="course-list-container">
      <div class="header">
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon>
          Add Course
        </button>
      </div>

      <table mat-table [dataSource]="courses" class="course-table">
        <!-- Name Column -->
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let element">{{ element.name }}</td>
        </ng-container>

        <!-- Description Column -->
        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef>Description</th>
          <td mat-cell *matCellDef="let element">{{ element.description }}</td>
        </ng-container>

        <!-- Credits Column -->
        <ng-container matColumnDef="credits">
          <th mat-header-cell *matHeaderCellDef>Credits</th>
          <td mat-cell *matCellDef="let element">{{ element.credits }}</td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let element">
            <button mat-icon-button color="accent" (click)="openEditDialog(element)" title="Edit">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="openDeleteDialog(element)" title="Delete">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <div *ngIf="courses.length === 0" class="no-data">
        <p>No courses found. Add one to get started!</p>
      </div>
    </div>
  `,
  styles: [`
    .course-list-container {
      padding: 20px 0;
    }

    .header {
      margin-bottom: 20px;
    }

    .course-table {
      width: 100%;
      border-collapse: collapse;
    }

    .course-table th,
    .course-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .course-table th {
      background-color: #f5f5f5;
      font-weight: 600;
    }

    .course-table tr:hover {
      background-color: #f9f9f9;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #999;
    }

    button {
      margin: 0 4px;
    }
  `]
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
