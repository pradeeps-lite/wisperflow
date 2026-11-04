export type SupportedLanguage = 'te' | 'hi' | 'en';

export type AppTab = 'home' | 'assistant' | 'prescription' | 'facilities' | 'emergency' | 'order';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  audioScript?: string;
  timestamp: string;
  isEmergency?: boolean;
  suggestedActions?: string[];
}

export interface ExtractedMedicine {
  name: string;
  dosage: string;
  frequency: string;
  timing: string;
  duration: string;
  instructions: string;
  confidence: 'high' | 'medium' | 'low' | 'unclear';
  verificationNeeded: boolean;
}

export interface PrescriptionAnalysis {
  doctorOrClinic: string;
  patientInfo?: string;
  date?: string;
  diagnosisOrNotes?: string;
  medicines: ExtractedMedicine[];
  unclearItems: string[];
  safetyWarnings: string[];
  explanationLocalized: string;
  audioScript: string;
}

export interface HealthcareFacility {
  id: string;
  name: string;
  nameTe?: string;
  nameHi?: string;
  type: 'hospital' | 'phc' | 'pharmacy' | 'jan_aushadhi';
  categoryLabel: string;
  address: string;
  distanceKm: number;
  lat: number;
  lng: number;
  rating: number;
  is24x7: boolean;
  emergencyServices: string[];
  phone: string;
  emergencyPhone?: string | null;
  openHours: string;
  directionsUrl: string;
  source?: string;
  osmId?: string | number;
}

export interface MedicineProduct {
  id: string;
  name: string;
  genericName: string;
  category: 'fever' | 'chronic' | 'maternal' | 'firstaid' | 'generic';
  price: number;
  mrp: number;
  discountPercent?: number;
  unit: string;
  requiresPrescription: boolean;
  inStock: boolean;
  pharmacyId: string;
  pharmacyName: string;
  descriptionTe: string;
  descriptionHi: string;
  descriptionEn: string;
}

export interface CartItem {
  product: MedicineProduct;
  quantity: number;
}

export interface OrderDetails {
  orderId: string;
  items: CartItem[];
  totalAmount: number;
  patientName: string;
  phoneNumber: string;
  villageTown: string;
  landmark: string;
  paymentMethod: 'cod' | 'upi';
  prescriptionAttached: boolean;
  status: 'confirmed' | 'pharmacist_review' | 'out_for_delivery' | 'delivered';
  estimatedDelivery: string;
  createdAt: string;
}
