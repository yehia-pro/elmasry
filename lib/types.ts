export type Role = 'STUDENT' | 'ADMIN' | 'DOCTOR' | 'SUPERADMIN';

export type ApplicationStatus = 
  | 'PENDING_REVIEW'      // قيد المراجعة والتدقيق
  | 'APPROVED'            // معتمد ومقبول لحضور الكشف الطبي
  | 'NEEDS_CORRECTION'    // مطلوب إعادة رفع مستند
  | 'COMPLETED_FIT'       // تم الكشف - لائق طبياً
  | 'COMPLETED_UNFIT';    // تم الكشف - غير لائق طبياً

export interface StudentRegistrationData {
  fullName: string;
  nationalId: string;
  nationality: string;
  dob: string;
  governorate: string;
  city: string;
  studentPhone: string;
  fatherPhone: string;
  motherPhone: string;
  email?: string;
  height?: number;
  weight?: number;
  institute?: string;
  level?: string;
  department?: string;
  qualificationSource: string;
  examType: string;
  specialCategory: string;
  password: string;
  confirmPassword?: string;
  appointmentDate: string;
  appointmentTime: string;
  documents: {
    docType: string;
    fileUrl: string;
    publicId?: string;
    fileName: string;
  }[];
}

export interface SlotAvailability {
  date: string;
  timeSlot: string;
  maxCapacity: number;
  bookedCount: number;
  availableCount: number;
  isFull: boolean;
  isActive: boolean;
}
