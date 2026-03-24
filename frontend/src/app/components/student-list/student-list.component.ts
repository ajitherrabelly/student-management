import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/models';
import { StudentFormDialogComponent } from './student-form-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-student-list',
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
    <div class="student-list-container">
      <div class="header">
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon>
          Add Student
        </button>
      </div>

      <table mat-table [dataSource]="students" class="student-table">
        <!-- Name Column -->
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let element">{{ element.name }}</td>
        </ng-container>

        <!-- Email Column -->
        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let element">{{ element.email }}</td>
        </ng-container>

        <!-- Phone Column -->
        <ng-container matColumnDef="phone">
          <th mat-header-cell *matHeaderCellDef>Phone</th>
          <td mat-cell *matCellDef="let element">{{ element.phone }}</td>
        </ng-container>

        <!-- Courses Column -->
        <ng-container matColumnDef="courses">
          <th mat-header-cell *matHeaderCellDef>Courses</th>
          <td mat-cell *matCellDef="let element">
            {{ element.courses ? element.courses.length : 0 }}
          </td>
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

      <div *ngIf="students.length === 0" class="no-data">
        <p>No students found. Add one to get started!</p>
      </div>
    </div>
  `,
  styles: [`
    .student-list-container {
      padding: 20px 0;
    }

    .header {
      margin-bottom: 20px;
    }

    .student-table {
      width: 100%;
      border-collapse: collapse;
    }

    .student-table th,
    .student-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .student-table th {
      background-color: #f5f5f5;
      font-weight: 600;
    }

    .student-table tr:hover {
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
export class StudentListComponent implements OnInit {
  private studentService = inject(StudentService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  students: Student[] = [];
  displayedColumns: string[] = ['name', 'email', 'phone', 'courses', 'actions'];

  ngOnInit(): void {
    // Subscribe to student updates from the service
    this.studentService.students$.subscribe(students => {
      this.students = students;
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(StudentFormDialogComponent, {
      width: '500px',
      data: { isEditMode: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // TODO: should probably add validation here too
        this.studentService.createStudent(result).subscribe(
          () => this.showSuccess('Student created!'),
          error => this.showError(error.error?.message || 'Failed to create')
        );
      }
    });
  }

  openEditDialog(student: Student): void {
    const dialogRef = this.dialog.open(StudentFormDialogComponent, {
      width: '500px',
      data: { student, isEditMode: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.updateStudent(student.id!, result).subscribe(
          () => this.showSuccess('Student updated!'),
          error => this.showError(error.error?.message || 'Update failed')
        );
      }
    });
  }

  openDeleteDialog(student: Student): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Student',
        message: `Delete ${student.name}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.deleteStudent(student.id!).subscribe(
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
