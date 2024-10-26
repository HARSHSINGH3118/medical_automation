import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase"; // Firebase imports including Firestore
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore"; // Firestore imports
import "./Login.css"; // Import the updated CSS file for styling

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch the user's role from Firestore after logging in
      const userDocRef = doc(db, "Users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Check the user's role and redirect accordingly
        if (userData.role === "doctor") {
          navigate("/doctor-dashboard");
        } else {
          navigate("/patient-dashboard");
        }
      } else {
        console.log("No user document found!");
      }
    } catch (error) {
      console.error("Error logging in: ", error.message);
      alert(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        {/* SRM Logo */}
        {/* <img
          src="https://srmap.edu.in/file/2019/12/Logo-2.png" // Replace with your SRM logo URL
          alt="SRM University Logo"
          className="logo"
        /> */}
      </div>

      <div className="login-right">
        <div className="login-content">
          <p className="quote">Please Use Your University Id only</p>

          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p>
            Don’t have an account?{" "}
            <span className="signup-link" onClick={() => navigate("/signup")}>
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
