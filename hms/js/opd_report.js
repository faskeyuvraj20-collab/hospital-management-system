import { db } from "./firebase.js";
import { collection, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const tableBody = document.getElementById("opdTableBody");

async function loadOPD() {

  const snapshot = await getDocs(collection(db, "opd_visits"));

  tableBody.innerHTML = "";

  snapshot.forEach(docSnap => {

    const data = docSnap.data();

    const row = document.createElement("tr");

   row.innerHTML = `
  <td>${data.patientName || "-"}</td>
  <td>${data.doctorName || "-"}</td>
  <td>${data.visitDate || "-"}</td>
`;


    tableBody.appendChild(row);
  });
}

loadOPD();
