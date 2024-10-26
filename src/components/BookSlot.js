// src/components/BookSlot.js
import { useState } from "react";
import { auth, db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

const BookSlot = ({ appointments, setAppointments }) => {
  const [symptoms, setSymptoms] = useState("");
  const [slotTime, setSlotTime] = useState("");

  const handleBookSlot = async () => {
    try {
      const newAppointment = {
        patientID: auth.currentUser.uid,
        doctorID: "someDoctorID",
        symptoms,
        slotTime,
        status: "Pending",
      };
      await addDoc(collection(db, "Appointments"), newAppointment);
      setAppointments((prev) => [...prev, newAppointment]);
      alert("Appointment booked!");
    } catch (error) {
      console.error("Error booking slot: ", error);
    }
  };

  return (
    <div className="slot-booking">
      <h3>Book a Slot</h3>
      <input
        type="text"
        placeholder="Enter symptoms"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />
      <input
        type="datetime-local"
        value={slotTime}
        onChange={(e) => setSlotTime(e.target.value)}
      />
      <button onClick={handleBookSlot}>Book Slot</button>

      <div>
        <h3>Your Appointments</h3>
        {appointments.length > 0 ? (
          appointments.map((appointment, index) => (
            <div key={index}>
              <p>Symptoms: {appointment.symptoms}</p>
              <p>Slot Time: {appointment.slotTime}</p>
              <p>Status: {appointment.status}</p>
            </div>
          ))
        ) : (
          <p>No appointments booked yet.</p>
        )}
      </div>
    </div>
  );
};

export default BookSlot;
