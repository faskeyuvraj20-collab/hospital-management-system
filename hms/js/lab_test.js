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

/* ================= SAVE LAB REQUEST ================= */
window.saveLabRequest = async function () {
  const patientName = document.getElementById("patientName").value;
  const doctorId = doctorSelect.value;
  const doctorName = doctorSelect.options[doctorSelect.selectedIndex]?.text;
  const tests = document.getElementById("tests").value;
  const notes = document.getElementById("notes").value;
  const requestDate = document.getElementById("requestDate").value;

  if (!patientName || !doctorId || !tests) {
    alert("Please fill required fields");
    return;
  }

  try {
    await addDoc(collection(db, "lab_requests"), {
      patientName,
      doctorId,
      doctorName,
      tests,
      notes,
      status: "pending",
      requestDate,
      createdAt: serverTimestamp()
    });

    alert("Lab test requested successfully ✅");
    location.href = "../staff.html";
  } catch (err) {
    alert(err.message);
  }
};
