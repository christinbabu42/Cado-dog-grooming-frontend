// src/components/WalletSection.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import SectionTitle from "./SectionTitle";
import { FaWallet, FaArrowDown, FaCalendarAlt } from "react-icons/fa";

const WalletSection = ({ wallet = {}, onWithdraw, hostId }) => {
  // ===============================
  // 📦 SAFE DEFAULTS
  // ===============================
  const balance = wallet?.balance ?? 0;
  const transactions = wallet?.transactions ?? [];

  const [monthlyStats, setMonthlyStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // 🌐 FETCH WALLET SUMMARY
  // ===============================
  useEffect(() => {
    if (!hostId) {
      setLoading(false);
      return;
    }

    const fetchWalletSummary = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/wallet/summary/${hostId}`
        );

        if (res.data?.success) {
          setMonthlyStats(res.data.monthlyStats || []);
        } else {
          setMonthlyStats([]);
        }
      } catch (err) {
        console.error("Wallet fetch failed:", err);
        setMonthlyStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletSummary();
  }, [hostId]);

  // ===============================
  // ⏳ LOADING STATE
  // ===============================
  if (loading) {
    return <p className="text-gray-600">Loading wallet details...</p>;
  }

  return (
    <div>
      {/* ================= WALLET HEADER ================= */}
      <SectionTitle
        icon={FaWallet}
        title="Host Wallet"
        description="Manage your earnings, bookings, and withdrawals."
      />

      {/* ================= WALLET BALANCE ================= */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 flex justify-between items-center border-b-4 border-red-500">
        <div>
          <p className="text-lg text-gray-900">Current Wallet Balance</p>
          <p className="text-5xl font-extrabold text-red-700 mt-1">
            ₹{balance.toLocaleString()}
          </p>
        </div>

        <button
          onClick={onWithdraw}
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center"
        >
          <FaArrowDown className="mr-2" /> Withdraw Money
        </button>
      </div>

      {/* ================= MONTHLY SUMMARY ================= */}
      <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
        <FaCalendarAlt /> Monthly Booking & Profit Summary
      </h3>

      {monthlyStats.length === 0 ? (
        <p className="text-gray-600 mb-10">
          No booking data available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {monthlyStats.map((month, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md border">
              <p className="text-sm text-gray-500">{month.month}</p>

              <p className="text-lg font-semibold text-gray-900 mt-2">
                Total Bookings: {month.totalBookings}
              </p>

              {/* <p className="text-xl font-bold text-gray-800 mt-2">
                ₹{(month.totalBookingAmount || 0).toLocaleString()}
              </p> */}

              <p className="text-sm text-gray-500">Total Booking Amount</p>

              <p className="text-lg font-bold text-green-700 mt-3">
                Profit: ₹{(month.totalProfit || 0).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ================= TRANSACTION HISTORY ================= */}
      <h3 className="text-xl font-semibold mb-3 text-gray-900">
        Transaction History
      </h3>

      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions yet.</p>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Date", "Description", "Type", "Amount"].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{t.date}</td>
                  <td className="px-6 py-4 text-sm font-medium">{t.description}</td>
                  <td className="px-6 py-4 text-sm">{t.type}</td>
                  <td className="px-6 py-4 text-sm font-semibold">
                    ₹{(t.amount || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WalletSection;
