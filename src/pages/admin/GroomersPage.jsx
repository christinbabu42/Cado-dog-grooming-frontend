import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./GroomersPage.css"; // Import the premium CSS file

const GroomersPage = () => {
  const navigate = useNavigate();
  const [groomers, setGroomers] = useState([]);

  const fetchGroomers = async () => {
    try {
      const res = await axios.get("https://cado-dog-grooming-backend.onrender.com/api/grooming-staff");
      if (res.data.success) {
        setGroomers(res.data.data);
      } else {
        console.error("Failed to load groomers:", res.data.message);
      }
    } catch (err) {
      console.error("Error fetching groomers:", err.message);
    }
  };

  useEffect(() => {
    fetchGroomers();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/admin/groomers/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this groomer?")) return;
    try {
      const res = await axios.delete(`https://cado-dog-grooming-backend.onrender.com/api/grooming-staff/${id}`);
      if (res.data.success) {
        alert("Groomer deleted successfully!");
        fetchGroomers();
      } else {
        alert("Failed to delete groomer.");
      }
    } catch (err) {
      console.error("Error deleting groomer:", err.message);
      alert("Server error while deleting groomer.");
    }
  };

  const handleApproval = async (id, currentStatus) => {
    try {
      const res = await axios.put(`https://cado-dog-grooming-backend.onrender.com/api/grooming-staff/${id}`, {
        isApproved: !currentStatus,
      });
      if (res.data.success) {
        alert(`Groomer ${!currentStatus ? "approved" : "unapproved"} successfully!`);
        fetchGroomers();
      } else {
        alert("Failed to update approval status.");
      }
    } catch (err) {
      console.error("Error updating approval:", err.message);
      alert("Server error while updating approval status.");
    }
  };

  return (
    <div className="groomers-page-container">
      <h2 className="premium-title">🐶 Grooming Staff List</h2>

      <div className="table-responsive">
        <table className="groomer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Place-Address</th>
              {/* <th>ID Proof</th> */}
              <th>Experience</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groomers.map((g) => (
              <tr key={g._id}>
                <td data-label="Name">{g.fullName}</td>
                <td data-label="Email">{g.email}</td>
                <td data-label="Phone">{g.phone}</td>
                <td data-label="Address">{g.placeAddress}</td>
                {/* <td data-label="ID Proof">{g.idProof}</td> */}
                <td data-label="Experience">{g.experience}</td>
                <td data-label="Status">
                  <span className={`status-text ${g.isApproved ? "status-approved" : "status-unapproved"}`}>
                    {g.isApproved ? "● Approved" : "○ Pending"}
                  </span>
                </td>
                <td data-label="Actions">
                  <div className="action-buttons">
                    <button className="btn btn-view" onClick={() => handleViewDetails(g._id)}>
                      View
                    </button>
                    <button 
                      className={`btn ${g.isApproved ? "btn-unapprove" : "btn-approve"}`} 
                      onClick={() => handleApproval(g._id, g.isApproved)}
                    >
                      {g.isApproved ? "Unapprove" : "Approve"}
                    </button>
                    <button className="btn btn-delete" onClick={() => handleDelete(g._id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroomersPage;