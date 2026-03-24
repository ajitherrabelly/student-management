package com.studentmgmt.util;

/**
 * Application constants
 */
public class AppConstants {
    
    // Error messages
    public static final String STUDENT_NOT_FOUND = "Student not found";
    public static final String COURSE_NOT_FOUND = "Course not found";
    public static final String EMAIL_EXISTS = "Email already exists";
    public static final String COURSE_NAME_EXISTS = "Course already exists";
    
    // Success messages
    public static final String STUDENT_CREATED = "Student created successfully";
    public static final String STUDENT_UPDATED = "Student updated successfully";
    public static final String STUDENT_DELETED = "Student deleted successfully";
    
    // Validation
    public static final int MIN_NAME_LENGTH = 1;
    public static final int MAX_NAME_LENGTH = 100;
    public static final int MIN_PHONE_LENGTH = 10;
    
    // TODO: Consider moving these to application.properties
}
