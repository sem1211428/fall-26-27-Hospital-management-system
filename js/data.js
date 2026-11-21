let users = [
  { id: "U-001", name: "Rifat Hasan", username: "admin", password: "admin1234", email: "admin@lifeline.com", phone: "01711000001", role: "Admin", status: "Active" },
  { id: "U-002", name: "Dr. Sadia Akter", username: "doctor", password: "doctor123", email: "sadia@lifeline.com", phone: "01711000002", role: "Doctor", status: "Active", department: "Cardiology", bmdcNo: "A-12345" },
  { id: "U-003", name: "Dr. Mahmud Hasan", username: "mahmud", password: "mahmud123", email: "mahmud@lifeline.com", phone: "01711000003", role: "Doctor", status: "Active", department: "Medicine", bmdcNo: "A-23456" },
  { id: "U-004", name: "Dr. Rubel Khan", username: "rubel", password: "rubel1234", email: "rubel@lifeline.com", phone: "01711000004", role: "Doctor", status: "Pending", department: "Neurology", bmdcNo: "A-34567" },
  { id: "U-005", name: "Rahim Uddin", username: "patient", password: "patient123", email: "rahim@mail.com", phone: "01711000005", role: "Patient", status: "Active", bloodGroup: "A+", address: "Dhanmondi, Dhaka" },
  { id: "U-006", name: "Nadia Rahman", username: "nadia", password: "nadia1234", email: "nadia@mail.com", phone: "01711000006", role: "Patient", status: "Active", bloodGroup: "B+", address: "Mirpur, Dhaka" },
  { id: "U-007", name: "Mitu Sarker", username: "reception", password: "reception123", email: "mitu@lifeline.com", phone: "01711000007", role: "Receptionist", status: "Active", employeeId: "EMP-1001", shift: "Morning" },
  { id: "U-008", name: "Jamal Uddin", username: "jamal", password: "jamal1234", email: "jamal@lifeline.com", phone: "01711000008", role: "Receptionist", status: "Blocked", employeeId: "EMP-1002", shift: "Evening" }
];

let doctors = [
  { id: "D-01", name: "Dr. Sadia Akter", department: "Cardiology", days: "Sat, Mon, Wed", fee: 1000 },
  { id: "D-02", name: "Dr. Mahmud Hasan", department: "Medicine", days: "Sun, Tue, Thu", fee: 800 },
  { id: "D-03", name: "Dr. Farhana Islam", department: "Gynecology", days: "Sat, Tue", fee: 1000 },
  { id: "D-04", name: "Dr. Imran Hossain", department: "Pediatrics", days: "Sun, Wed, Thu", fee: 700 },
  { id: "D-05", name: "Dr. Karim Ahmed", department: "Orthopedics", days: "Mon, Wed", fee: 900 }
];

const departments = ["Cardiology", "Medicine", "Gynecology", "Pediatrics", "Orthopedics"];

let records = [
  { id: "P-001", name: "Rahim Uddin", age: 45, gender: "Male", phone: "01711000005", blood: "A+" },
  { id: "P-002", name: "Nadia Rahman", age: 29, gender: "Female", phone: "01711000006", blood: "B+" },
  { id: "P-003", name: "Karim Hasan", age: 61, gender: "Male", phone: "01811223344", blood: "O+" },
  { id: "P-004", name: "Tania Akter", age: 8, gender: "Female", phone: "01911334455", blood: "AB+" }
];

let appointments = [
  { id: "A-001", patient: "Rahim Uddin", department: "Cardiology", doctor: "Dr. Sadia Akter", date: "2026-11-25", time: "10:00", problem: "Chest pain when climbing stairs", status: "Pending" },
  { id: "A-002", patient: "Rahim Uddin", department: "Medicine", doctor: "Dr. Mahmud Hasan", date: "2026-11-10", time: "11:30", problem: "Fever and cough", status: "Completed" },
  { id: "A-003", patient: "Nadia Rahman", department: "Gynecology", doctor: "Dr. Farhana Islam", date: "2026-11-26", time: "09:30", problem: "Regular check-up", status: "Pending" }
];

let prescriptions = [
  { id: "RX-001", patient: "Rahim Uddin", date: "2026-11-10", diagnosis: "Viral fever", medicine: "Paracetamol 500mg", timing: ["Morning", "Night"], days: 5, advice: "Drink plenty of water" },
  { id: "RX-002", patient: "Karim Hasan", date: "2026-11-12", diagnosis: "Hypertension", medicine: "Amlodipine 5mg", timing: ["Morning"], days: 30, advice: "Less salt, daily walk" }
];

let queue = [
  { token: 1, name: "Rahim Uddin", problem: "Chest pain", status: "Waiting" },
  { token: 2, name: "Karim Hasan", problem: "Blood pressure check", status: "Waiting" },
  { token: 3, name: "Nadia Rahman", problem: "Headache", status: "Waiting" },
  { token: 4, name: "Tania Akter", problem: "Cough", status: "Waiting" }
];

let patientHistory = [
  { patient: "Rahim Uddin", date: "2026-09-02", diagnosis: "Hypertension", treatment: "Amlodipine 5mg daily" },
  { patient: "Rahim Uddin", date: "2026-06-18", diagnosis: "Gastric pain", treatment: "Omeprazole 20mg" },
  { patient: "Karim Hasan", date: "2026-08-21", diagnosis: "Diabetes", treatment: "Metformin 500mg" },
  { patient: "Nadia Rahman", date: "2026-07-05", diagnosis: "Migraine", treatment: "Rest and painkiller" },
  { patient: "Tania Akter", date: "2026-10-01", diagnosis: "Common cold", treatment: "Warm fluids" }
];

let notices = [
  { id: "N-001", title: "Visiting hours changed", audience: "All", text: "Visiting hours are now 4 PM to 7 PM every day.", date: "2026-11-15" },
  { id: "N-002", title: "Staff meeting", audience: "Doctor", text: "Monthly doctors meeting on Thursday at 2 PM.", date: "2026-11-18" }
];

let fees = { general: 500, specialist: 1000, bed: 1500 };

let admittedBeds = [
  { id: "BD-001", patient: "Karim Hasan", ward: "General", bedNo: "G-12", admitDate: "2026-11-19" },
  { id: "BD-002", patient: "Tania Akter", ward: "Pediatric", bedNo: "P-03", admitDate: "2026-11-20" }
];

let ambulanceCalls = [];
