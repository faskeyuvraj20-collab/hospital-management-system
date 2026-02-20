import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function loadDoctorReport() {
  const tableBody = document.getElementById("doctorTable");
  if (!tableBody) return;

  tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Analyzing Records...</td></tr>`;

  try {
    // 1. Fetch data (Note: verify collection names in your Firebase Console)
    const [doctorsSnap, apptSnap, opdSnap, labSnap] = await Promise.all([
      getDocs(collection(db, "doctors")),
      getDocs(collection(db, "appointments")),
      getDocs(collection(db, "opd_visits")), 
      getDocs(collection(db, "lab_requests"))
    ]);

    const appointments = apptSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const opdVisits = opdSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const labRequests = labSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // DEBUG LOG: Open Console (F12) to see if these numbers are 0
    console.log("--- HMS Debug Stats ---");
    console.log("Total Doctors found:", doctorsSnap.size);
    console.log("Total Appointments found:", appointments.length);
    console.log("Total OPD Visits found:", opdVisits.length);
    console.log("Total Lab Requests found:", labRequests.length);

    tableBody.innerHTML = ""; 

    doctorsSnap.forEach(doc => {
      const doctorData = doc.data();
      const doctorName = (doctorData.name || "").trim();
      
      // Normalize function to make "Dr. Smith" match "smith"
      const clean = (str) => {
        if (!str) return "";
        return str.toString().toLowerCase().replace(/^dr\.?\s*/, "").replace(/\./g, "").trim();
      };

      const targetName = clean(doctorName);

      // Deep Search Match: Checks EVERY field in a document for the doctor's name
      const findInRecord = (record) => {
        return Object.values(record).some(val => 
          typeof val === 'string' && clean(val) === targetName
        );
      };

      // Calculate Metrics
      const doctorAppts = appointments.filter(a => findInRecord(a));
      const completed = doctorAppts.filter(a => 
        ["Completed", "finished", "done"].includes(a.status?.toLowerCase())
      ).length;
      
      const opdCount = opdVisits.filter(v => findInRecord(v)).length;
      const labCount = labRequests.filter(l => findInRecord(l)).length;

      // Debug specific doctor if still 0
      if (opdCount === 0 && opdVisits.length > 0) {
        console.warn(`Doctor "${doctorName}" has 0 OPD visits. Check if their name is spelled correctly in 'opd_visits' collection.`);
      }

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><strong>${doctorName}</strong></td>
        <td>${doctorAppts.length}</td>
        <td>${completed}</td>
        <td>${opdCount}</td>
        <td>${labCount}</td>
      `;
      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error("Critical Report Error:", error);
    tableBody.innerHTML = `<tr><td colspan="5" style="color:red;">Error: ${error.message}</td></tr>`;
  }
}

loadDoctorReport();