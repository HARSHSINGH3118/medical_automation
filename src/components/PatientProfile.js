import { useState } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

import "../components/PatientDashboard.css";

const PatientProfile = ({ patient, setPatient }) => {
  const [hostelName, setHostelName] = useState(patient?.hostelName || "");
  const [roomNo, setRoomNo] = useState(patient?.roomNo || "");
  const [branch, setBranch] = useState(patient?.branch || "");
  const [section, setSection] = useState(patient?.section || "");
  const [gender, setGender] = useState(patient?.gender || "");

  const handleProfileUpdate = async () => {
    try {
      const patientID = auth.currentUser.uid;
      const patientRef = doc(db, "Users", patientID);
      await updateDoc(patientRef, {
        hostelName,
        roomNo,
        branch,
        section,
        gender,
      });
      alert("Profile updated successfully!");
      setPatient((prev) => ({
        ...prev,
        hostelName,
        roomNo,
        branch,
        section,
        gender,
      }));
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  return (
    <div className="patient-card">
      <div className="patient-info">
        <h2>{patient?.fullName}</h2>
        <p>
          <strong>SEAS B.Tech.</strong>
        </p>
        <p>Branch: {branch}</p>
        <p>Hostel Name: {hostelName}</p>
        <p>Room No: {roomNo}</p>
        <p>Contact: {patient?.contactNumber}</p>
        <p>Email: {patient?.email}</p>
        <p>Gender: {gender}</p>

        {/* Form for editing profile */}
        <div className="edit-profile">
          <label>Hostel Name:</label>
          <input
            type="text"
            value={hostelName}
            onChange={(e) => setHostelName(e.target.value)}
          />
          <label>Room No:</label>
          <input
            type="text"
            value={roomNo}
            onChange={(e) => setRoomNo(e.target.value)}
          />
          <label>Branch:</label>
          <input
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          />
          <label>Section:</label>
          <input
            type="text"
            value={section}
            onChange={(e) => setSection(e.target.value)}
          />
          <label>Gender:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <button onClick={handleProfileUpdate} className="save-btn">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
