package com.studentmgmt.service;

import com.studentmgmt.dto.CourseDTO;
import com.studentmgmt.entity.Course;
import com.studentmgmt.exception.DuplicateResourceException;
import com.studentmgmt.exception.ResourceNotFoundException;
import com.studentmgmt.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;

    public CourseDTO createCourse(CourseDTO courseDTO) {
        // Validate course name is unique
        if (courseRepository.existsByName(courseDTO.getName())) {
            throw new DuplicateResourceException("Course already exists");
        }

        Course course = new Course();
        course.setName(courseDTO.getName());
        course.setDescription(courseDTO.getDescription());
        course.setCredits(courseDTO.getCredits());

        Course savedCourse = courseRepository.save(course);
        return convertToDTO(savedCourse);
    }

    @Transactional(readOnly = true)
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        return convertToDTO(course);
    }

    public CourseDTO updateCourse(Long id, CourseDTO courseDTO) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        // Check if new name is available (unless unchanged)
        if (!course.getName().equals(courseDTO.getName()) && 
            courseRepository.existsByName(courseDTO.getName())) {
            throw new DuplicateResourceException("Course already exists");
        }

        course.setName(courseDTO.getName());
        course.setDescription(courseDTO.getDescription());
        course.setCredits(courseDTO.getCredits());

        Course updatedCourse = courseRepository.save(course);
        return convertToDTO(updatedCourse);
    }

    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        courseRepository.delete(course);
    }

    private CourseDTO convertToDTO(Course course) {
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
