import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './LoginScreen.css';
import axios from "axios";

const LoginScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [showOkButton, setShowOkButton] = useState(false);

    // 🔥 SHOW ALERT MESSAGE
    const showAlert = (msg, type = "success", showOk = false) => {
        setMessage(msg);
        setMessageType(type);
        setShowOkButton(showOk);
        setIsMessageVisible(true);
    };

    // ⭐ CLICK OK → GO TO HOME
    const handleOk = () => {
        setIsMessageVisible(false);
        navigate("/home");
    };

    // ⭐ DETECT GOOGLE LOGIN SUCCESS
    useEffect(() => {
        console.log("📌 Login Screen mounted");
        console.log("📌 Current URL:", window.location.href);
        console.log("📌 URL Query:", location.search);

        // Remove token from URL if present to clean up the browser bar
        window.history.replaceState({}, document.title, "/login");

        const justLoggedOut = localStorage.getItem("justLoggedOut");
        if (justLoggedOut) {
            localStorage.removeItem("justLoggedOut");
            return;
        }

        // ⭐ Fetch logged-in user's details using axios via HttpOnly Cookies
        axios.get("https://cado-dog-grooming-backend.onrender.com/api/user/me", {
            withCredentials: true
        })
        .then(res => {
            console.log("📌 API Response:", res.data);

            const data = res.data;

            // Save to localStorage
            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("userId", data._id);
            localStorage.setItem("userName", data.name || "");
            localStorage.setItem("userEmail", data.email || "");
            localStorage.setItem("userPhoto", data.profilePic || "");
            localStorage.setItem("userCountry", data.country || "");
            localStorage.setItem("walletBalance", data.walletBalance || 0);

            console.log("🔥 User Saved to Storage");

            // ✅ SAVE STAFF PROFILE IF ROLE = GRSTAFF
            if (data.role === "grstaff" && data.staffProfile) {
                const staffProfile = data.staffProfile;

                // Save the full profile
                localStorage.setItem("staffProfile", JSON.stringify(staffProfile));

                // _id = grooming staff MongoDB ID
                if (staffProfile._id) {
                    localStorage.setItem("staffId", staffProfile._id.toString());
                    console.log("🔥 staffId saved:", staffProfile._id.toString());
                }

                // staffID = linked user._id
                if (staffProfile.staffID) {
                    localStorage.setItem("staffUserId", staffProfile.staffID.toString());
                    console.log("🔥 staffUserId saved:", staffProfile.staffID.toString());
                }

                console.log("Staff profile:", staffProfile);
            }

            showAlert("Successfully logged in!", "success", true);
        })
        .catch(err => {
            console.log("❌ Axios Error:", err);
            showAlert("Unable to fetch user details!", "error", true);
        });

    }, [location]);


    // ⭐ GOOGLE SIGN-IN
    const signInWithGoogle = () => {
        showAlert("Redirecting to Google login...", "success", false);
        console.log("➡ Redirecting to backend /auth/google");

        setTimeout(() => {
            window.location.href = "https://cado-dog-grooming-backend.onrender.com/auth/google";
        }, 800);
    };

    // ⭐ FACEBOOK (Dummy)
    const signInWithFacebook = () => {
        showAlert("Facebook login successful!", "success", true);
    };

    // ⭐ TWITTER (Dummy)
    const signInWithTwitter = () => {
        showAlert("Twitter sign-in is not implemented yet.", "error", true);
    };

    return (
        <div className="react-login-body">
            


            <div className="login-container">
               
               
                
                <h2 className="signup-title">Login</h2>

                <button className="login-button google" onClick={signInWithGoogle}>
                    <i className="fab fa-google"></i> Sign in with Google
                </button>

                <button className="login-button facebook" onClick={signInWithFacebook}>
                    <i className="fab fa-facebook-f"></i> Sign in with Facebook
                </button>

                <button className="login-button twitter" onClick={signInWithTwitter}>
                    <i className="fab fa-twitter"></i> Sign in with Twitter
                </button>
            </div>

            {/* ⭐ Alert Message Box */}
            <div
                id="messageBox"
                className={`message-box ${isMessageVisible ? 'show' : ''} ${messageType}`}
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
                            cursor: "pointer"
                        }}
                    >
                        OK
                    </button>
                )}
            </div>
        </div>
    );
};

export default LoginScreen;