/**
 * Application configuration file
 * Contains constants used throughout the application
 */

export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  ENDPOINTS: {
    STUDENTS: '/students',
    COURSES: '/courses'
  },
  // Timeouts and UI feedback
  REQUEST_TIMEOUT: 30000,
  SNACKBAR_DURATION: {
    SUCCESS: 3000,
    ERROR: 5000
  }
};

// Validation rules
export const VALIDATION = {
  NAME_MAX_LENGTH: 100,
  EMAIL_PATTERN: /^[A-Za-z0-9+_.-]+@(.+)$/,
  PHONE_LENGTH: 10
};

// TODO: Add more config options as needed
export const DEFAULTS = {
  PAGE_SIZE: 10,
  DIALOG_WIDTH: '500px'
};
