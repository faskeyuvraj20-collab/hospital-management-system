import { db } from "./firebase.js";
import { collection, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const tableBody = document.getElementById("staffTableBody");

async function loadStaff() {
  const snapshot = await getDocs(collection(db, "staff"));

  tableBody.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${data.name || "-"}</td>
      <td>${data.email || "-"}</td>
      <td>${data.role || "-"}</td>
      <td>${data.department || "-"}</td>
      <td>${data.shift || "-"}</td>
    `;

    tableBody.appendChild(row);
  });
}

loadStaff();

/* ================= EXPORT PDF ================= */

window.exportPDF = function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Staff Management Report", 14, 15);

  doc.autoTable({
    html: "#staffTable",
    startY: 20,
  });

  doc.save("staff_report.pdf");
};
