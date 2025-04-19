export interface MedicalRecord {
    patientId: string; // Reference to the patient's user ID
    doctorId: string; // Reference to the doctor's user ID
    diagnosis: string; // التشخيص
    treatment?: string; // العلاج (optional)
    attachments?: string[]; // روابط الملفات المرفوعة (optional)
    createdAt?: Date; // تاريخ الإنشاء (optional, default to current date)
}