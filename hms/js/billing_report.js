import { db } from "./firebase.js";
import { collection, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const table = document.getElementById("billingTable");

async function loadBilling() {
  const snapshot = await getDocs(collection(db, "billing"));

  snapshot.forEach(doc => {
    const data = doc.data();

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${data.patientName || "-"}</td>
      <td>${data.doctorName || "-"}</td>
      <td>₹ ${data.totalAmount || 0}</td>
      <td>${data.paymentMethod || "-"}</td>
      <td>${data.paymentStatus || "-"}</td>
            <td>${data.billingDate || "-"}</td>
    `;

    table.appendChild(row);
  });
}

loadBilling();
