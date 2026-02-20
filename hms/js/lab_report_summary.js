import { db } from "./firebase.js";
import { collection, getDocs }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const table = document.getElementById("labTable");

async function loadReports() {
  const snapshot = await getDocs(collection(db, "lab_reports"));

  table.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${data.patientName}</td>
      <td>${data.doctorName}</td>
      <td>${data.tests}</td>
      <td>${data.reportDate || "-"}</td>
    `;

    table.appendChild(row);
  });
}

loadReports();
