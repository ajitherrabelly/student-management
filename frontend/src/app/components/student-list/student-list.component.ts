import { Component, inject, OnInit } from '@angular/core';
import { CanComponentDeactivate } from '../../guards/component-deactivate.guard';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit, CanComponentDeactivate {
  private studentService = inject(StudentService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  students: Student[] = [];
  displayedColumns: string[] = ['name', 'email', 'phone', 'courses', 'actions'];

  isDirty = false;

  canDeactivate(): boolean {
    return !this.isDirty;
  }

  ngOnInit(): void {
    this.studentService.students$.subscribe(students => {
      this.students = students;
    });
  }

  openAddDialog(): void {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(StudentFormDialogComponent, {
      width: '500px',
      data: { isEditMode: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.createStudent(result).subscribe(
          () => this.showSuccess('Student created!'),
          error => this.showError(error.error?.message || 'Failed to create')
        );
      }
    });
  }

  openEditDialog(student: Student): void {
    this.dialog.closeAll();
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
    this.dialog.closeAll();
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
