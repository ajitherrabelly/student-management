import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StudentListComponent } from '../components/student-list/student-list.component';
import { CourseListComponent } from '../components/course-list/course-list.component';
import { StudentService } from '../services/student.service';
import { CourseService } from '../services/course.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    StudentListComponent,
    CourseListComponent
  ],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Student Management System</h1>
        <p>Manage students and courses</p>
      </header>

      <!-- Main navigation tabs -->
      <mat-tab-group>
        <mat-tab label="Students">
          <ng-template mat-tab-label>
            <mat-icon>people</mat-icon>
            Students
          </ng-template>
          <app-student-list></app-student-list>
        </mat-tab>

        <mat-tab label="Courses">
          <ng-template mat-tab-label>
            <mat-icon>school</mat-icon>
            Courses
          </ng-template>
          <app-course-list></app-course-list>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 30px;
      text-align: center;
    }

    .dashboard-header h1 {
      margin: 0;
      font-size: 32px;
      color: #333;
    }

    .dashboard-header p {
      margin: 10px 0 0 0;
      color: #666;
      font-size: 16px;
    }

    ::ng-deep .mat-mdc-tab-labels {
      margin-bottom: 20px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private studentService = inject(StudentService);
  private courseService = inject(CourseService);

  ngOnInit(): void {
    this.studentService.loadStudents();
    this.courseService.loadCourses();
  }
}
