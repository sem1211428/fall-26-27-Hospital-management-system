const sections = ["usersSection", "statsSection", "feesSection", "noticeSection"];

let editUserIndex = -1;

const userFields = ["userName", "userUsername", "userEmail", "userPassword", "userRole"];
const feeFields = ["generalFee", "specialistFee", "bedFee"];
const noticeFields = ["noticeTitle", "noticeText"];


function renderUsers() {
  let keyword = document.getElementById("userSearch").value;
  let roleFilter = document.getElementById("userRoleFilter").value;

  let rows = "";
  let shown = 0;

  for (let i = 0; i < users.length; i++) {
    let user = users[i];

    let matchesKeyword = containsText(user.name, keyword) || containsText(user.username, keyword) ||
                         containsText(user.email, keyword);
    let matchesRole = (roleFilter === "All" || user.role === roleFilter);

    if (matchesKeyword && matchesRole) {
      let statusColor;
      switch (user.status) {
        case "Active":
          statusColor = "green";
          break;
        case "Pending":
          statusColor = "orange";
          break;
        default:
          statusColor = "red";
      }

      let actions = "<button type='button' class='btn btn-small' onclick='editUser(" + i + ")'>Edit</button> " +
                    "<button type='button' class='btn btn-small btn-danger' onclick='deleteUser(" + i + ")'>Delete</button>";
      if (user.status === "Pending") {
        actions = "<button type='button' class='btn btn-small btn-success' onclick='approveUser(" + i + ")'>Approve</button> " + actions;
      }

      rows += "<tr>" +
                "<td>" + user.id + "</td>" +
                "<td><strong>" + user.name + "</strong><br><span class='hint'>" + user.username + " &middot; " + user.email + "</span></td>" +
                "<td><span class='badge " + user.role.toLowerCase() + "'>" + user.role + "</span></td>" +
                "<td><span class='badge " + statusColor + "'>" + user.status + "</span></td>" +
                "<td>" + actions + "</td>" +
              "</tr>";
      shown++;
    }
  }

  if (shown === 0) {
    rows = "<tr><td colspan='5' class='empty-row'>No users match your search.</td></tr>";
  }

  document.getElementById("userTableBody").innerHTML = rows;
  document.getElementById("userCount").innerHTML = "Showing " + shown + " of " + users.length + " users";
}


function saveUser() {
  let name = document.getElementById("userName").value.trim();
  let username = document.getElementById("userUsername").value.trim();
  let email = document.getElementById("userEmail").value.trim();
  let password = document.getElementById("userPassword").value;
  let role = document.getElementById("userRole").value;
  let status = document.getElementById("userStatus").value;

  let isValid = true;
  clearErrors(userFields);

  if (name.length < 3) {
    showError("userName", "Name must be at least 3 characters.");
    isValid = false;
  }

  if (username.length < 4) {
    showError("userUsername", "Username must be at least 4 characters.");
    isValid = false;
  } else if (isTakenByOther("username", username)) {
    showError("userUsername", "This username is already taken.");
    isValid = false;
  }

  if (isEmpty(email) || isValidEmail(email) === false) {
    showError("userEmail", "Please enter a valid email address.");
    isValid = false;
  } else if (isTakenByOther("email", email)) {
    showError("userEmail", "This email is already used.");
    isValid = false;
  }

  if (password.length < 8) {
    showError("userPassword", "Password must be at least 8 characters.");
    isValid = false;
  }

  if (role === "") {
    showError("userRole", "Please choose a role.");
    isValid = false;
  }

  if (isValid === false) {
    return false;
  }

  if (editUserIndex === -1) {
    let newUser = { id: nextId("U", users), name: name, username: username, password: password,
                    email: email, phone: "", role: role, status: status };
    users.push(newUser);
    showMessage("userMessage", "User <strong>" + name + "</strong> was added with id " + newUser.id + ".", "success");
  } else {
    let user = users[editUserIndex];
    user.name = name;
    user.username = username;
    user.email = email;
    user.password = password;
    user.role = role;
    user.status = status;
    showMessage("userMessage", "User " + user.id + " was updated.", "success");
  }

  resetUserForm(false);
  renderUsers();
  return false;
}


function isTakenByOther(field, value) {
  for (let i = 0; i < users.length; i++) {
    if (i !== editUserIndex && String(users[i][field]).toLowerCase() === value.toLowerCase()) {
      return true;
    }
  }
  return false;
}


function editUser(index) {
  let user = users[index];
  editUserIndex = index;

  document.getElementById("userName").value = user.name;
  document.getElementById("userUsername").value = user.username;
  document.getElementById("userEmail").value = user.email;
  document.getElementById("userPassword").value = user.password;
  document.getElementById("userRole").value = user.role;
  document.getElementById("userStatus").value = user.status;

  clearErrors(userFields);
  document.getElementById("userFormTitle").innerHTML = "Edit User " + user.id;
  document.getElementById("userSaveButton").value = "Update User";
  hideMessage("userMessage");
}


function deleteUser(index) {
  let user = users[index];

  if (user.id === "U-001") {
    showMessage("userMessage", "The main admin account cannot be deleted.", "error");
    return;
  }

  users = removeAt(users, index);
  showMessage("userMessage", "User <strong>" + user.name + "</strong> was deleted.", "info");
  resetUserForm(false);
  renderUsers();
}


function approveUser(index) {
  users[index].status = "Active";
  showMessage("userMessage", users[index].name + " is approved and can log in now.", "success");
  renderUsers();
}


