# LifeLine — Hospital Management System

LifeLine is a web-based Hospital Management System connecting **Admins**, **Doctors**, **Patients**, and **Receptionists** in one portal.

## How to run

Open `index.html` in Chrome or Firefox.

| Role         | Username    | Password       |
|--------------|-------------|----------------|
| Admin        | `admin`     | `admin1234`    |
| Doctor       | `doctor`    | `doctor123`    |
| Patient      | `patient`   | `patient123`   |
| Receptionist | `reception` | `reception123` |
| Pending Doctor | `rubel`   | `rubel1234`    |

> Note: `rubel` is waiting for admin approval, so login is refused until approved in *Manage Users*.

## Folder structure

```
index.html  login.html  register.html
admin.html  doctor.html  patient.html  receptionist.html
css/style.css
js/data.js  common.js  home.js  login.js  register.js
js/admin.js  doctor.js  patient.js  receptionist.js
```

Every page loads `data.js`, then `common.js`, then its own script.

## Features

| User | CRUD + Search | Unique 1 | Unique 2 | Unique 3 |
|---|---|---|---|---|
| Admin | Users (approve pending doctors and receptionists) | Statistics Report | Hospital Fees | Notice Board |
| Doctor | Prescriptions | Patient Queue (Call Next) | Patient History | My Schedule |
| Patient | Appointments | Medicine Tracker | BMI Calculator | Symptom Checker |
| Receptionist | Patient Records | Bed Admission and Discharge | Bill Calculator | Ambulance Booking |
