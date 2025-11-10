-- Sample data for testing (DO NOT use in production)

-- Insert sample hospitals
INSERT INTO users (email, password_hash, role) VALUES
('cityhospital@example.com', '$2b$10$YourHashedPasswordHere', 'hospital_admin'),
('cardiocenter@example.com', '$2b$10$YourHashedPasswordHere', 'hospital_admin'),
('emergencycare@example.com', '$2b$10$YourHashedPasswordHere', 'hospital_admin');

-- Get hospital user IDs (you'll need to adjust these based on actual UUIDs)
-- This is just a template - actual implementation would use proper UUID handling

INSERT INTO hospitals (user_id, name, registration_number, contact_number, email, address, city, state, pin_code, latitude, longitude, total_beds, available_beds, has_emergency, has_icu, has_trauma_center, is_verified) VALUES
((SELECT id FROM users WHERE email = 'cityhospital@example.com'), 'City General Hospital', 'HOSP001', '+91-9876543210', 'cityhospital@example.com', '123 Main Street, Downtown', 'Mumbai', 'Maharashtra', '400001', 19.0760, 72.8777, 500, 120, true, true, true, true),
((SELECT id FROM users WHERE email = 'cardiocenter@example.com'), 'Cardio Care Center', 'HOSP002', '+91-9876543211', 'cardiocenter@example.com', '456 Heart Lane, Medical District', 'Delhi', 'Delhi', '110001', 28.7041, 77.1025, 200, 45, true, true, false, true),
((SELECT id FROM users WHERE email = 'emergencycare@example.com'), 'Emergency Care Hospital', 'HOSP003', '+91-9876543212', 'emergencycare@example.com', '789 Emergency Road, City Center', 'Bangalore', 'Karnataka', '560001', 12.9716, 77.5946, 300, 80, true, true, true, true);

-- Insert departments
INSERT INTO departments (hospital_id, name, description, head_doctor, contact_number) VALUES
((SELECT id FROM hospitals WHERE name = 'City General Hospital'), 'Cardiology', 'Heart and cardiovascular care', 'Dr. Rajesh Kumar', '+91-9876543213'),
((SELECT id FROM hospitals WHERE name = 'City General Hospital'), 'Neurology', 'Brain and nervous system care', 'Dr. Priya Sharma', '+91-9876543214'),
((SELECT id FROM hospitals WHERE name = 'City General Hospital'), 'Emergency Medicine', '24/7 emergency care', 'Dr. Amit Patel', '+91-9876543215'),
((SELECT id FROM hospitals WHERE name = 'Cardio Care Center'), 'Cardiology', 'Specialized cardiac care', 'Dr. Suresh Reddy', '+91-9876543216'),
((SELECT id FROM hospitals WHERE name = 'Emergency Care Hospital'), 'Trauma Center', 'Accident and trauma care', 'Dr. Neha Gupta', '+91-9876543217');

-- Insert sample doctors
INSERT INTO doctors (hospital_id, department_id, full_name, specialization, qualification, registration_number, contact_number, email, experience_years) VALUES
((SELECT id FROM hospitals WHERE name = 'City General Hospital'), 
 (SELECT id FROM departments WHERE name = 'Cardiology' LIMIT 1), 
 'Dr. Rajesh Kumar', 'Cardiologist', 'MBBS, MD, DM (Cardiology)', 'DOC001', '+91-9876543213', 'rajesh.kumar@cityhospital.com', 15),
 
((SELECT id FROM hospitals WHERE name = 'City General Hospital'), 
 (SELECT id FROM departments WHERE name = 'Neurology' LIMIT 1), 
 'Dr. Priya Sharma', 'Neurologist', 'MBBS, MD, DM (Neurology)', 'DOC002', '+91-9876543214', 'priya.sharma@cityhospital.com', 12),
 
((SELECT id FROM hospitals WHERE name = 'Cardio Care Center'), 
 (SELECT id FROM departments WHERE name = 'Cardiology' AND hospital_id = (SELECT id FROM hospitals WHERE name = 'Cardio Care Center') LIMIT 1), 
 'Dr. Suresh Reddy', 'Interventional Cardiologist', 'MBBS, MD, DM (Cardiology)', 'DOC003', '+91-9876543216', 'suresh.reddy@cardiocenter.com', 18);

-- Insert sample ambulances
INSERT INTO ambulances (hospital_id, vehicle_number, vehicle_type, driver_name, driver_contact, is_available, equipment_list) VALUES
((SELECT id FROM hospitals WHERE name = 'City General Hospital'), 'MH-01-AB-1234', 'ICU', 'Ramesh Singh', '+91-9876543220', true, 'Ventilator, Defibrillator, Oxygen, ECG Monitor'),
((SELECT id FROM hospitals WHERE name = 'City General Hospital'), 'MH-01-AB-1235', 'Advanced', 'Sunil Kumar', '+91-9876543221', true, 'Oxygen, Basic Life Support, Stretcher'),
((SELECT id FROM hospitals WHERE name = 'Cardio Care Center'), 'DL-02-CD-5678', 'Advanced', 'Vijay Sharma', '+91-9876543222', true, 'Cardiac Monitor, Defibrillator, Oxygen'),
((SELECT id FROM hospitals WHERE name = 'Emergency Care Hospital'), 'KA-03-EF-9012', 'ICU', 'Prakash Rao', '+91-9876543223', true, 'Full ICU Setup, Ventilator, Defibrillator');

-- Note: Patient data should be added through the application registration process
-- This seed file focuses on hospital infrastructure data
