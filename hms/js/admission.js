import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= LOAD DOCTORS ================= */
const doctorSelect = document.getElementById("doctorSelect");

const loadDoctors = async () => {
  const snap = await getDocs(collection(db, "doctors"));
  snap.forEach(doc => {
    const d = doc.data();
    const option = document.createElement("option");
    option.value = doc.id;
    option.textContent = `${d.name} (${d.department})`;
    doctorSelect.appendChild(option);
  });
};

loadDoctors();

/* ================= SAVE ADMISSION ================= */
window.saveAdmission = async function () {
  const patientName = document.getElementById("patientName").value;
  const doctorId = doctorSelect.value;
  const doctorName = doctorSelect.options[doctorSelect.selectedIndex]?.text;
  const ward = document.getElementById("ward").value;
  const bedNumber = document.getElementById("bedNumber").value;
  const reason = document.getElementById("reason").value;
  const admissionDate = document.getElementById("admissionDate").value;

  if (!patientName || !doctorId || !ward || !admissionDate) {
    alert("Please fill required fields");
    return;
  }

  try {
    await addDoc(collection(db, "admissions"), {
      patientName,
      doctorId,
      doctorName,
      ward,
      bedNumber,
      reason,
      admissionDate,
      status: "admitted",
      createdAt: serverTimestamp()
    });

    alert("Patient admitted successfully ✅");
    location.href = "../staff.html";
  } catch (err) {
    alert(err.message);
  }
};
