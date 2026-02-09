import { getDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { auth, db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* =========================
   LOAD DOCTORS INTO DROPDOWN
========================= */
const doctorSelect = document.getElementById("doctorSelect");

async function loadDoctors() {
  doctorSelect.innerHTML = `<option value="">Select Doctor</option>`;

  const snapshot = await getDocs(collection(db, "doctors"));

  snapshot.forEach(doc => {
    const d = doc.data();

    const option = document.createElement("option");
    option.value = d.name;
    option.dataset.department = d.department;
    option.textContent = `${d.name} (${d.department})`;

    doctorSelect.appendChild(option);
  });
}

loadDoctors();

/* =========================
   BOOK APPOINTMENT
========================= */
document
  .getElementById("appointmentForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      alert("Session expired. Please login again.");
      return;
    }

    const patientName = document.getElementById("patientName").value.trim();
    const doctorName = doctorSelect.value;
    const department =
      doctorSelect.selectedOptions[0].dataset.department;
    const date = document.getElementById("date").value;

    if (!patientName || !doctorName || !date) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "appointments"), {
        patientId: user.uid,          // 🔥 THIS WAS MISSING EARLIER
        patientName,
        doctorName,
        department,
        date,
        status: "Booked",
        createdAt: serverTimestamp()
      });
alert("Appointment booked successfully ✅");

const role = localStorage.getItem("role");

if (role === "patient") {
  window.location.href = "../patient.html";
} else if (role === "doctor" || role === "staff") {
  window.location.href = "../staff.html";
} else {
  // fallback safety
  window.location.href = "../index.html";
}

    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment");
    }
  });
