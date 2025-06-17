export interface IUserProfile {
    tcIdNumber: string;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'ADMIN' | 'DOCTOR' | 'EMPLOYEE' | 'HOSPITAL_MANAGER' | 'PATIENT' ;
  }