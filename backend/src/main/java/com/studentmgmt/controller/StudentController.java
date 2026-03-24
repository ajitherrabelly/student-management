package com.studentmgmt.controller;

import com.studentmgmt.dto.StudentDTO;
import com.studentmgmt.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:4200")
public class StudentController {
    
    @Autowired
    private StudentService studentService;

    @PostMapping
    public ResponseEntity<StudentDTO> createStudent(@Valid @RequestBody StudentDTO studentDTO) {
        // Create new student and return with 201 status
        return new ResponseEntity<>(studentService.createStudent(studentDTO), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        // TODO: add pagination in future
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDTO> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentDTO studentDTO) {
        return ResponseEntity.ok(studentService.updateStudent(id, studentDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    // Enrollment endpoints
    @PostMapping("/{studentId}/courses/{courseId}")
    public ResponseEntity<StudentDTO> enrollInCourse(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {
        return ResponseEntity.ok(studentService.enrollStudentInCourse(studentId, courseId));
    }

    @DeleteMapping("/{studentId}/courses/{courseId}")
    public ResponseEntity<StudentDTO> unenrollFromCourse(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {
        return ResponseEntity.ok(studentService.unenrollStudentFromCourse(studentId, courseId));
    }
}
