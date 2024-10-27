import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEdit,
  faCalendar,
  faBook,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons"; // Import specific icons
import SeasonalAdvisory from "./seasonalAdvisory"; // For default export
// import image from "./assets/account.png";
import MapComponent from "./Map";
import "./PatientDashboard.css";

const PatientDashboard = () => {
  const [symptoms, setSymptoms] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorID, setSelectedDoctorID] = useState("");
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [hostelName, setHostelName] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [branch, setBranch] = useState("");
  const [section, setSection] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();

  // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const patientRef = doc(db, "Users", user.uid);
        const patientSnap = await getDoc(patientRef);
        if (patientSnap.exists()) {
          const data = patientSnap.data();
          setPatient(data);
          setHostelName(data.hostelName || "");
          setRoomNo(data.roomNo || "");
          setBranch(data.branch || "");
          setSection(data.section || "");
          setGender(data.gender || "");
        }
      } catch (error) {
        console.error("Error fetching patient data: ", error);
      }
    };

    const fetchDoctors = async () => {
      const q = query(collection(db, "Users"), where("role", "==", "doctor"));
      const querySnapshot = await getDocs(q);
      const doctorData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDoctors(doctorData);
    };

    fetchPatientData();
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(
      collection(db, "Appointments"),
      where("patientID", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
    const appointmentsData = querySnapshot.docs.map((doc) => doc.data());
    setAppointments(appointmentsData);
  };

  const handleBookSlot = async () => {
    if (!symptoms || !slotTime || !selectedDoctorID) {
      alert("Please enter symptoms, select a time slot, and choose a doctor.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You need to be logged in to book a slot.");
        return;
      }

      const appointmentData = {
        patientID: user.uid,
        doctorID: selectedDoctorID,
        symptoms,
        slotTime,
        status: "Pending",
      };

      await addDoc(collection(db, "Appointments"), appointmentData);
      alert("Appointment booked successfully!");
      fetchAppointments();
    } catch (error) {
      console.error("Error booking slot: ", error);
      alert("Error booking slot. Please try again.");
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const patientRef = doc(db, "Users", user.uid);
      await updateDoc(patientRef, {
        hostelName,
        roomNo,
        branch,
        section,
        gender,
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  // Logout functionality
  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <img
          src="https://srmap.edu.in/file/2019/12/White.png"
          alt="Profile"
          className="profile-pic"
        />
        <h3>{patient?.fullName}</h3>
        <nav className="nav-menu">
          <ul>
            <li onClick={() => setActiveTab("profile")}>
              <FontAwesomeIcon icon={faUser} className="icon" /> Profile
            </li>
            <li onClick={() => setActiveTab("editProfile")}>
              <FontAwesomeIcon icon={faEdit} className="icon" /> Edit Profile
            </li>
            <li onClick={() => setActiveTab("book")}>
              <FontAwesomeIcon icon={faCalendar} className="icon" /> Book Slot
            </li>
            <li onClick={() => setActiveTab("blog")}>
              <FontAwesomeIcon icon={faBook} className="icon" /> Seasonal
              Advisory
            </li>
            <li onClick={() => setActiveTab("precautions")}>
              <FontAwesomeIcon icon={faExclamationCircle} className="icon" />{" "}
              Contact SRM-AP
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
        <div className="jankari">
          {/* Profile Tab */}
          {activeTab === "profile" && (
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
              </div>
            </div>
          )}

          {/* Hours and Contact Section */}
          {activeTab === "profile" && (
            <div className="hours-contact">
              <h3>Hours & Contact</h3>
              <p>
                OPD Service: Available from 8 AM to 5 PM on weekdays and from 9
                AM to 1 PM on Saturdays.
              </p>
              <p>
                Emergency Service: 24x7 emergency services. Phone no:
                0863-2343052
              </p>
              <p>Ambulance Service: 24/7 ambulance service is available.</p>
              <p>
                Pharmacy Service: 24/7 pharmacy for medications and
                consultations.
              </p>
            </div>
          )}
        </div>
        <div className="editandchange">
          {/* Edit Profile Tab */}
          {activeTab === "editProfile" && (
            <div className="edit-profile">
              <div className="edit-pprofile">
                <label>Hostel Name:</label>
                <input
                  type="text"
                  value={hostelName}
                  onChange={(e) => setHostelName(e.target.value)}
                />
                <br />
                <label>Room No:</label>
                <input
                  type="text"
                  value={roomNo}
                  onChange={(e) => setRoomNo(e.target.value)}
                />{" "}
                <br />
                <label>Branch:</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                />{" "}
                <br />
                <label>Section:</label>
                <input
                  type="text"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                />{" "}
                <br />
                <label>Gender:</label>
                <input
                  type="text"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                />{" "}
                <br />
                <button onClick={handleProfileUpdate} className="save">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
        <div></div>
        <div className="slot_booking">
          {/* Book Slot Tab */}
          {activeTab === "book" && (
            <div className="slot-booking">
              <h3>Book a Slot</h3>
              <div>
                <label>Symptoms</label>
                <input
                  type="text"
                  placeholder="Enter symptoms"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </div>
              <div>
                <label>Choose a Time Slot</label>
                <input
                  type="datetime-local"
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
                />
              </div>

              {/* Doctor selection */}
              <div>
                <label>Select a Doctor</label>
                <select
                  value={selectedDoctorID}
                  onChange={(e) => setSelectedDoctorID(e.target.value)}
                >
                  <option value="">-- Select Doctor --</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <button onClick={handleBookSlot}>Book Slot</button>
              <div>
                {/* Display booked appointments */}
                <div className="appointments-list">
                  <h3>Your Appointments</h3>
                  {appointments.length > 0 ? (
                    appointments.map((appointment, index) => (
                      <div key={index} className="appointment-card">
                        <p>Symptoms: {appointment.symptoms}</p>
                        <p>Slot Time: {appointment.slotTime}</p>
                        <p>Status: {appointment.status}</p>
                        {appointment.prescription && (
                          <p>Prescription: {appointment.prescription}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No appointments booked yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="api">
          {/* Blog Tab */}
          {activeTab === "blog" && (
            <div className="blog-section">
              <h3>Seasonal Advisory</h3>
              <p>
                <SeasonalAdvisory />
              </p>
            </div>
          )}
        </div>
        <div className="location">
          {/* Precautions Tab */}
          {activeTab === "precautions" && (
            <div className="precaution-section">
              <h2>Contact SRM-AP</h2>
              <h3>Address:</h3>
              <h3>
                SRM University- AP, Neerukonda, Mangalagiri Mandal Guntur
                District, Andhra Pradesh-522240
              </h3>
              <h3>Contact : +91-863-2343000 / 080-6988-6999</h3>
              <h3>Email: admissions@srmap.edu.in</h3>
              <div className="map">
                <MapComponent />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
