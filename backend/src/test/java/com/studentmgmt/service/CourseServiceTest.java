package com.studentmgmt.service;

import com.studentmgmt.dto.CourseDTO;
import com.studentmgmt.entity.Course;
import com.studentmgmt.exception.DuplicateResourceException;
import com.studentmgmt.exception.ResourceNotFoundException;
import com.studentmgmt.repository.CourseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private CourseService courseService;

    private CourseDTO courseDTO;
    private Course course;

    @BeforeEach
    void setUp() {
        courseDTO = new CourseDTO();
        courseDTO.setId(1L);
        courseDTO.setName("Java Programming");
        courseDTO.setDescription("Learn Java basics");
        courseDTO.setCredits(3);

        course = new Course();
        course.setId(1L);
        course.setName("Java Programming");
        course.setDescription("Learn Java basics");
        course.setCredits(3);
        course.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void testCreateCourse_Success() {
        when(courseRepository.existsByName(anyString())).thenReturn(false);
        when(courseRepository.save(any(Course.class))).thenReturn(course);

        CourseDTO result = courseService.createCourse(courseDTO);

        assertNotNull(result);
        assertEquals("Java Programming", result.getName());
        assertEquals(3, result.getCredits());
        verify(courseRepository, times(1)).save(any(Course.class));
    }

    @Test
    void testCreateCourse_DuplicateName() {
        when(courseRepository.existsByName(anyString())).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> {
            courseService.createCourse(courseDTO);
        });

        verify(courseRepository, never()).save(any(Course.class));
    }

    @Test
    void testGetAllCourses() {
        when(courseRepository.findAll()).thenReturn(Collections.singletonList(course));

        List<CourseDTO> results = courseService.getAllCourses();

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals("Java Programming", results.get(0).getName());
    }

    @Test
    void testGetCourseById_Success() {
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        CourseDTO result = courseService.getCourseById(1L);

        assertNotNull(result);
        assertEquals("Java Programming", result.getName());
    }

    @Test
    void testGetCourseById_NotFound() {
        when(courseRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            courseService.getCourseById(1L);
        });
    }

    @Test
    void testUpdateCourse_Success() {
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(courseRepository.existsByName(anyString())).thenReturn(false);
        when(courseRepository.save(any(Course.class))).thenReturn(course);

        CourseDTO result = courseService.updateCourse(1L, courseDTO);

        assertNotNull(result);
        verify(courseRepository, times(1)).save(any(Course.class));
    }

    @Test
    void testUpdateCourse_NotFound() {
        when(courseRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            courseService.updateCourse(1L, courseDTO);
        });
    }

    @Test
    void testDeleteCourse_Success() {
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        courseService.deleteCourse(1L);

        verify(courseRepository, times(1)).delete(any(Course.class));
    }

    @Test
    void testDeleteCourse_NotFound() {
        when(courseRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            courseService.deleteCourse(1L);
        });
    }
}
