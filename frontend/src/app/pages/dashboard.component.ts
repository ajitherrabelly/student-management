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
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private studentService = inject(StudentService);
  private courseService = inject(CourseService);

  ngOnInit(): void {
    this.studentService.loadStudents();
    this.courseService.loadCourses();
  }
}
