package com.studentmgmt.util;

import java.util.regex.Pattern;

/**
 * Utility class for validation helpers
 * Added this to centralize common validation logic
 */
public class ValidationUtil {
    
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    
    // TODO: improve email validation later
    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }
    
    public static boolean isNotEmpty(String value) {
        return value != null && !value.trim().isEmpty();
    }
    
    // Might be useful for phone validation in the future
    public static boolean isValidPhone(String phone) {
        // Simple check for now - just ensure it's not empty
        // TODO: add proper phone validation
        return isNotEmpty(phone);
    }
}