function resetUserForm(clearMessage) {
  editUserIndex = -1;
  document.getElementById("userForm").reset();
  clearErrors(userFields);
  document.getElementById("userFormTitle").innerHTML = "Add New User";
  document.getElementById("userSaveButton").value = "Add User";
  if (clearMessage !== false) {
    hideMessage("userMessage");
  }
}


function countByRole(role) {
  let count = 0;
  for (const user of users) {
    if (user.role === role) {
      count++;
    }
  }
  return count;
}


function renderStats() {
  let pending = 0;
  for (const user of users) {
    if (user.status === "Pending") {
      pending++;
    }
  }

  let cards = [
    { number: users.length, label: "Total users" },
    { number: pending, label: "Waiting for approval" },
    { number: appointments.length, label: "Appointments" },
    { number: admittedBeds.length, label: "Admitted patients" },
    { number: notices.length, label: "Notices posted" }
  ];

  let grid = document.getElementById("statsGrid");
  grid.innerHTML = "";
  for (const item of cards) {
    let card = document.createElement("div");
    card.className = "stat-card";
    card.innerHTML = "<div class='stat-number'>" + item.number + "</div><div class='stat-label'>" + item.label + "</div>";
    grid.appendChild(card);
  }

  let roles = ["Admin", "Doctor", "Patient", "Receptionist"];
  let bars = document.getElementById("roleBars");
  bars.innerHTML = "";
  for (const role of roles) {
    let count = countByRole(role);
    let percent = Math.round(count / users.length * 100);

    let row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = "<span class='bar-label'>" + role + " (" + count + ")</span>" +
                    "<div class='bar-track'><div class='bar-fill'></div></div>" +
                    "<span>" + percent + "%</span>";
    bars.appendChild(row);
    row.getElementsByClassName("bar-fill")[0].style.width = percent + "%";
  }
}


function renderFees() {
  document.getElementById("generalFee").value = fees.general;
  document.getElementById("specialistFee").value = fees.specialist;
  document.getElementById("bedFee").value = fees.bed;

  document.getElementById("feesBody").innerHTML =
    "<tr><td>General doctor visit</td><td>" + fees.general + " Tk</td></tr>" +
    "<tr><td>Specialist visit</td><td>" + fees.specialist + " Tk</td></tr>" +
    "<tr><td>Bed (per day)</td><td>" + fees.bed + " Tk</td></tr>";
}


function saveFees() {
  let general = document.getElementById("generalFee").value;
  let specialist = document.getElementById("specialistFee").value;
  let bed = document.getElementById("bedFee").value;

  let isValid = true;
  clearErrors(feeFields);

  if (isEmpty(general) || Number(general) <= 0) {
    showError("generalFee", "Enter a fee greater than 0.");
    isValid = false;
  }
  if (isEmpty(specialist) || Number(specialist) <= 0) {
    showError("specialistFee", "Enter a fee greater than 0.");
    isValid = false;
  }
  if (isEmpty(bed) || Number(bed) <= 0) {
    showError("bedFee", "Enter a fee greater than 0.");
    isValid = false;
  }

  if (isValid === false) {
    return false;
  }

  fees.general = Number(general);
  fees.specialist = Number(specialist);
  fees.bed = Number(bed);

  renderFees();
  showMessage("feesMessage", "Fees saved successfully.", "success");
  return false;
}


function renderNotices() {
  let list = document.getElementById("noticeList");
  list.innerHTML = "";

  for (let i = 0; i < notices.length; i++) {
    let notice = notices[i];
    let color;

    switch (notice.audience) {
      case "Doctor":
        color = "#1565C0";
        break;
      case "Patient":
        color = "#2E7D32";
        break;
      case "Receptionist":
        color = "#EF6C00";
        break;
      default:
        color = "#0B7A75";
    }

    let item = document.createElement("div");
    item.className = "notice-item";
    item.style.borderLeftColor = color;
    item.innerHTML = "<h4>" + notice.title + "</h4>" +
                     "<p class='hint'>For: " + notice.audience + " &middot; " + notice.date + "</p>" +
                     "<p>" + notice.text + "</p>" +
                     "<button type='button' class='btn btn-small btn-danger' onclick='deleteNotice(" + i + ")'>Delete</button>";
    list.appendChild(item);
  }

  if (notices.length === 0) {
    list.innerHTML = "<p class='empty-row'>No notices yet.</p>";
  }
}


function postNotice() {
  let title = document.getElementById("noticeTitle").value.trim();
  let audience = document.getElementById("noticeFor").value;
  let text = document.getElementById("noticeText").value.trim();

  let isValid = true;
  clearErrors(noticeFields);

  if (title.length < 3) {
    showError("noticeTitle", "Title must be at least 3 characters.");
    isValid = false;
  }
  if (text.length < 10) {
    showError("noticeText", "Notice must be at least 10 characters.");
    isValid = false;
  }

  if (isValid === false) {
    return false;
  }

  notices.unshift({ id: nextId("N", notices), title: title, audience: audience, text: text, date: todayString() });

  document.getElementById("noticeForm").reset();
  renderNotices();
  showMessage("noticeMessage", "Notice posted.", "success");
  return false;
}


function deleteNotice(index) {
  notices = removeAt(notices, index);
  renderNotices();
  showMessage("noticeMessage", "Notice deleted.", "info");
}


renderUsers();
renderStats();
renderFees();
renderNotices();
showSection("usersSection");
