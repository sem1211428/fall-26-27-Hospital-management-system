const sections = ["prescriptionSection", "queueSection", "historySection", "scheduleSection"];

let editRxIndex = -1;
let mySchedule = { days: ["Sat", "Mon", "Wed"], start: "10:00", end: "14:00" };

const rxFields = ["rxPatient", "rxDate", "rxDiagnosis", "rxMedicine", "rxTiming", "rxDays"];


function getPatientNames() {
  let names = [];
  for (const record of records) {
    names.push(record.name);
  }
  return names;
}


function renderPrescriptions() {
  let keyword = document.getElementById("prescriptionSearch").value;

  let rows = "";
  let shown = 0;

  for (let i = 0; i < prescriptions.length; i++) {
    let rx = prescriptions[i];

    let matches = containsText(rx.patient, keyword) || containsText(rx.diagnosis, keyword) ||
                  containsText(rx.medicine, keyword) || containsText(rx.id, keyword);

    if (matches) {
      rows += "<tr>" +
                "<td>" + rx.id + "</td>" +
                "<td><strong>" + rx.patient + "</strong><br><span class='hint'>" + rx.date + "</span></td>" +
                "<td>" + rx.diagnosis + "</td>" +
                "<td>" + rx.medicine + "<br><span class='hint'>" + rx.timing.join(", ") + "</span></td>" +
                "<td>" + rx.days + "</td>" +
                "<td>" +
                  "<button type='button' class='btn btn-small' onclick='editPrescription(" + i + ")'>Edit</button> " +
                  "<button type='button' class='btn btn-small btn-danger' onclick='deletePrescription(" + i + ")'>Delete</button>" +
                "</td>" +
              "</tr>";
      shown++;
    }
  }

  if (shown === 0) {
    rows = "<tr><td colspan='6' class='empty-row'>No prescriptions match your search.</td></tr>";
  }

  document.getElementById("prescriptionBody").innerHTML = rows;
  document.getElementById("rxCount").innerHTML = "Showing " + shown + " of " + prescriptions.length + " prescriptions";
}


function savePrescription() {
  let patient = document.getElementById("rxPatient").value;
  let date = document.getElementById("rxDate").value;
  let diagnosis = document.getElementById("rxDiagnosis").value.trim();
  let medicine = document.getElementById("rxMedicine").value.trim();
  let timing = getCheckedValues("rxTiming");
  let days = document.getElementById("rxDays").value;
  let advice = document.getElementById("rxAdvice").value.trim();

  let isValid = true;
  clearErrors(rxFields);

  if (patient === "") {
    showError("rxPatient", "Please choose a patient.");
    isValid = false;
  }

  if (date === "") {
    showError("rxDate", "Please choose a date.");
    isValid = false;
  }

  if (diagnosis.length < 3) {
    showError("rxDiagnosis", "Diagnosis must be at least 3 characters.");
    isValid = false;
  }

  if (medicine.length < 3) {
    showError("rxMedicine", "Medicine name must be at least 3 characters.");
    isValid = false;
  }

  if (timing.length === 0) {
    showError("rxTiming", "Choose at least one time of the day.");
    isValid = false;
  }

  if (isEmpty(days) || Number(days) < 1 || Number(days) > 30) {
    showError("rxDays", "Days must be between 1 and 30.");
    isValid = false;
  }

  if (isValid === false) {
    return false;
  }

  if (editRxIndex === -1) {
    let newRx = { id: nextId("RX", prescriptions), patient: patient, date: date, diagnosis: diagnosis,
                  medicine: medicine, timing: timing, days: Number(days), advice: advice };
    prescriptions.push(newRx);
    showMessage("rxMessage", "Prescription " + newRx.id + " saved for <strong>" + patient + "</strong>.", "success");
  } else {
    let rx = prescriptions[editRxIndex];
    rx.patient = patient;
    rx.date = date;
    rx.diagnosis = diagnosis;
    rx.medicine = medicine;
    rx.timing = timing;
    rx.days = Number(days);
    rx.advice = advice;
    showMessage("rxMessage", "Prescription " + rx.id + " was updated.", "success");
  }

  resetPrescriptionForm(false);
  renderPrescriptions();
  return false;
}


function editPrescription(index) {
  let rx = prescriptions[index];
  editRxIndex = index;

  document.getElementById("rxPatient").value = rx.patient;
  document.getElementById("rxDate").value = rx.date;
  document.getElementById("rxDiagnosis").value = rx.diagnosis;
  document.getElementById("rxMedicine").value = rx.medicine;
  setCheckedValues("rxTiming", rx.timing);
  document.getElementById("rxDays").value = rx.days;
  document.getElementById("rxAdvice").value = rx.advice;

  clearErrors(rxFields);
  document.getElementById("rxFormTitle").innerHTML = "Edit Prescription " + rx.id;
  document.getElementById("rxSaveButton").value = "Update Prescription";
  hideMessage("rxMessage");
}


