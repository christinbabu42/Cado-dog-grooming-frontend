import React, { useState, useEffect } from "react";
import { 
  Mail, Phone, CreditCard, MapPin, ShieldCheck,
  Edit3, ArrowLeft, CheckCircle2, Eye, EyeOff
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import "./ProfileView.css";

const ProfileView = ({ staffProfile: initialProfile }) => {
  const [showBankForm, setShowBankForm] = useState(false);
  const [showFullAccount, setShowFullAccount] = useState(false);
  
  // States for toggling visibility inside the form inputs
  const [showFormAccount, setShowFormAccount] = useState(false);
  const [showFormConfirmAccount, setShowFormConfirmAccount] = useState(false);

  const [staffProfile, setStaffProfile] = useState(initialProfile);
  const [bankDetails, setBankDetails] = useState({
    accountHolder: "",
    bankName: "",
    ifsc: "",
    accountNumber: "",
    confirmAccountNumber: "",
  });

  useEffect(() => {
    if (initialProfile) {
      setStaffProfile(initialProfile);
      setBankDetails({
        accountHolder: initialProfile?.bankDetails?.accountHolder || initialProfile?.fullName || "",
        bankName: initialProfile?.bankDetails?.bankName || "",
        ifsc: initialProfile?.bankDetails?.ifsc || "",
        accountNumber: initialProfile?.bankDetails?.accountNumber || "",
        confirmAccountNumber: initialProfile?.bankDetails?.accountNumber || "",
      });
    }
  }, [initialProfile]);

  const handleSaveBankDetails = async (e) => {
    e.preventDefault();
    if (bankDetails.accountNumber !== bankDetails.confirmAccountNumber) {
      alert("Account numbers do not match");
      return;
    }

    try {
      // Utilizing centralized axiosInstance with HttpOnly credentials automatically handled
      const { data } = await axiosInstance.put(
        "/api/user/bank-details",
        {
          accountHolder: bankDetails.accountHolder,
          bankName: bankDetails.bankName,
          ifsc: bankDetails.ifsc,
          accountNumber: bankDetails.accountNumber,
        }
      );

      if (data.success) {
        alert("Bank details saved successfully!");
        setStaffProfile(prev => ({ ...prev, bankDetails: data.updatedBankDetails }));
        setShowBankForm(false);
      }
    } catch (err) {
      console.error("Error saving bank details:", err);
      alert("Failed to save bank details");
    }
  };

  return (
    <div className={`profile-wrapper ${showBankForm ? "split-view" : ""}`}>
      <div className="profile-main-content">
        {/* ... Header Section remains same as previous code ... */}
        <div className="profile-header">
          <div className="header-banner">
            <div className="verification-pill"><ShieldCheck size={14} /> Verified Staff</div>
          </div>
          <div className="header-content">
            <div className="avatar-container">
              <img src={localStorage.getItem("userPhoto") || "https://via.placeholder.com/120"} alt="Profile" className="main-avatar" />
            </div>
            <div className="identity-block">
              <h2>{staffProfile?.fullName}</h2>
              <div className="badge-row">
                <span className="badge-item primary">Senior Groomer</span>
                <span className="badge-item secondary">{staffProfile?.experience || "3+ "} Years Exp.</span>
              </div>
            </div>
            {!showBankForm && <button className="btn-edit"><Edit3 size={16} /> Edit Profile</button>}
          </div>
        </div>

        <div className="profile-grid">
          {/* Contact Information Block */}
          <div className="info-block">
            <h3 className="block-title">Contact Details</h3>
            <div className="info-list">
              <div className="info-entry">
                <div className="entry-icon icon-mail"><Mail size={18} /></div>
                <div className="entry-data"><label>Email Address</label><p>{staffProfile?.email || "Not Provided"}</p></div>
              </div>
              <div className="info-entry">
                <div className="entry-icon icon-phone"><Phone size={18} /></div>
                <div className="entry-data"><label>Phone Number</label><p>{staffProfile?.phone || "+91 00000 00000"}</p></div>
              </div>
            </div>
          </div>

          {/* Payout Information Block */}
          <div className="info-block">
            <h3 className="block-title">Payout Account</h3>
            <div className="bank-card-preview">
              <div className="bank-card-icon"><CreditCard size={24} /></div>
              <div className="bank-card-text">
                <strong>{staffProfile?.bankDetails?.bankName || "No Bank Linked"}</strong>
                <div className="account-number-row">
                  <p>{staffProfile?.bankDetails?.accountNumber ? (showFullAccount ? staffProfile.bankDetails.accountNumber : "•••• " + staffProfile.bankDetails.accountNumber.slice(-4)) : "Not setup"}</p>
                  {staffProfile?.bankDetails?.accountNumber && (
                    <button className="btn-view-account" onClick={() => setShowFullAccount(!showFullAccount)}>
                      {showFullAccount ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  )}
                </div>
              </div>
            </div>
            {!showBankForm && <button className="btn-outline-full" onClick={() => setShowBankForm(true)}>Update Bank Details</button>}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Bank Form with Input Visibility Toggles */}
      {showBankForm && (
        <div className="side-form-container">
          <div className="form-header">
            <button className="btn-close-form" type="button" onClick={() => setShowBankForm(false)}><ArrowLeft size={18} /></button>
            <h3>Bank Settings</h3>
          </div>
          <form className="bank-form" onSubmit={handleSaveBankDetails}>
            <div className="form-group">
              <label>Account Holder Name</label>
              <input type="text" value={bankDetails.accountHolder} onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })} required />
            </div>
            
            <div className="form-group">
              <label>Bank Name</label>
              <input type="text" placeholder="e.g. HDFC Bank" value={bankDetails.bankName} onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })} required />
            </div>

            <div className="form-group">
              <label>IFSC Code</label>
              <input type="text" placeholder="IFSC Code" value={bankDetails.ifsc} onChange={(e) => setBankDetails({ ...bankDetails, ifsc: e.target.value })} required />
            </div>

            {/* Account Number Input with Eye Icon */}
            <div className="form-group">
              <label>Account Number</label>
              <div className="input-with-icon">
                <input 
                  type={showFormAccount ? "text" : "password"} 
                  placeholder="Enter account number" 
                  value={bankDetails.accountNumber} 
                  onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })} 
                  required 
                />
                <button type="button" className="input-icon-btn" onClick={() => setShowFormAccount(!showFormAccount)}>
                  {showFormAccount ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Account Number Input with Eye Icon */}
            <div className="form-group">
              <label>Confirm Account Number</label>
              <div className="input-with-icon">
                <input 
                  type={showFormConfirmAccount ? "text" : "password"} 
                  placeholder="Re-enter account number" 
                  value={bankDetails.confirmAccountNumber} 
                  onChange={(e) => setBankDetails({ ...bankDetails, confirmAccountNumber: e.target.value })} 
                  required 
                />
                <button type="button" className="input-icon-btn" onClick={() => setShowFormConfirmAccount(!showFormConfirmAccount)}>
                  {showFormConfirmAccount ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-save-bank">Save & Verify</button>
            <button type="button" className="btn-cancel" onClick={() => setShowBankForm(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfileView;