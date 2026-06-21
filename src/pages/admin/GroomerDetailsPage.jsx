import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./GroomerDetails.css"; // Import the new premium stylesheet

const GroomerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [groomer, setGroomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchGroomer = async () => {
      try {
        const res = await axios.get(`https://cado-dog-grooming-backend.onrender.com/api/grooming-staff/${id}`);
        if (res.data.success) {
          setGroomer(res.data.data);
          setEditForm(res.data.data);
        } else {
          console.error("Failed to load groomer:", res.data.message);
        }
      } catch (err) {
        console.error("Error fetching groomer:", err.message);
      }
    };
    fetchGroomer();
  }, [id]);

  if (!groomer) return (
    <div className="loading-container">
      <div className="loader"></div>
      <p>Loading Groomer Profile...</p>
    </div>
  );

  const idProofUrl = groomer.idProof
    ? `https://cado-dog-grooming-backend.onrender.com/uploads/${groomer.idProof}`
    : null;

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `https://cado-dog-grooming-backend.onrender.com/api/grooming-staff/${id}`,
        editForm
      );
      if (res.data.success) {
        alert("Details updated successfully!");
        setGroomer(res.data.data);
        setIsEditing(false);
      } else {
        alert("Failed to update details.");
      }
    } catch (err) {
      console.error("Error updating groomer:", err.message);
      alert("Error updating groomer details.");
    }
  };

  const handleApprove = async () => {
    try {
      const res = await axios.put(
        `https://cado-dog-grooming-backend.onrender.com/api/grooming-staff/${id}/approve`
      );
      if (res.data.success) {
        alert("Groomer approved successfully!");
        setGroomer(res.data.data);
      } else {
        alert("Failed to approve groomer.");
      }
    } catch (err) {
      console.error("Error approving groomer:", err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      const res = await axios.delete(`https://cado-dog-grooming-backend.onrender.com/api/grooming-staff/${id}`);
      if (res.data.success) {
        alert("Record deleted successfully.");
        navigate(-1);
      } else {
        alert("Failed to delete record.");
      }
    } catch (err) {
      console.error("Error deleting groomer:", err.message);
    }
  };

  return (
    <div className="details-page-wrapper">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Back to List
      </button>

      <div className="details-card">
        <div className="details-header">
          <h2>🐾 Groomer Profile</h2>
          <span className={`badge ${groomer.isApproved ? 'approved' : 'pending'}`}>
            {groomer.isApproved ? "Verified" : "Pending Approval"}
          </span>
        </div>

        {!isEditing ? (
          <div className="view-section">
            <div className="info-grid">
              <div className="info-item"><b>Name:</b> <span>{groomer.fullName}</span></div>
              <div className="info-item"><b>Email:</b> <span>{groomer.email}</span></div>
              <div className="info-item"><b>Phone:</b> <span>{groomer.phone}</span></div>
              {groomer.alternatePhone && (
                <div className="info-item"><b>Alt Phone:</b> <span>{groomer.alternatePhone}</span></div>
              )}
              <div className="info-item"><b>Experience:</b> <span>{groomer.experience}</span></div>
              <div className="info-item full-width"><b>Address:</b> <span>{groomer.placeAddress}</span></div>
              <div className="info-item full-width"><b>Skills:</b> <span>{groomer.skills.join(", ")}</span></div>
            </div>

            <div className="cover-letter-box">
              <b>Cover Letter:</b>
              <p>{groomer.coverLetter}</p>
            </div>

            {idProofUrl ? (
              <div className="id-proof-section">
                <b>ID Proof Document:</b>
                <div className="image-container">
                  <img src={idProofUrl} alt="ID Proof" />
                </div>
              </div>
            ) : (
              <p className="no-upload"><b>ID Proof:</b> Not uploaded</p>
            )}

            <div className="action-footer">
              <button className="btn-gold" onClick={() => setIsEditing(true)}>✏️ Edit Details</button>
              <button className="btn-success" onClick={handleApprove}>✅ Approve</button>
              <button className="btn-danger" onClick={handleDelete}>🗑 Delete</button>
            </div>
          </div>
        ) : (
          <div className="edit-section">
            <h3>Update Profile Information</h3>
            <div className="form-grid">
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" name="fullName" value={editForm.fullName || ""} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" name="email" value={editForm.email || ""} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input type="text" name="phone" value={editForm.phone || ""} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Years of Experience</label>
                <input type="text" name="experience" value={editForm.experience || ""} onChange={handleChange} />
              </div>
              <div className="input-group full-width">
                <label>Place Address</label>
                <input type="text" name="placeAddress" value={editForm.placeAddress || ""} onChange={handleChange} />
              </div>
              <div className="input-group full-width">
                <label>Cover Letter</label>
                <textarea name="coverLetter" rows="4" value={editForm.coverLetter || ""} onChange={handleChange} />
              </div>
            </div>

            <div className="action-footer">
              <button className="btn-success" onClick={handleSave}>💾 Save Changes</button>
              <button className="btn-secondary" onClick={() => setIsEditing(false)}>✖ Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroomerDetailsPage;