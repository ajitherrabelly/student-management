export interface Student {
  id?: number;
  name: string;
  email: string;
  phone: string;
  enrollmentDate?: Date;
  courses?: Course[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Course {
  id?: number;
  name: string;
  description: string;
  credits: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: number;
  timestamp?: Date;
  path?: string;
  errors?: any;
}