function deletePrescription(index) {
  let rx = prescriptions[index];
  prescriptions = removeAt(prescriptions, index);
  showMessage("rxMessage", "Prescription " + rx.id + " was deleted.", "info");
  resetPrescriptionForm(false);
  renderPrescriptions();
}


function resetPrescriptionForm(clearMessage) {
  editRxIndex = -1;
  document.getElementById("prescriptionForm").reset();
  document.getElementById("rxDate").value = todayString();
  clearErrors(rxFields);
  document.getElementById("rxFormTitle").innerHTML = "New Prescription";
  document.getElementById("rxSaveButton").value = "Save Prescription";
  if (clearMessage !== false) {
    hideMessage("rxMessage");
  }
}


function renderQueue() {
  let rows = "";
  let current = null;

  for (const item of queue) {
    let color;
    switch (item.status) {
      case "Now Calling":
        color = "green";
        current = item;
        break;
      case "Done":
        color = "grey";
        break;
      default:
        color = "orange";
    }

    rows += "<tr>" +
              "<td>" + item.token + "</td>" +
              "<td><strong>" + item.name + "</strong></td>" +
              "<td>" + item.problem + "</td>" +
              "<td><span class='badge " + color + "'>" + item.status + "</span></td>" +
            "</tr>";
  }

  document.getElementById("queueBody").innerHTML = rows;

  let box = document.getElementById("nowCalling");
  if (current !== null) {
    box.innerHTML = "Now calling: <strong>Token " + current.token + " - " + current.name + "</strong> (" + current.problem + ")";
  } else {
    box.innerHTML = "No patient is being called right now.";
  }
}


function callNextPatient() {
  for (const item of queue) {
    if (item.status === "Now Calling") {
      item.status = "Done";
    }
  }

  for (const item of queue) {
    if (item.status === "Waiting") {
      item.status = "Now Calling";
      renderQueue();
      return;
    }
  }

  renderQueue();
  document.getElementById("nowCalling").innerHTML = "All patients are done for today.";
}


function showHistory() {
  let patient = document.getElementById("historyPatient").value;
  clearErrors(["historyPatient"]);

  if (patient === "") {
    showError("historyPatient", "Please choose a patient.");
    return;
  }

  let rows = "";
  for (const visit of patientHistory) {
    if (visit.patient === patient) {
      rows += "<tr><td>" + visit.date + "</td><td>" + visit.diagnosis + "</td><td>" + visit.treatment + "</td></tr>";
    }
  }

  if (rows === "") {
    rows = "<tr><td colspan='3' class='empty-row'>No past visits found.</td></tr>";
  }

  document.getElementById("historyTitle").innerHTML = "Past visits of " + patient;
  document.getElementById("historyBody").innerHTML = rows;
}


function renderSchedule() {
  let allDays = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu"];
  let summary = document.getElementById("scheduleSummary");
  summary.innerHTML = "";

  for (const day of allDays) {
    let chip = document.createElement("span");
    chip.className = "day-chip";
    chip.innerHTML = day;
    if (mySchedule.days.indexOf(day) === -1) {
      chip.style.backgroundColor = "#CCCCCC";
      chip.style.color = "#666666";
    }
    summary.appendChild(chip);
  }

  let hours = document.createElement("p");
  hours.innerHTML = "<br>Hours: <strong>" + mySchedule.start + " to " + mySchedule.end + "</strong>";
  summary.appendChild(hours);
}


function saveSchedule() {
  let days = getCheckedValues("day");
  let start = document.getElementById("startTime").value;
  let end = document.getElementById("endTime").value;

  let isValid = true;
  clearErrors(["day", "startTime", "endTime"]);

  if (days.length === 0) {
    showError("day", "Choose at least one day.");
    isValid = false;
  }

  if (start === "") {
    showError("startTime", "Choose a start time.");
    isValid = false;
  }

  if (end === "") {
    showError("endTime", "Choose an end time.");
    isValid = false;
  } else if (start !== "" && end <= start) {
    showError("endTime", "End time must be after the start time.");
    isValid = false;
  }

  if (isValid === false) {
    return false;
  }

  mySchedule = { days: days, start: start, end: end };
  renderSchedule();
  showMessage("scheduleMessage", "Schedule saved: " + days.join(", ") + " from " + start + " to " + end + ".", "success");
  return false;
}


fillSelect("rxPatient", getPatientNames(), "-- Select patient --");
fillSelect("historyPatient", getPatientNames(), "-- Select patient --");
setCheckedValues("day", mySchedule.days);
document.getElementById("startTime").value = mySchedule.start;
document.getElementById("endTime").value = mySchedule.end;
document.getElementById("rxDate").value = todayString();

renderPrescriptions();
renderQueue();
renderSchedule();
showSection("prescriptionSection");
