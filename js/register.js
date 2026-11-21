const commonFields = ["fullName", "email", "phone", "gender", "dob", "newUsername", "newPassword", "confirmPassword", "terms"];
const patientFields = ["bloodGroup", "address"];
const doctorFields = ["department", "bmdcNo"];
const receptionistFields = ["employeeId", "shift"];


function showTypeFields() {
  let type = getRadioValue("userType");

  document.getElementById("formBody").style.display = (type === "") ? "none" : "block";
  document.getElementById("patientFields").style.display = (type === "Patient") ? "block" : "none";
  document.getElementById("doctorFields").style.display = (type === "Doctor") ? "block" : "none";
  document.getElementById("receptionistFields").style.display = (type === "Receptionist") ? "block" : "none";

  if (type !== "") {
    document.getElementById("registerButton").value = "Create " + type + " Account";
  }

  clearAllRegisterErrors();
}


function validateRegister() {
  let type = getRadioValue("userType");
  clearAllRegisterErrors();

  if (type === "") {
    showError("userType", "Please choose the type of account.");
    return false;
  }

  let commonOk = validateCommon(type);
  let typeOk;

  switch (type) {
    case "Patient":
      typeOk = validatePatient();
      break;
    case "Doctor":
      typeOk = validateDoctor();
      break;
    case "Receptionist":
      typeOk = validateReceptionist();
      break;
  }

  if (!(commonOk && typeOk)) {
    showMessage("registerMessage", "Please fix the fields marked in red.", "error");
    return false;
  }

  let newUser = {
    id: nextId("U", users),
    name: document.getElementById("fullName").value.trim(),
    username: document.getElementById("newUsername").value.trim(),
    password: document.getElementById("newPassword").value,
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    gender: getRadioValue("gender"),
    dob: document.getElementById("dob").value,
    role: type,
    status: "Active"
  };

  if (type === "Patient") {
    newUser.bloodGroup = document.getElementById("bloodGroup").value;
    newUser.address = document.getElementById("address").value.trim();
  } else if (type === "Doctor") {
    newUser.department = document.getElementById("department").value;
    newUser.bmdcNo = document.getElementById("bmdcNo").value.trim().toUpperCase();
    newUser.status = "Pending";
  } else {
    newUser.employeeId = document.getElementById("employeeId").value.trim().toUpperCase();
    newUser.shift = getRadioValue("shift");
    newUser.status = "Pending";
  }

  users.push(newUser);
  console.log("New user:", newUser);

  document.getElementById("registerForm").reset();
  showTypeFields();

  let text = "Welcome, <strong>" + newUser.name + "</strong>! Your " + type.toLowerCase() +
             " account was created (user id " + newUser.id + "). ";
  if (newUser.status === "Pending") {
    text += "An admin will check your details. You can log in after approval.";
  } else {
    text += "<a href='login.html'>Log in now</a>.";
  }
  showMessage("registerMessage", text, "success");
  return false;
}


function validateCommon(type) {
  let isValid = true;

  let fullName = document.getElementById("fullName").value.trim();
  let email = document.getElementById("email").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let dob = document.getElementById("dob").value;
  let username = document.getElementById("newUsername").value.trim();
  let password = document.getElementById("newPassword").value;
  let confirmPassword = document.getElementById("confirmPassword").value;

  if (fullName.length < 3) {
    showError("fullName", "Full name must be at least 3 characters.");
    isValid = false;
  }

  if (isEmpty(email)) {
    showError("email", "Email is required.");
    isValid = false;
  } else if (isValidEmail(email) === false) {
    showError("email", "Please enter a valid email address.");
    isValid = false;
  } else if (isTaken("email", email)) {
    showError("email", "An account with this email already exists.");
    isValid = false;
  }

  if (isValidPhone(phone) === false) {
    showError("phone", "Phone must be 11 digits and start with 01.");
    isValid = false;
  }

  if (getRadioValue("gender") === "") {
    showError("gender", "Please select an option.");
    isValid = false;
  }

  let minimumAge = (type === "Patient") ? 0 : 18;
  if (dob === "") {
    showError("dob", "Date of birth is required.");
    isValid = false;
  } else if (daysBetween(dob, todayString()) < 0) {
    showError("dob", "Date of birth cannot be in the future.");
    isValid = false;
  } else if (daysBetween(dob, todayString()) / 365 < minimumAge) {
    showError("dob", "A " + type.toLowerCase() + " must be at least " + minimumAge + " years old.");
    isValid = false;
  }

  if (username.length < 4) {
    showError("newUsername", "Username must be at least 4 characters.");
    isValid = false;
  } else if (isTaken("username", username)) {
    showError("newUsername", "This username is already taken.");
    isValid = false;
  }

  if (password.length < 8) {
    showError("newPassword", "Password must be at least 8 characters.");
    isValid = false;
  }

  if (confirmPassword === "") {
    showError("confirmPassword", "Please confirm your password.");
    isValid = false;
  } else if (confirmPassword !== password) {
    showError("confirmPassword", "Passwords do not match.");
    isValid = false;
  }

  if (document.getElementById("terms").checked === false) {
    showError("terms", "You must agree to the terms.");
    isValid = false;
  }

  return isValid;
}


function validatePatient() {
  let isValid = true;

  if (document.getElementById("bloodGroup").value === "") {
    showError("bloodGroup", "Please select your blood group.");
    isValid = false;
  }

  if (document.getElementById("address").value.trim().length < 5) {
    showError("address", "Please enter your address (at least 5 characters).");
    isValid = false;
  }

  return isValid;
}


function validateDoctor() {
  let isValid = true;
  let bmdcNo = document.getElementById("bmdcNo").value.trim();

  if (document.getElementById("department").value === "") {
    showError("department", "Please select a department.");
    isValid = false;
  }

  let letter = bmdcNo.slice(0, 1).toUpperCase();
  let numbers = bmdcNo.slice(2);
  if (letter < "A" || letter > "Z" || bmdcNo.slice(1, 2) !== "-" || isDigitsOnly(numbers) === false || numbers.length < 4 || numbers.length > 6) {
    showError("bmdcNo", "BMDC number looks like A-12345.");
    isValid = false;
  }

  return isValid;
}


function validateReceptionist() {
  let isValid = true;
  let employeeId = document.getElementById("employeeId").value.trim().toUpperCase();

  if (employeeId.slice(0, 4) !== "EMP-" || isDigitsOnly(employeeId.slice(4)) === false || employeeId.length !== 8) {
    showError("employeeId", "Employee ID looks like EMP-1234.");
    isValid = false;
  }

  if (getRadioValue("shift") === "") {
    showError("shift", "Please choose a shift.");
    isValid = false;
  }

  return isValid;
}


function isTaken(field, value) {
  for (const user of users) {
    if (String(user[field]).toLowerCase() === value.toLowerCase()) {
      return true;
    }
  }
  return false;
}


function clearAllRegisterErrors() {
  clearErrors(["userType"]);
  clearErrors(commonFields);
  clearErrors(patientFields);
  clearErrors(doctorFields);
  clearErrors(receptionistFields);
  hideMessage("registerMessage");
}
