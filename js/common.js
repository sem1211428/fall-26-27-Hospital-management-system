function showSection(sectionId) {
  for (let i = 0; i < sections.length; i++) {
    let section = document.getElementById(sections[i]);
    let navButton = document.getElementById("nav-" + sections[i]);

    if (sections[i] === sectionId) {
      section.style.display = "block";
      navButton.className = "active";
    } else {
      section.style.display = "none";
      navButton.className = "";
    }
  }
}

function showError(fieldId, message) {
  document.getElementById(fieldId + "Error").innerHTML = message;

  let field = document.getElementById(fieldId);
  if (field != null) {
    field.style.border = "2px solid red";
  }
}

function clearError(fieldId) {
  document.getElementById(fieldId + "Error").innerHTML = "";

  let field = document.getElementById(fieldId);
  if (field != null) {
    field.style.border = "";
  }
}

function clearErrors(fieldIds) {
  for (let i = 0; i < fieldIds.length; i++) {
    clearError(fieldIds[i]);
  }
}

function showMessage(boxId, text, type) {
  let box = document.getElementById(boxId);
  box.innerHTML = text;
  box.className = "message " + type;
  box.style.display = "block";
}

function hideMessage(boxId) {
  document.getElementById(boxId).style.display = "none";
}

function isEmpty(value) {
  return value.trim() === "";
}

function isValidEmail(email) {
  let atPosition = email.indexOf("@");
  let dotPosition = email.indexOf(".", atPosition);

  if (atPosition < 1) {
    return false;
  }
  if (dotPosition < atPosition + 2) {
    return false;
  }
  if (dotPosition === email.length - 1) {
    return false;
  }
  return true;
}

function isDigitsOnly(text) {
  if (text.length === 0) {
    return false;
  }
  let digits = "0123456789";
  for (let i = 0; i < text.length; i++) {
    if (digits.indexOf(text[i]) === -1) {
      return false;
    }
  }
  return true;
}

function isValidPhone(phone) {
  return isDigitsOnly(phone) && phone.length === 11 && phone.slice(0, 2) === "01";
}

function getRadioValue(groupName) {
  let radios = document.getElementsByName(groupName);
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      return radios[i].value;
    }
  }
  return "";
}

function setRadioValue(groupName, value) {
  let radios = document.getElementsByName(groupName);
  for (let i = 0; i < radios.length; i++) {
    radios[i].checked = (radios[i].value === value);
  }
}

function getCheckedValues(groupName) {
  let values = [];
  let boxes = document.getElementsByName(groupName);
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].checked) {
      values.push(boxes[i].value);
    }
  }
  return values;
}

function setCheckedValues(groupName, values) {
  let boxes = document.getElementsByName(groupName);
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].checked = (values.indexOf(boxes[i].value) !== -1);
  }
}

function containsText(text, keyword) {
  return String(text).toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
}

function removeAt(list, index) {
  return list.slice(0, index).concat(list.slice(index + 1));
}

function nextId(prefix, list) {
  let biggest = 0;
  let digits = 3;
  for (let i = 0; i < list.length; i++) {
    let numberText = list[i].id.slice(prefix.length + 1);
    digits = numberText.length;
    if (Number(numberText) > biggest) {
      biggest = Number(numberText);
    }
  }

  let newNumber = String(biggest + 1);
  while (newNumber.length < digits) {
    newNumber = "0" + newNumber;
  }
  return prefix + "-" + newNumber;
}

function todayString() {
  let now = new Date();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  if (month < 10) { month = "0" + month; }
  if (day < 10) { day = "0" + day; }
  return now.getFullYear() + "-" + month + "-" + day;
}

function daysBetween(firstDate, secondDate) {
  let oneDay = 1000 * 60 * 60 * 24;
  let difference = new Date(secondDate + "T00:00") - new Date(firstDate + "T00:00");
  return Math.round(difference / oneDay);
}

function fillSelect(selectId, items, firstText) {
  let select = document.getElementById(selectId);
  select.innerHTML = "";

  let first = document.createElement("option");
  first.value = "";
  first.innerHTML = firstText;
  select.appendChild(first);

  for (const item of items) {
    let option = document.createElement("option");
    option.value = item;
    option.innerHTML = item;
    select.appendChild(option);
  }
}
