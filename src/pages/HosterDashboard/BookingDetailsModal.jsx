// src/components/BookingDetailsModal.jsx
import React from 'react';
import { FaUser, FaDog, FaPhone, FaEnvelope, FaBook, FaWallet, FaCheckCircle, FaMoneyCheckAlt, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import InfoField from './InfoField';

const BookingDetailsModal = ({ booking, onClose, onPayCommission }) => {
  if (!booking) return null;
  const dummyContact = { phone: "+1-555-444-3333", email: `${booking.guestName.split(' ')[0].toLowerCase()}@example.com`, notes: "Guest requested an early check-in at 1 PM." };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-2xl font-bold text-gray-900">Booking Details: {booking._id}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold text-lg text-red-600 mb-2">Guest & Stay</h4>
            <InfoField label="Guest Name" value={booking.guestName} icon={FaUser} />
            <InfoField label="Pet Details" value={booking.petDetails} icon={FaDog} />
            <InfoField label="Stay Dates" value={booking.stayDates} icon={FaBook} />
          </div>
          <div>
            <h4 className="font-semibold text-lg text-red-600 mb-2">Contact & Notes</h4>
            <InfoField label="Phone" value={dummyContact.phone} icon={FaPhone} />
            <InfoField label="Email" value={dummyContact.email} icon={FaEnvelope} />
            <InfoField label="Booking Notes" value={dummyContact.notes} icon={FaBook} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-semibold text-lg text-green-600 mb-2">Payment Status</h4>
            <InfoField label="Payment Method" value={booking.paymentMethod} icon={FaWallet} />
            <InfoField label="Payment Status" value={booking.paymentStatus} icon={FaCheckCircle} />
          </div>
          <div>
            <h4 className="font-semibold text-lg text-red-600 mb-2">Commission Status</h4>
            <InfoField label="Commission Status" value={booking.commissionStatus} icon={FaMoneyCheckAlt} />
            <InfoField label="Commission Amount" value={`₹${booking.commission.toLocaleString()} (${booking.commissionRate * 100}%)`} icon={FaArrowUp} />
            <InfoField label="Host Earnings" value={`₹${booking.hostEarnings.toLocaleString()}`} icon={FaArrowDown} />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center">Cancel Booking</button>
          {booking.commissionStatus === 'Pending' && (
            <button onClick={() => onPayCommission(booking._id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center">Pay Commission</button>
          )}
          <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">Close</button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
