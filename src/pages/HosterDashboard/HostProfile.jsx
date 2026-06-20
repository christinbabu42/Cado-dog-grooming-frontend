import React from "react";
import { FaUserCog, FaEnvelope, FaPhone, FaWallet, FaGlobe, FaUser } from "react-icons/fa";
import SectionTitle from "./SectionTitle";
import './HostProfile.css';

const HostProfile = ({ host }) => {
  // Log the profile pic outside JSX
  console.log("Host ProfilePic URL:", host.profilePic);

  return (
    <>
      <SectionTitle icon={FaUserCog} title="Host Profile" />
      <div className="host-profile-card">
        <div className="profile-header">
<img 
  src={host.profilePic} 
  alt={host.name} 
  className="profile-pic"
  onError={(e) => e.target.src = "/fallback-profile.png"} 
/>

          <div className="profile-name-role">
            <h2>{host.name || "-"}</h2>
            <span className="role">{host.role || "-"}</span>
          </div>
        </div>

        <div className="profile-details">
          <p><FaEnvelope className="icon"/> <strong>Email:</strong> {host.email || "-"}</p>
          <p><FaPhone className="icon"/> <strong>Phone:</strong> {host.phone || "-"}</p>
          <p><FaWallet className="icon"/> <strong>Wallet Balance:</strong> ₹{host.walletBalance || 0}</p>
          <p><FaGlobe className="icon"/> <strong>Country:</strong> {host.country || "-"}</p>
          <p>
            <FaUser className="icon"/>
            <strong>Status:</strong> 
            <span className={`status ${host.status || ""}`}>
              {host.status || "-"}
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default HostProfile;
