import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Student } from '../models/models';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:8080/api/students';
  private studentsSubject = new BehaviorSubject<Student[]>([]);
  public students$ = this.studentsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStudents();
  }

  loadStudents(): void {
    this.http.get<Student[]>(this.apiUrl).subscribe(
      students => this.studentsSubject.next(students),
      error => console.error('Error loading students:', error)
    );
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student)
      .pipe(
        tap(newStudent => {
          const current = this.studentsSubject.value;
          this.studentsSubject.next([...current, newStudent]);
        })
      );
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student)
      .pipe(
        tap(updatedStudent => {
          const currentStudents = this.studentsSubject.value;
          const index = currentStudents.findIndex(s => s.id === id);
          if (index !== -1) {
            currentStudents[index] = updatedStudent;
            this.studentsSubject.next([...currentStudents]);
          }
        })
      );
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          const currentStudents = this.studentsSubject.value;
          this.studentsSubject.next(currentStudents.filter(s => s.id !== id));
        })
      );
  }

  enrollInCourse(studentId: number, courseId: number): Observable<Student> {
    return this.http.post<Student>(
      `${this.apiUrl}/${studentId}/courses/${courseId}`,
      {}
    ).pipe(
      tap(updatedStudent => {
        const currentStudents = this.studentsSubject.value;
        const index = currentStudents.findIndex(s => s.id === studentId);
        if (index !== -1) {
          currentStudents[index] = updatedStudent;
          this.studentsSubject.next([...currentStudents]);
        }
      })
    );
  }

  unenrollFromCourse(studentId: number, courseId: number): Observable<Student> {
    return this.http.delete<Student>(
      `${this.apiUrl}/${studentId}/courses/${courseId}`
    ).pipe(
      tap(updatedStudent => {
        const currentStudents = this.studentsSubject.value;
        const index = currentStudents.findIndex(s => s.id === studentId);
        if (index !== -1) {
          currentStudents[index] = updatedStudent;
          this.studentsSubject.next([...currentStudents]);
        }
      })
    );
  }
}
