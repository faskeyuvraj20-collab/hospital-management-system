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

/* ================= AUTO CALCULATE TOTAL ================= */
const calcTotal = () => {
  const c = Number(document.getElementById("consultationFee").value || 0);
  const l = Number(document.getElementById("labCharges").value || 0);
  const m = Number(document.getElementById("medicineCharges").value || 0);
  document.getElementById("totalAmount").value = c + l + m;
};

document.getElementById("consultationFee").addEventListener("input", calcTotal);
document.getElementById("labCharges").addEventListener("input", calcTotal);
document.getElementById("medicineCharges").addEventListener("input", calcTotal);

/* ================= SAVE BILL ================= */
window.saveBill = async function () {
  const patientName = document.getElementById("patientName").value;
  const doctorId = doctorSelect.value;
  const doctorName = doctorSelect.options[doctorSelect.selectedIndex]?.text;
  const consultationFee = Number(document.getElementById("consultationFee").value || 0);
  const labCharges = Number(document.getElementById("labCharges").value || 0);
  const medicineCharges = Number(document.getElementById("medicineCharges").value || 0);
  const totalAmount = Number(document.getElementById("totalAmount").value || 0);
  const paymentMethod = document.getElementById("paymentMethod").value;
  const paymentStatus = document.getElementById("paymentStatus").value;
  const billingDate = document.getElementById("billingDate").value;

  if (!patientName || !doctorId || !paymentStatus) {
    alert("Please fill required fields");
    return;
  }

  try {
    await addDoc(collection(db, "billing"), {
      patientName,
      doctorId,
      doctorName,
      consultationFee,
      labCharges,
      medicineCharges,
      totalAmount,
      paymentMethod,
      paymentStatus,
      billingDate,
      createdAt: serverTimestamp()
    });

    alert("Billing record saved successfully ✅");
    location.href = "../staff.html";
  } catch (err) {
    alert(err.message);
  }
};
