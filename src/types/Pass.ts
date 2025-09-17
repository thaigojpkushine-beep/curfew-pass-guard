export interface Pass {
  id: string;
  fullName: string;
  idNumber: string;
  reason: string;
  destination: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  qrCode?: string;
  createdAt: Date;
  approvedAt?: Date;
}

export interface PassFormData {
  fullName: string;
  idNumber: string;
  reason: string;
  destination: string;
  startTime: string;
  endTime: string;
}