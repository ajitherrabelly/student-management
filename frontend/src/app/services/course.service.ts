import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Course } from '../models/models';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8080/api/courses';
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  public courses$ = this.coursesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCourses();
  }

  loadCourses(): void {
    // Load courses from API and update local state
    this.http.get<Course[]>(this.apiUrl)
      .subscribe(courses => {
        this.coursesSubject.next(courses);
      });
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course)
      .pipe(
        tap(newCourse => {
          const currentCourses = this.coursesSubject.value;
          this.coursesSubject.next([...currentCourses, newCourse]);
        })
      );
  }

  updateCourse(id: number, course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course)
      .pipe(
        tap(updatedCourse => {
          const currentCourses = this.coursesSubject.value;
          const index = currentCourses.findIndex(c => c.id === id);
          if (index !== -1) {
            currentCourses[index] = updatedCourse;
            this.coursesSubject.next([...currentCourses]);
          }
        })
      );
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          const currentCourses = this.coursesSubject.value;
          this.coursesSubject.next(currentCourses.filter(c => c.id !== id));
        })
      );
  }
}
