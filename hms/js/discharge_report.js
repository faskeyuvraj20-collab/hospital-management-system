import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  loadDischargeReport();
});

async function loadDischargeReport(){

  const table = document.getElementById("dischargeTable");
  table.innerHTML = "";

  try {

    const snapshot = await getDocs(collection(db,"discharge_summaries"));

    snapshot.forEach(docSnap => {

      const data = docSnap.data();

      const formattedDate = data.dischargeDate
        ? new Date(data.dischargeDate).toLocaleDateString()
        : "-";

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${data.patientName || "-"}</td>
        <td>${data.doctorName || "-"}</td>
        <td>${formattedDate}</td>
        <td>${data.diagnosis || "-"}</td>
        <td>${data.treatment || "-"}</td>
        <td>${data.advice || "-"}</td>
      `;

      table.appendChild(row);

    });

  } catch(error){
    console.error("Error loading discharge report:",error);
  }
}
