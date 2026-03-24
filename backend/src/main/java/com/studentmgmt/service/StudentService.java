package com.studentmgmt.service;

import com.studentmgmt.dto.StudentDTO;
import com.studentmgmt.dto.CourseDTO;
import com.studentmgmt.entity.Course;
import com.studentmgmt.entity.Student;
import com.studentmgmt.exception.DuplicateResourceException;
import com.studentmgmt.exception.ResourceNotFoundException;
import com.studentmgmt.repository.CourseRepository;
import com.studentmgmt.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private CourseRepository courseRepository;

    public StudentDTO createStudent(StudentDTO studentDTO) {
        // Check if email already exists
        if (studentRepository.existsByEmail(studentDTO.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }

        Student student = new Student();
        student.setName(studentDTO.getName());
        student.setEmail(studentDTO.getEmail());
        student.setPhone(studentDTO.getPhone());
        student.setEnrollmentDate(LocalDateTime.now());

        return convertToDTO(studentRepository.save(student));
    }

    @Transactional(readOnly = true)
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return convertToDTO(student);
    }

    public StudentDTO updateStudent(Long id, StudentDTO studentDTO) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        // Validate email is unique (unless same as existing)
        if (!student.getEmail().equals(studentDTO.getEmail()) && 
            studentRepository.existsByEmail(studentDTO.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }

        student.setName(studentDTO.getName());
        student.setEmail(studentDTO.getEmail());
        student.setPhone(studentDTO.getPhone());

        Student updatedStudent = studentRepository.save(student);
        return convertToDTO(updatedStudent);
    }

    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        studentRepository.delete(student);
    }

    public StudentDTO enrollStudentInCourse(Long studentId, Long courseId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        student.getCourses().add(course);
        Student updatedStudent = studentRepository.save(student);
        return convertToDTO(updatedStudent);
    }

    public StudentDTO unenrollStudentFromCourse(Long studentId, Long courseId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        student.getCourses().remove(course);
        Student updatedStudent = studentRepository.save(student);
        return convertToDTO(updatedStudent);
    }

    private StudentDTO convertToDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setPhone(student.getPhone());
        dto.setEnrollmentDate(student.getEnrollmentDate());
        dto.setCreatedAt(student.getCreatedAt());
        dto.setUpdatedAt(student.getUpdatedAt());
        dto.setCourses(student.getCourses()
                .stream()
                .map(this::convertCourseToDTO)
                .collect(Collectors.toSet()));
        return dto;
    }

    private CourseDTO convertCourseToDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setName(course.getName());
        dto.setDescription(course.getDescription());
        dto.setCredits(course.getCredits());
        dto.setCreatedAt(course.getCreatedAt());
        dto.setUpdatedAt(course.getUpdatedAt());
        return dto;
    }
}
