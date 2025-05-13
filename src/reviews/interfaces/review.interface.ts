export interface Review {
  _id: string;
  content: string;
  patientId: string;
  doctorId: string;
  rating: number;
}
