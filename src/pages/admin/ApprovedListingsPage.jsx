import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaMapMarkerAlt, FaRupeeSign, FaUsers } from "react-icons/fa";
import { OYO_PRIMARY, OYO_SECONDARY, OYO_BG_LIGHT, CARD_BG, BOX_STYLE } from "./Constants.jsx";

const ApprovedListingsPage = ({ isMobile }) => {
  const [approvedListings, setApprovedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch approved listings from backend
  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/dogstay/approved");

        if (response.data.success) {
          setApprovedListings(response.data.listings);
        }
      } catch (err) {
        console.error("Error fetching approved listings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApproved();
  }, []);

  if (loading) {
    return (
      <div style={{ ...BOX_STYLE, textAlign: "center", padding: "40px" }}>
        <p style={{ color: OYO_SECONDARY }}>Loading approved listings...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        ...BOX_STYLE,
        padding: isMobile ? "20px" : "40px",
        backgroundColor: OYO_BG_LIGHT,
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <h2 style={{ color: OYO_PRIMARY, textAlign: "center" }}>Approved Room Listings</h2>

      {approvedListings.length === 0 ? (
        <p style={{ textAlign: "center", color: OYO_SECONDARY, opacity: 0.7, marginTop: "30px" }}>
          No approved listings found.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {approvedListings.map((listing) => (
            <div
              key={listing._id}
              style={{
                backgroundColor: CARD_BG,
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3 style={{ color: OYO_PRIMARY, marginBottom: "10px" }}>{listing.roomName}</h3>

                <p style={{ color: OYO_SECONDARY, marginBottom: "10px", display: "flex", alignItems: "center" }}>
                  <FaUsers style={{ marginRight: "8px" }} /> Host: {listing.ownerFullName || "N/A"}
                </p>

                <p style={{ color: OYO_SECONDARY, marginBottom: "10px", display: "flex", alignItems: "center" }}>
                  <FaRupeeSign style={{ marginRight: "8px" }} /> Price/Day: ₹{listing.pricePerDay || 0}
                </p>

                <p style={{ color: OYO_SECONDARY, marginBottom: "10px", display: "flex", alignItems: "center" }}>
                  <FaMapMarkerAlt style={{ marginRight: "8px" }} /> Location:{" "}
                  {listing.address
                    ? `${listing.address.city}, ${listing.address.state}`
                    : "N/A"}
                </p>

                <p style={{ color: "#28a745", fontWeight: "bold", display: "flex", alignItems: "center" }}>
                  <FaCheckCircle style={{ marginRight: "6px" }} /> Approved
                </p>
              </div>

              {listing.photos?.length > 0 && (
                <div
                  style={{
                    marginTop: "15px",
                    borderTop: "1px solid #eee",
                    paddingTop: "10px",
                    display: "flex",
                    gap: "10px",
                    overflowX: "auto",
                  }}
                >
                  {listing.photos.slice(0, 3).map((photo, i) => (
                    <img
                      key={i}
                      src={`http://localhost:5000/${photo}`}
                      alt={`Listing ${i + 1}`}
                      style={{
                        width: "100px",
                        height: "80px",
                        borderRadius: "6px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => window.open(`http://localhost:5000/${photo}`, "_blank")}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/100?text=Image+Error";
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovedListingsPage;
