import { useState } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const DoctorProfileEdit = ({ doctor, setDoctor }) => {
  const [specialization, setSpecialization] = useState(
    doctor?.specialization || ""
  );
  const [experience, setExperience] = useState(doctor?.experience || "");

  const handleProfileUpdate = async () => {
    try {
      const doctorID = auth.currentUser.uid;
      const doctorRef = doc(db, "Doctors", doctorID);
      await updateDoc(doctorRef, { specialization, experience });
      alert("Profile updated successfully!");

      // Update state in DoctorDashboard
      setDoctor((prev) => ({ ...prev, specialization, experience }));
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="profile-edit">
      <label>Specialization:</label>
      <input
        type="text"
        value={specialization}
        onChange={(e) => setSpecialization(e.target.value)}
      />
      <label>Experience (in years):</label>
      <input
        type="text"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
      />
      <button onClick={handleProfileUpdate}>Save Profile</button>
    </div>
  );
};

export default DoctorProfileEdit;
