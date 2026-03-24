package com.studentmgmt.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
    private Long id;

    @NotBlank(message = "Course name is required")
    private String name;

    @NotBlank(message = "Course description is required")
    private String description;

    @Min(value = 1, message = "Credits must be at least 1")
    private Integer credits;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
