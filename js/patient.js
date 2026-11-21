const sections = ["appointmentSection", "medicineSection", "bmiSection", "symptomSection"];

const currentPatient = "Rahim Uddin";

let editAptIndex = -1;

const aptFields = ["aptDepartment", "aptDoctor", "aptDate", "aptTime", "aptProblem"];


function fillDoctors() {
  let department = document.getElementById("aptDepartment").value;
  let names = [];

  for (const doctor of doctors) {
    if (doctor.department === department) {
      names.push(doctor.name);
    }
  }

  fillSelect("aptDoctor", names, "-- Select doctor --");
}


function renderAppointments() {
  let keyword = document.getElementById("appointmentSearch").value;

  let rows = "";
  let shown = 0;
  let mine = 0;

  for (let i = 0; i < appointments.length; i++) {
    let apt = appointments[i];
    let isMine = (apt.patient === currentPatient);
    if (isMine) {
      mine++;
    }

    let matches = containsText(apt.doctor, keyword) || containsText(apt.department, keyword) ||
                  containsText(apt.problem, keyword) || containsText(apt.id, keyword);

    if (isMine && matches) {
      let statusColor;
      switch (apt.status) {
        case "Completed":
          statusColor = "green";
          break;
        case "Cancelled":
          statusColor = "red";
          break;
        default:
          statusColor = "orange";
      }

      let actions = "&mdash;";
      if (apt.status === "Pending") {
        actions = "<button type='button' class='btn btn-small' onclick='editAppointment(" + i + ")'>Edit</button> " +
                  "<button type='button' class='btn btn-small btn-danger' onclick='deleteAppointment(" + i + ")'>Cancel</button>";
      }

      rows += "<tr>" +
                "<td>" + apt.id + "</td>" +
                "<td><strong>" + apt.doctor + "</strong><br><span class='hint'>" + apt.department + "</span></td>" +
                "<td>" + apt.date + "<br><span class='hint'>" + apt.time + "</span></td>" +
                "<td>" + apt.problem + "</td>" +
                "<td><span class='badge " + statusColor + "'>" + apt.status + "</span></td>" +
                "<td>" + actions + "</td>" +
              "</tr>";
      shown++;
    }
  }

  if (shown === 0) {
    rows = "<tr><td colspan='6' class='empty-row'>No appointments match your search.</td></tr>";
  }

  document.getElementById("appointmentBody").innerHTML = rows;
  document.getElementById("aptCount").innerHTML = "Showing " + shown + " of " + mine + " appointments";
}


function isSlotTaken(doctor, date, time) {
  for (let i = 0; i < appointments.length; i++) {
    let apt = appointments[i];
    if (i !== editAptIndex && apt.status !== "Cancelled" && apt.doctor === doctor && apt.date === date && apt.time === time) {
      return true;
    }
  }
  return false;
}


function saveAppointment() {
  let department = document.getElementById("aptDepartment").value;
  let doctor = document.getElementById("aptDoctor").value;
  let date = document.getElementById("aptDate").value;
  let time = document.getElementById("aptTime").value;
  let problem = document.getElementById("aptProblem").value.trim();

  let isValid = true;
  clearErrors(aptFields);

  if (department === "") {
    showError("aptDepartment", "Please choose a department.");
    isValid = false;
  }

  if (doctor === "") {
    showError("aptDoctor", "Please choose a doctor.");
    isValid = false;
  }

  if (date === "") {
    showError("aptDate", "Please choose a date.");
    isValid = false;
  } else if (date < todayString()) {
    showError("aptDate", "The date cannot be in the past.");
    isValid = false;
  }

  if (time === "") {
    showError("aptTime", "Please choose a time.");
    isValid = false;
  } else if (doctor !== "" && date !== "" && isSlotTaken(doctor, date, time)) {
    showError("aptTime", "This doctor is already booked at that time.");
    isValid = false;
  }

  if (problem.length < 5) {
    showError("aptProblem", "Please describe the problem (at least 5 characters).");
    isValid = false;
  } else if (problem.length > 150) {
    showError("aptProblem", "Please keep it under 150 characters.");
    isValid = false;
  }

  if (isValid === false) {
    return false;
  }

  if (editAptIndex === -1) {
    let newApt = { id: nextId("A", appointments), patient: currentPatient, department: department, doctor: doctor,
                   date: date, time: time, problem: problem, status: "Pending" };
    appointments.push(newApt);
    showMessage("aptMessage", "Appointment " + newApt.id + " booked with <strong>" + doctor + "</strong>.", "success");
  } else {
    let apt = appointments[editAptIndex];
    apt.department = department;
    apt.doctor = doctor;
    apt.date = date;
    apt.time = time;
    apt.problem = problem;
    showMessage("aptMessage", "Appointment " + apt.id + " was updated.", "success");
  }

  resetAppointmentForm(false);
  renderAppointments();
  return false;
}


