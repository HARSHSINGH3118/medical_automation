import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  getDoc,
  doc, // Import `doc` correctly
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCalendar, faEdit } from "@fortawesome/free-solid-svg-icons";
import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [prescription, setPrescription] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [doctor, setDoctor] = useState(null);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [acceptedAppointments, setAcceptedAppointments] = useState(0);
  const [pendingAppointments, setPendingAppointments] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const doctorID = currentUser.uid;
        const q = query(
          collection(db, "Appointments"),
          where("doctorID", "==", doctorID)
        );
        const querySnapshot = await getDocs(q);

        const appointmentsData = await Promise.all(
          querySnapshot.docs.map(async (docSnap) => {
            const appointmentData = docSnap.data();
            const patientRef = doc(db, "Users", appointmentData.patientID); // Assume "Users" contains patient data
            const patientSnap = await getDoc(patientRef);
            const patientName = patientSnap.exists()
              ? patientSnap.data().fullName
              : "Unknown Patient"; // Default if patient data is not found
            return { id: docSnap.id, ...appointmentData, patientName };
          })
        );

        setAppointments(appointmentsData);
        setTotalAppointments(appointmentsData.length);
        setAcceptedAppointments(
          appointmentsData.filter((appt) => appt.status === "Accepted").length
        );
        setPendingAppointments(
          appointmentsData.filter((appt) => appt.status === "Pending").length
        );
      }
    };

    const fetchDoctorData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const doctorID = currentUser.uid;
        const doctorRef = doc(db, "Users", doctorID);
        const doctorSnap = await getDoc(doctorRef);

        if (doctorSnap.exists()) {
          setDoctor(doctorSnap.data());
        }
      }
    };

    fetchAppointments();
    fetchDoctorData();
  }, []);

  const handleUpdateStatus = async (appointmentID, status) => {
    try {
      const appointmentRef = doc(db, "Appointments", appointmentID);
      await updateDoc(appointmentRef, { status });
      alert(`Appointment ${status}`);
      setAppointments((prevAppointments) =>
        prevAppointments.map((appt) =>
          appt.id === appointmentID ? { ...appt, status } : appt
        )
      );
    } catch (error) {
      console.error("Error updating appointment status: ", error);
    }
  };

  const handleAddPrescription = async (appointmentID) => {
    try {
      const appointmentRef = doc(db, "Appointments", appointmentID);
      await updateDoc(appointmentRef, { prescription });
      alert("Prescription added");
      setPrescription("");
      setAppointments((prevAppointments) =>
        prevAppointments.map((appt) =>
          appt.id === appointmentID ? { ...appt, prescription } : appt
        )
      );
    } catch (error) {
      console.error("Error adding prescription: ", error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const doctorID = currentUser.uid;
        const doctorRef = doc(db, "Users", doctorID);
        await updateDoc(doctorRef, {
          specialization: doctor.specialization,
          experience: doctor.experience,
        });
        alert("Profile updated successfully");
        setActiveTab("profile");
      }
    } catch (error) {
      console.error("Error updating doctor profile: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div className="mainpage">
      {/* Left Section for Doctor Profile */}
      <div className="left">
        <div className="Docprofile">
          <img
            src="https://srmap.edu.in/file/2019/12/White.png"
            alt="SRM AP Logo"
            className="srm-logo"
          />
          {doctor ? (
            <>
              <h4 className="doctor-name">Dr. {doctor.fullName}</h4>
              <ul className="nav-menu">
                <li onClick={() => setActiveTab("profile")}>
                  <FontAwesomeIcon icon={faUser} /> Profile
                </li>
                <li onClick={() => setActiveTab("appointments")}>
                  <FontAwesomeIcon icon={faCalendar} /> Appointments
                </li>
                <li onClick={() => setActiveTab("edit-profile")}>
                  <FontAwesomeIcon icon={faEdit} /> Edit Profile
                </li>
              </ul>
            </>
          ) : (
            <p>Loading doctor information...</p>
          )}
        </div>
      </div>

      {/* Logout Button - Top Right */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      {/* Right Section */}
      <div className="right">
        {activeTab === "profile" && (
          <>
            <div className="profile-section">
              <h4>Profile</h4>
              <p>
                <strong>Name:</strong> {doctor?.fullName}
              </p>
              <p>
                <strong>Specialization:</strong>{" "}
                {doctor?.specialization || "N/A"}
              </p>
              <p>
                <strong>Experience:</strong> {doctor?.experience || "N/A"} Years
              </p>
            </div>
            <div className="stats-section">
              <h4>Appointment Statistics</h4>
              <p>
                <strong>Total Appointments:</strong> {totalAppointments}
              </p>
              <p>
                <strong>Accepted Appointments:</strong> {acceptedAppointments}
              </p>
              <p>
                <strong>Pending Appointments:</strong> {pendingAppointments}
              </p>
            </div>
          </>
        )}

        {activeTab === "appointments" && (
          <div className="rightmain">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card">
                  <p>
                    <strong>Patient Name:</strong> {appointment.patientName}
                  </p>
                  <p>
                    <strong>Symptoms:</strong> {appointment.symptoms}
                  </p>
                  <p>
                    <strong>Slot Time:</strong> {appointment.slotTime}
                  </p>
                  <p>
                    <strong>Status:</strong> {appointment.status}
                  </p>
                  <p>
                    <strong>Prescription:</strong>{" "}
                    {appointment.prescription || "No prescription added yet."}
                  </p>
                  <button
                    onClick={() =>
                      handleUpdateStatus(appointment.id, "Accepted")
                    }
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(appointment.id, "Rejected")
                    }
                  >
                    Reject
                  </button>
                  {appointment.status === "Accepted" && (
                    <div className="prescription-section">
                      <h4>Add Prescription</h4>
                      <input
                        type="text"
                        placeholder="Enter prescription"
                        value={prescription}
                        onChange={(e) => setPrescription(e.target.value)}
                      />
                      <button
                        onClick={() => handleAddPrescription(appointment.id)}
                      >
                        Submit Prescription
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No appointments available.</p>
            )}
          </div>
        )}

        {activeTab === "edit-profile" && (
          <div className="edit-profile-section">
            <h4>Edit Profile</h4>
            <label>Specialization:</label>
            <input
              type="text"
              value={doctor?.specialization || ""}
              onChange={(e) =>
                setDoctor({ ...doctor, specialization: e.target.value })
              }
            />
            <label>Experience (in years):</label>
            <input
              type="number"
              value={doctor?.experience || ""}
              onChange={(e) =>
                setDoctor({ ...doctor, experience: e.target.value })
              }
            />
            <button onClick={handleProfileUpdate}>Save Profile</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
