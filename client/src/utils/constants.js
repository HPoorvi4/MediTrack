export const HEALTH_CATEGORIES = [
  { value: 'Cardiac Patient', label: 'Cardiac Patient (Heart-related condition)' },
  { value: 'Diabetic', label: 'Diabetic' },
  { value: 'Respiratory Issues', label: 'Respiratory Issues (Asthma, breathing problems)' },
  { value: 'Neurological Condition', label: 'Neurological Condition (Epilepsy, seizures)' },
  { value: 'Pregnant', label: 'Pregnant' },
];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const GENDERS = ['Male', 'Female', 'Other'];

export const EMERGENCY_TYPES = [
  { value: 'Cardiac', label: 'Cardiac Emergency', icon: '❤️' },
  { value: 'Respiratory', label: 'Respiratory Emergency', icon: '🫁' },
  { value: 'Accident', label: 'Accident/Trauma', icon: '🚗' },
  { value: 'Neurological', label: 'Neurological Emergency', icon: '🧠' },
  { value: 'Pregnancy', label: 'Pregnancy Emergency', icon: '🤰' },
  { value: 'General', label: 'General Emergency', icon: '🚑' },
];

export const BOOKING_STATUSES = {
  pending: { label: 'Pending', color: '#f59e0b' },
  confirmed: { label: 'Confirmed', color: '#3b82f6' },
  ambulance_dispatched: { label: 'Ambulance Dispatched', color: '#8b5cf6' },
  ambulance_arrived: { label: 'Ambulance Arrived', color: '#06b6d4' },
  patient_picked: { label: 'Patient Picked Up', color: '#10b981' },
  in_transit: { label: 'In Transit', color: '#14b8a6' },
  reached_hospital: { label: 'Reached Hospital', color: '#059669' },
  completed: { label: 'Completed', color: '#22c55e' },
  cancelled: { label: 'Cancelled', color: '#ef4444' },
};

export const DEPARTMENTS = [
  'Cardiology',
  'Neurology',
  'Emergency Medicine',
  'Orthopedics',
  'Pediatrics',
  'Obstetrics & Gynecology',
  'General Surgery',
  'Internal Medicine',
  'Trauma Center',
  'ICU',
];
