import React, { useEffect, useState } from "react";
import { OYO_PRIMARY, OYO_SECONDARY, BOX_STYLE, CARD_BG } from "./Constants.jsx";
import axios from "axios";

const BACKEND_BASE_URL = "https://cado-dog-grooming-backend.onrender.com"; // adjust when needed

// --- CENTRAL AXIOS INSTANCE WITH CREDENTIALS ---
const api = axios.create({
  baseURL: `${BACKEND_BASE_URL}/api`,
  withCredentials: true,
});

// --- PREMIUM THEME CONSTANTS ---
const GOLD_PRIMARY = "#D4AF37";
const GOLD_DARK = "#B8860B";
const GOLD_LIGHT = "#F1D37E";
const PREMIUM_WHITE = "#FFFFFF";
const SOFT_BG = "#FAF9F6";

const UsersPage = ({ isMobile }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const pageName = "Users";

  // -------------------------------
  // FETCH USERS
  // -------------------------------
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/user/all");

        setUsers(res.data.users || []);
        setFilteredUsers(res.data.users || []);
      } catch (err) {
        console.error("Error loading users:", err);
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";

    if (
      !window.confirm(
        `Are you sure you want to ${newStatus === "suspended" ? "BAN" : "UNBAN"} this user?`
      )
    )
      return;

    try {
      const res = await api.put(`/user/status/${userId}`, { status: newStatus });

      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, status: newStatus } : u
          )
        );
      }
    } catch (err) {
      alert("Failed to update user status..Only Super Admin can do this");
    }
  };

  const changeUserRole = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change role to ${newRole}?`))
      return;

    try {
      const res = await api.put(`/user/role/${userId}`, { role: newRole });

      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, role: newRole } : u
          )
        );
      }
    } catch (err) {
      alert("Failed to change role. Only super Admin can do this.");
    }
  };

  // -------------------------------
  // SEARCH FILTER
  // -------------------------------
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = users.filter((u) =>
        (u.name && u.name.toLowerCase().includes(term)) ||
        (u.email && u.email.toLowerCase().includes(term)) ||
        (u.phone && u.phone.toLowerCase().includes(term)) ||
        (u._id && u._id.toLowerCase().includes(term))
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  return (
    <div
      style={{
        ...BOX_STYLE,
        padding: isMobile ? "20px" : "40px",
        textAlign: "center",
        margin: 0,
        boxSizing: "border-box",
        width: "100%",
        maxWidth: "100vw",
        minHeight: "100vh",
        overflowX: "hidden",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: SOFT_BG,
      }}
    >
      {/* Header Section */}
      <div style={{ marginBottom: "20px" }}>
        <h2 
          style={{ 
            color: GOLD_DARK, 
            margin: 0, 
            fontSize: isMobile ? "24px" : "32px",
            fontWeight: "700",
            letterSpacing: "1px",
            textTransform: "uppercase"
          }}
        >
          {pageName} Management
        </h2>
        <div style={{ 
          height: "3px", 
          width: "60px", 
          background: `linear-gradient(to right, ${GOLD_PRIMARY}, ${GOLD_LIGHT})`, 
          margin: "10px auto" 
        }} />
      </div>

      {/* ----------- SEARCH BOX ------------- */}
      <div style={{ margin: "10px 0 30px 0", width: "100%", maxWidth: "500px" }}>
        <input
          type="text"
          placeholder="Search by Name, Email, Phone, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 25px",
            borderRadius: "50px", 
            border: `1.5px solid ${GOLD_PRIMARY}60`,
            fontSize: "15px",
            outline: "none",
            backgroundColor: PREMIUM_WHITE,
            color: "#000000", // Strictly Black Text
            fontWeight: "500",
            boxShadow: "0 6px 20px rgba(212, 175, 55, 0.15)",
            transition: "all 0.3s ease",
            boxSizing: "border-box"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = GOLD_DARK;
            e.target.style.boxShadow = "0 6px 25px rgba(212, 175, 55, 0.25)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = `${GOLD_PRIMARY}60`;
            e.target.style.boxShadow = "0 6px 20px rgba(212, 175, 55, 0.15)";
          }}
        />
      </div>

      {/* ----------- USERS TABLE CONTAINER ------------- */}
      <div
        style={{
          backgroundColor: PREMIUM_WHITE,
          borderRadius: "15px",
          width: "100%",
          maxWidth: "3000px",
          padding: isMobile ? "10px" : "25px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          border: `1px solid ${GOLD_PRIMARY}20`,
          overflowX: "auto",
        }}
      >
        {loading ? (
          <p style={{ color: GOLD_DARK, padding: "20px" }}>Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <p style={{ color: "#777", padding: "20px" }}>
            No users found.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 8px",
              minWidth: "900px",
            }}
          >
            <thead>
              <tr style={{ color: GOLD_DARK }}>
                <th style={tableHeaderStyle}>User ID</th>
                <th style={tableHeaderStyle}>Name</th>
                <th style={tableHeaderStyle}>Email</th>
                <th style={tableHeaderStyle}>Phone</th>
                <th style={tableHeaderStyle}>Role</th>
                <th style={tableHeaderStyle}>Wallet</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Joined</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, index) => (
                <tr
                  key={u._id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#fff" : "#fdfbf7",
                    borderRadius: "10px",
                  }}
                >
                  <td style={{...tableCellStyle, borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px"}}>
                    <span style={{ color: GOLD_DARK, fontWeight: "600" }}>#{u._id.slice(-6)}</span>
                  </td>
                  <td style={{...tableCellStyle, fontWeight: "600", color: "#000"}}>{u.name}</td>
                  <td style={tableCellStyle}>{u.email}</td>
                  <td style={tableCellStyle}>{u.phone || "N/A"}</td>
                  <td style={tableCellStyle}>
                    <select
                      value={u.role}
                      onChange={(e) => changeUserRole(u._id, e.target.value)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "8px",
                        border: `1px solid ${GOLD_PRIMARY}50`,
                        fontSize: "13px",
                        cursor: "pointer",
                        backgroundColor: "#fff",
                        color: "#000"
                      }}
                    >
                      <option value="owner">Owner</option>
                      <option value="host">Host</option>
                      <option value="grstaff">grstaff</option>
                      <option value="gradmin">gradmin</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                  </td>

                  <td style={{ ...tableCellStyle, fontWeight: "bold", color: "#000" }}>
                    ₹{u.walletBalance?.toLocaleString()}
                  </td>
                  <td style={tableCellStyle}>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "white",
                        backgroundColor: u.status === "active" ? "#27ae60" : "#d35400",
                      }}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td style={tableCellStyle}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{...tableCellStyle, borderTopRightRadius: "10px", borderBottomRightRadius: "10px"}}>
                    <button
                      onClick={() => toggleUserStatus(u._id, u.status)}
                      style={{
                        backgroundColor: u.status === "active" ? "#fff" : GOLD_PRIMARY,
                        color: u.status === "active" ? "#e74c3c" : "#fff",
                        border: u.status === "active" ? "1.5px solid #e74c3c" : "none",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "12px",
                      }}
                    >
                      {u.status === "active" ? "BAN" : "UNBAN"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// -------------- TABLE STYLES -----------------

const tableHeaderStyle = {
  padding: "15px 12px",
  fontWeight: "700",
  textAlign: "left",
  fontSize: "14px",
  borderBottom: `2px solid ${GOLD_PRIMARY}30`,
  textTransform: "uppercase",
};

const tableCellStyle = {
  padding: "15px 12px",
  fontSize: "14px",
  color: "#333", // Dark grey for general text
  borderBottom: "1px solid #f0f0f0"
};

export default UsersPage;