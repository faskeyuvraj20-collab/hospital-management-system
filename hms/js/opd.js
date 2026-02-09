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

/* ================= SAVE OPD ================= */
window.saveOPD = async function () {
  const patientName = document.getElementById("patientName").value;
  const doctorId = doctorSelect.value;
  const doctorName = doctorSelect.options[doctorSelect.selectedIndex].text;
  const symptoms = document.getElementById("symptoms").value;
  const bp = document.getElementById("bp").value;
  const temp = document.getElementById("temp").value;
  const visitDate = document.getElementById("visitDate").value;

  if (!patientName || !doctorId || !visitDate) {
    alert("Please fill required fields");
    return;
  }

  try {
    await addDoc(collection(db, "opd_visits"), {
      patientName,
      doctorId,
      doctorName,
      symptoms,
      bloodPressure: bp,
      temperature: temp,
      visitDate,
      createdAt: serverTimestamp()
    });

    alert("OPD Visit saved successfully ✅");
    location.href = "../staff.html";
  } catch (err) {
    alert(err.message);
  }
};
