import { db } from "./firebase.js";
import { collection, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const table = document.getElementById("admissionTable");

async function loadAdmissions() {
  const snapshot = await getDocs(collection(db, "admissions"));

  table.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${data.patientName}</td>
      <td>${data.doctorName}</td>
      <td>${data.ward}</td>
      <td>${data.bedNumber || "-"}</td>
      <td>${data.admissionDate}</td>
      <td>${data.status}</td>
    `;

    table.appendChild(row);
  });
}

loadAdmissions();
