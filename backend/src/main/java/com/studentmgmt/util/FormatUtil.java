package com.studentmgmt.util;

import com.studentmgmt.dto.StudentDTO;
import java.time.format.DateTimeFormatter;

/**
 * Utility class for formatting and display helpers
 */
public class FormatUtil {
    
    // TODO: use this later for date formatting
    @SuppressWarnings("unused")
    private static final DateTimeFormatter dateFormatter = 
        DateTimeFormatter.ofPattern("MMM dd, yyyy");
    
    public static String formatStudentInfo(StudentDTO student) {
        // Quick format for logging/debugging
        return String.format("%s (%s)", student.getName(), student.getEmail());
    }
    
    public static String getCourseList(StudentDTO student) {
        if (student.getCourses() == null || student.getCourses().isEmpty()) {
            return "No courses";
        }
        
        // TODO: improve this formatting - maybe sort by name
        return String.format("%d course(s)", student.getCourses().size());
    }
}
