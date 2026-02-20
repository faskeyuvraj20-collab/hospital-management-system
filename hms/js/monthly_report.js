import { db } from "./firebase.js";
import { collection, getDocs }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const table = document.getElementById("monthlyTable");

async function loadMonthly() {

  const snap = await getDocs(collection(db, "appointments"));

  const monthlyData = {};

  snap.forEach(doc => {
    const data = doc.data();
    if (!data.date) return;

    const month = data.date.substring(0, 7); // YYYY-MM

    if (!monthlyData[month]) {
      monthlyData[month] = { total: 0, completed: 0 };
    }

    monthlyData[month].total++;

    if (data.status === "Completed") {
      monthlyData[month].completed++;
    }
  });

  for (let month in monthlyData) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${month}</td>
      <td>${monthlyData[month].total}</td>
      <td>${monthlyData[month].completed}</td>
    `;

    table.appendChild(row);
  }
}

loadMonthly();
