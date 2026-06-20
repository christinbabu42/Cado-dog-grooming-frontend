import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { CheckCircle, XCircle, Eye, X } from "lucide-react";
import "./PayoutsTab.css";

const PayoutsTab = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- MODAL STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);

  // ✅ FETCH ALL PAYOUTS
  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const res = await axiosInstance.get("/api/payout/grstaff/all");
        if (res.data.success) {
          setPayouts(res.data.payouts);
        } else {
          setError("Failed to fetch payouts.");
        }
      } catch (err) {
        console.error(err);
        setError("Server error while fetching payouts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayouts();
  }, []);

  // ✅ OPEN MODAL
  const openModal = (payout) => {
    setSelectedPayout(payout);
    setIsModalOpen(true);
  };

  // ✅ CLOSE MODAL
  const closeModal = () => {
    setSelectedPayout(null);
    setIsModalOpen(false);
  };

  if (loading) return <p>Loading payouts...</p>;
  if (error) return <p>{error}</p>;
  if (!payouts.length) return <p>No payouts found.</p>;

  return (
    <div className="payouts-wrapper tab-content">
      <h2 className="page-title">💰 All Payouts</h2>

      {/* ================= TABLE ================= */}
      <table className="payouts-table">
        <thead>
          <tr>
            <th>Staff Name</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Status</th>
            <th>Processed At</th>
            <th>Bookings Linked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map((payout) => (
            <tr key={payout._id}>
              <td>{payout.staffId?.fullName || "Unknown"}</td>
              <td>₹{payout.amount}</td>
              <td>{payout.currency}</td>
              <td>
                {payout.status === "processed" ? (
                  <CheckCircle color="green" size={18} />
                ) : (
                  <XCircle color="red" size={18} />
                )}{" "}
                {payout.status}
              </td>
              <td>
                {payout.processedAt
                  ? new Date(payout.processedAt).toLocaleString()
                  : "-"}
              </td>
              <td>{payout.bookings?.length || 0}</td>
              <td>
                <button className="btn-view" onClick={() => openModal(payout)}>
                  <Eye size={16} /> View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= MODAL ================= */}
      {isModalOpen && selectedPayout && (
        <div className="payouts-modal-portal">
          {/* Backdrop */}
          <div className="modal-backdrop" onClick={closeModal}></div>

          {/* Modal Card */}
          <div className="modal-card-container">
            <div className="modal-card">
              {/* Header */}
              <div className="modal-header-premium">
                <h3>Payout Details</h3>
                <button className="close-x-btn" onClick={closeModal}>
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="modal-scroll-body">
                <ul className="payout-details">
                  <li>
                    <strong>_id:</strong> {selectedPayout._id}
                  </li>
                  <li>
                    <strong>Payout ID:</strong> {selectedPayout.payoutId}
                  </li>
                  <li>
                    <strong>Staff Name:</strong>{" "}
                    {selectedPayout.staffId?.fullName || "Unknown"}
                  </li>
                  <li>
                    <strong>Email:</strong>{" "}
                    {selectedPayout.staffId?.email || "N/A"}
                  </li>
                  <li>
                    <strong>Phone:</strong>{" "}
                    {selectedPayout.staffId?.phone || "N/A"}
                  </li>
                  <li>
                    <strong>Fund Account:</strong> {selectedPayout.fundAccount}
                  </li>
                  <li>
                    <strong>Amount:</strong> ₹{selectedPayout.amount}
                  </li>
                  <li>
                    <strong>Currency:</strong> {selectedPayout.currency}
                  </li>
                  <li>
                    <strong>Status:</strong> {selectedPayout.status}
                  </li>
                  <li>
                    <strong>Bookings Linked:</strong>{" "}
                    {selectedPayout.bookings?.length || 0}
                  </li>
                  <li>
                    <strong>Created At:</strong>{" "}
                    {selectedPayout.createdAt
                      ? new Date(selectedPayout.createdAt).toLocaleString()
                      : "-"}
                  </li>
                  <li>
                    <strong>Processed At:</strong>{" "}
                    {selectedPayout.processedAt
                      ? new Date(selectedPayout.processedAt).toLocaleString()
                      : "Not processed"}
                  </li>
                  <li>
                    <strong>Updated At:</strong>{" "}
                    {selectedPayout.updatedAt
                      ? new Date(selectedPayout.updatedAt).toLocaleString()
                      : "-"}
                  </li>
                  <li>
                    <strong>__v:</strong> {selectedPayout.__v}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayoutsTab;
