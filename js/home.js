function renderDoctors() {
  let keyword = document.getElementById("doctorSearch").value;
  let department = document.getElementById("doctorDepartment").value;

  let rows = "";
  let shown = 0;

  for (const doctor of doctors) {
    let matchesName = containsText(doctor.name, keyword);
    let matchesDepartment = (department === "All" || doctor.department === department);

    if (matchesName && matchesDepartment) {
      rows += "<tr>" +
                "<td><strong>" + doctor.name + "</strong></td>" +
                "<td>" + doctor.department + "</td>" +
                "<td>" + doctor.days + "</td>" +
                "<td>" + doctor.fee + " Tk</td>" +
              "</tr>";
      shown++;
    }
  }

  if (shown === 0) {
    rows = "<tr><td colspan='4' class='empty-row'>No doctors match your search.</td></tr>";
  }

  document.getElementById("doctorBody").innerHTML = rows;
  document.getElementById("doctorCount").innerHTML = shown + " doctor(s) found";
}

renderDoctors();
