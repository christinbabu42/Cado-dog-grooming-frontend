import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HostLogin.css";
import { useNavigate, useLocation } from "react-router-dom";

const HostLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [showOkButton, setShowOkButton] = useState(false);

  // ALERT MESSAGE
  const showAlert = (msg, type = "success", okBtn = false) => {
    setMessage(msg);
    setMessageType(type);
    setShowOkButton(okBtn);
    setIsMessageVisible(true);
  };

  const handleOk = () => {
    setIsMessageVisible(false);
    navigate("/host-dashboard");
  };

  // -------------------------------------
  // ⭐ DETECT GOOGLE HOST LOGIN REDIRECT
  // -------------------------------------
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (!token) return;

    window.history.replaceState({}, document.title, "/host-dashboard");

    axios
      .get("https://cado-dog-grooming-backend.onrender.com/api/hosts/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const host = res.data.host;

        // FIXED — correct ID
        localStorage.setItem("authToken", token);
        localStorage.setItem("token", token);
        localStorage.setItem("hostId", host._id);
        localStorage.setItem("userId", host._id);
        localStorage.setItem("hostDetails", JSON.stringify(host));

        showAlert("Google Host Login Successful!", "success", true);
      })
      .catch((err) => {
        console.error("❌ Host fetch failed:", err);
        showAlert("Unable to fetch host details!", "error", true);
      });
  }, [location]);

  // -------------------------------------
  // ⭐ HOST LOGIN (EMAIL + PASSWORD)
  // -------------------------------------
  const handleHostLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "https://cado-dog-grooming-backend.onrender.com/api/host/login",
        { email, password }
      );

      const host = res.data.host;
      const token = res.data.token;

      // FIXED — use `host._id`
      localStorage.setItem("hostId", host._id);
      localStorage.setItem("userId", host._id);
      localStorage.setItem("token", token);
      localStorage.setItem("authToken", token);
      localStorage.setItem("hostDetails", JSON.stringify(host));

      console.log("DEBUG hostId:", host._id);
      console.log("DEBUG token:", token);

      showAlert("Host Login Successful!", "success", true);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed!");
    }
  };

  // -------------------------------------
  // ⭐ HOST GOOGLE LOGIN BUTTON
  // -------------------------------------
  const signInWithGoogle = () => {
    showAlert("Redirecting to Google Host Login...", "success", false);

    setTimeout(() => {
      window.location.href =
        "https://cado-dog-grooming-backend.onrender.com/auth/google?loginType=host";
    }, 800);
  };

  return (
    <div className="host-login-page">
      <div className="host-login-box">
        <h2>Host Login</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleHostLogin}>
          <input
            type="email"
            placeholder="Host Email"
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

          <button type="submit">Login</button>
        </form>

        <button className="google-host-login-btn" onClick={signInWithGoogle}>
          <i className="fab fa-google"></i> Login with Google
        </button>

        <a href="/login" className="back-link">
          Back to User Login
        </a>
      </div>

      <div
        className={`message-box ${isMessageVisible ? "show" : ""} ${messageType}`}
      >
        {message}

        {showOkButton && (
          <button
            onClick={handleOk}
            style={{
              marginTop: "15px",
              background: "#00e6ff",
              padding: "8px 20px",
              border: "none",
              borderRadius: "8px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            OK
          </button>
        )}
      </div>
    </div>
  );
};

export default HostLogin;