function editAppointment(index) {
  let apt = appointments[index];
  editAptIndex = index;

  document.getElementById("aptDepartment").value = apt.department;
  fillDoctors();
  document.getElementById("aptDoctor").value = apt.doctor;
  document.getElementById("aptDate").value = apt.date;
  document.getElementById("aptTime").value = apt.time;
  document.getElementById("aptProblem").value = apt.problem;

  clearErrors(aptFields);
  document.getElementById("aptFormTitle").innerHTML = "Edit Appointment " + apt.id;
  document.getElementById("aptSaveButton").value = "Update Appointment";
  hideMessage("aptMessage");
}


function deleteAppointment(index) {
  let apt = appointments[index];
  appointments = removeAt(appointments, index);
  showMessage("aptMessage", "Appointment " + apt.id + " was cancelled.", "info");
  resetAppointmentForm(false);
  renderAppointments();
}


function resetAppointmentForm(clearMessage) {
  editAptIndex = -1;
  document.getElementById("appointmentForm").reset();
  fillDoctors();
  clearErrors(aptFields);
  document.getElementById("aptFormTitle").innerHTML = "Book Appointment";
  document.getElementById("aptSaveButton").value = "Book Appointment";
  if (clearMessage !== false) {
    hideMessage("aptMessage");
  }
}


function updateMedicine() {
  let taken = 0;
  let ids = ["med1", "med2", "med3"];

  for (const id of ids) {
    if (document.getElementById(id).checked) {
      taken++;
    }
  }

  let percent = Math.round(taken / ids.length * 100);
  document.getElementById("medicineBar").style.width = percent + "%";

  let text = taken + " of " + ids.length + " medicines taken today (" + percent + "%).";
  if (taken === ids.length) {
    text += " Well done, all medicines taken!";
  }
  document.getElementById("medicineText").innerHTML = text;
}


function calculateBmi() {
  let weight = document.getElementById("weight").value;
  let height = document.getElementById("height").value;

  let isValid = true;
  clearErrors(["weight", "height"]);

  if (isEmpty(weight) || Number(weight) < 1 || Number(weight) > 300) {
    showError("weight", "Enter a weight between 1 and 300 kg.");
    isValid = false;
  }

  if (isEmpty(height) || Number(height) < 50 || Number(height) > 250) {
    showError("height", "Enter a height between 50 and 250 cm.");
    isValid = false;
  }

  if (isValid === false) {
    return false;
  }

  let meters = Number(height) / 100;
  let bmi = Number(weight) / (meters * meters);

  let category;
  let color;
  if (bmi < 18.5) {
    category = "Underweight";
    color = "#1565C0";
  } else if (bmi < 25) {
    category = "Normal weight";
    color = "#2E7D32";
  } else if (bmi < 30) {
    category = "Overweight";
    color = "#EF6C00";
  } else {
    category = "Obese";
    color = "#C62828";
  }

  let result = document.getElementById("bmiResult");
  result.innerHTML = "Your BMI is <strong>" + bmi.toFixed(1) + "</strong>: " + category;
  result.style.color = color;
  return false;
}


function checkSymptoms() {
  let symptoms = getCheckedValues("symptom");
  clearErrors(["symptom"]);

  if (symptoms.length === 0) {
    showError("symptom", "Please tick at least one symptom.");
    return false;
  }

  let suggestions = "";
  for (const symptom of symptoms) {
    switch (symptom) {
      case "fever":
        suggestions += "<li>Fever: visit <strong>Medicine</strong></li>";
        break;
      case "chestPain":
        suggestions += "<li>Chest pain: visit <strong>Cardiology</strong> (go to Emergency if the pain is severe)</li>";
        break;
      case "jointPain":
        suggestions += "<li>Joint pain: visit <strong>Orthopedics</strong></li>";
        break;
      case "childFever":
        suggestions += "<li>Fever in a child: visit <strong>Pediatrics</strong></li>";
        break;
    }
  }

  let result = document.getElementById("symptomResult");
  result.innerHTML = "Suggested departments:<ul>" + suggestions + "</ul>";
  return false;
}


fillSelect("aptDepartment", departments, "-- Select department --");
fillDoctors();
renderAppointments();
updateMedicine();
showSection("appointmentSection");
