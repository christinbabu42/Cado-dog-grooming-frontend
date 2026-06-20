import React, { useState } from 'react';
import { 
    FaEdit, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaMapMarkerAlt, FaExpandAlt, 
    FaCamera, FaIdCard, FaImage, FaUsers, FaRupeeSign, FaCalendarCheck, FaPhone 
} from 'react-icons/fa';
import { OYO_PRIMARY, OYO_SECONDARY, OYO_BG_LIGHT, CARD_BG, BOX_STYLE } from './Constants.jsx';
import axios from 'axios';

const getStatusInfo = (listing) => {
    if (listing.isApproved === true) return { label: 'Approved (Active)', icon: FaCheckCircle, color: '#28a745' };
    if (listing.isRejected === true) return { label: 'Rejected', icon: FaTimesCircle, color: OYO_PRIMARY };
    return { label: 'Pending Review', icon: FaCalendarCheck, color: '#ffc107' };
};

// Child Component for individual detail rows
const DetailItem = React.memo(({ icon: Icon, label, valueKey, editData, setEditData, isEditing, editable = false, inputType = 'text', options = [], displayValue }) => {
    const [localValue, setLocalValue] = React.useState(editData[valueKey] || '');

    React.useEffect(() => {
        setLocalValue(editData[valueKey] || '');
    }, [editData[valueKey]]);

    const handleChange = (e) => {
        const val = inputType === 'number' ? Number(e.target.value) : e.target.value;
        setLocalValue(val);
        setEditData(prev => ({ ...prev, [valueKey]: val }));
    };

    return (
        <div style={{ padding: '10px 0', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
            <Icon size={16} color={OYO_SECONDARY} style={{ marginRight: '10px' }} />
            <span style={{ fontWeight: 'bold', minWidth: '150px', color: OYO_SECONDARY, opacity: 0.8 }}>{label}:</span>
            <span style={{ color: OYO_SECONDARY, flex: 1 }}>
                {isEditing && editable ? (
                    options.length > 0 ? (
                        <select value={localValue} onChange={handleChange}>
                            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    ) : (
                        <input
                            type={inputType}
                            value={localValue}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '4px' }}
                        />
                    )
                ) : (displayValue || editData[valueKey] || 'N/A')}
            </span>
        </div>
    );
});

const DogStayDetail = ({ listing, onBack, isMobile, onApprove, onReject }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...listing });
    const [loading, setLoading] = useState(false);

    if (!listing) return <div style={{ textAlign: 'center', padding: '50px', color: OYO_SECONDARY }}>Listing data is missing.</div>;

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await axios.put(`http://localhost:5000/api/admin/dogstay/dogstay/${listing._id}`, editData);
            if (response.data.success) {
                alert('Listing updated successfully!');
                setIsEditing(false);
            }
        } catch (err) {
            console.error(err);
            alert('Error updating listing: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Helper to inject shared props into DetailItem
    const renderDetailItem = (props) => (
        <DetailItem 
            {...props} 
            editData={editData} 
            setEditData={setEditData} 
            isEditing={isEditing} 
        />
    );

    const location = editData.fullAddress ? `${editData.fullAddress} (${editData.pinCode || ''})` : 'Address N/A';
    const hostName = editData.hostId?.name || editData.ownerFullName || 'Unknown Host';
    const hostMobile = editData.hostId?.mobile || editData.contactNumber || 'N/A';
    const photos = editData.photos || [];
    const statusInfo = getStatusInfo(editData);

    return (
        <div style={{ ...BOX_STYLE, padding: isMobile ? '20px' : '40px', backgroundColor: CARD_BG, borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            {/* Back Button */}
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: OYO_SECONDARY, cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '20px', fontSize: '16px' }}>
                <FaArrowLeft style={{ marginRight: '10px' }} /> Back to Listings
            </button>

            {/* Title */}
            <h2 style={{ color: OYO_PRIMARY, borderBottom: '2px solid #eee', paddingBottom: '10px' }}>{editData.roomName}</h2>
            <p style={{ color: OYO_SECONDARY, opacity: 0.7 }}>Listing ID: {editData._id}</p>

            {/* General Information */}
            <div style={{ marginTop: '30px', border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
                <h3 style={{ color: OYO_SECONDARY, marginTop: 0 }}>General Information</h3>
                {renderDetailItem({ icon: FaUsers, label: "Host Name", valueKey: "ownerFullName", displayValue: hostName, editable: true })}
                {renderDetailItem({ icon: FaPhone, label: "Host Mobile", valueKey: "contactNumber", displayValue: hostMobile, editable: true })}
                {renderDetailItem({ icon: FaMapMarkerAlt, label: "Location", valueKey: "fullAddress", displayValue: location, editable: true })}
                {renderDetailItem({ icon: FaRupeeSign, label: "Price/Day", valueKey: "pricePerDay", displayValue: `₹${editData.pricePerDay || 0}`, editable: true, inputType: "number" })}
                {renderDetailItem({ icon: FaRupeeSign, label: "Additional Pet Charge", valueKey: "additionalPetCharge", displayValue: editData.additionalPetCharge ? `₹${editData.additionalPetCharge}` : 'N/A', editable: true, inputType: "number" })}
                {renderDetailItem({ icon: FaCalendarCheck, label: "Available From", valueKey: "availableFrom", editable: true, inputType: "date" })}
                {renderDetailItem({ icon: FaCalendarCheck, label: "Available To", valueKey: "availableTo", editable: true, inputType: "date" })}
                {renderDetailItem({ icon: FaCalendarCheck, label: "Minimum Stay (Days)", valueKey: "minimumStay", editable: true, inputType: "number" })}
                {renderDetailItem({ icon: FaCalendarCheck, label: "Created", valueKey: "createdAt", displayValue: editData.createdAt ? new Date(editData.createdAt).toLocaleDateString() : 'N/A' })}
                {renderDetailItem({ icon: FaCalendarCheck, label: "Check-In Time", valueKey: "checkInTime", editable: true })}
                {renderDetailItem({ icon: FaCalendarCheck, label: "Check-Out Time", valueKey: "checkOutTime", editable: true })}
                {renderDetailItem({ 
                    icon: FaCalendarCheck, 
                    label: "Status", 
                    valueKey: "status", 
                    displayValue: statusInfo.label, 
                    editable: true, 
                    options: [
                        { value: 'pending', label: 'Pending' },
                        { value: 'approved', label: 'Active' },
                        { value: 'rejected', label: 'Rejected' }
                    ] 
                })}
            </div>

            {/* Description & Features */}
            <div style={{ marginTop: '30px', border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
                <h3 style={{ color: OYO_SECONDARY, marginTop: 0 }}>Description & Features</h3>
                {renderDetailItem({ icon: FaCamera, label: "Short Description", valueKey: "shortDescription", editable: true })}
                <p style={{ color: OYO_SECONDARY, opacity: 0.9, lineHeight: 1.6 }}>{editData.description || 'No detailed description provided.'}</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '15px' }}>
                    {(editData.amenities || []).map((a, idx) => (
                        <span key={idx} style={{ backgroundColor: OYO_BG_LIGHT, padding: '5px 10px', borderRadius: '5px', fontSize: '12px', color: OYO_SECONDARY }}>{a}</span>
                    ))}
                </div>

                {renderDetailItem({ icon: FaCamera, label: "Food Provided", valueKey: "foodProvided", editable: true })}
                {renderDetailItem({ icon: FaCamera, label: "Grooming Service", valueKey: "groomingService", editable: true })}
                {renderDetailItem({ icon: FaCamera, label: "Play Area", valueKey: "playArea", editable: true })}
                {renderDetailItem({ icon: FaCamera, label: "Vet On Call", valueKey: "vetOnCall", editable: true })}
                {renderDetailItem({ icon: FaCamera, label: "Stay Type", valueKey: "stayType", editable: true })}
                {renderDetailItem({ icon: FaExpandAlt, label: "Allowed Sizes", valueKey: "allowedSizes", displayValue: (editData.allowedSizes || []).join(', ') || 'N/A', editable: true })}
                {renderDetailItem({ icon: FaCamera, label: "Weight Limit", valueKey: "weightLimit", editable: true, inputType: "number" })}
                {renderDetailItem({ icon: FaCamera, label: "Breed Restrictions", valueKey: "breedRestrictions", editable: true })}
                {renderDetailItem({ icon: FaCamera, label: "Vaccination Required", valueKey: "vaccinationRequired", editable: true })}
                {renderDetailItem({ icon: FaCamera, label: "Rules / Guidelines", valueKey: "rulesGuidelines", editable: true })}
                {renderDetailItem({ icon: FaCamera, label: "Refund Policy", valueKey: "refundPolicy", editable: true })}
                {renderDetailItem({ 
                    icon: FaMapMarkerAlt, 
                    label: "Google Maps Link", 
                    valueKey: "googleMapsLink", 
                    displayValue: editData.googleMapsLink ? <a href={editData.googleMapsLink} target="_blank" rel="noopener noreferrer" style={{ color: OYO_PRIMARY }}>View Map</a> : 'N/A', 
                    editable: true 
                })}
                {renderDetailItem({ 
                    icon: FaTimesCircle, 
                    label: "T&C Confirmed", 
                    valueKey: "termsConfirmed", 
                    displayValue: editData.termsConfirmed ? <FaCheckCircle color="#28a745" /> : <FaTimesCircle color={OYO_PRIMARY} />, 
                    editable: true 
                })}
            </div>

            {/* Media & Photos */}
            <div style={{ marginTop: '30px', border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
                <h3 style={{ color: OYO_SECONDARY, marginTop: 0 }}>Verification & Media</h3>
                {renderDetailItem({ icon: FaIdCard, label: "Host ID Proof", valueKey: "idProof", displayValue: editData.idProof ? <a href={`http://localhost:5000/${editData.idProof}`} target="_blank" rel="noopener noreferrer" style={{ color: OYO_PRIMARY }}>View Document</a> : 'Not Uploaded' })}
                {renderDetailItem({ icon: FaCamera, label: "Video", valueKey: "video", displayValue: editData.video ? <a href={`http://localhost:5000/${editData.video}`} target="_blank" rel="noopener noreferrer" style={{ color: OYO_PRIMARY }}>View Video</a> : 'Not Uploaded' })}
                {renderDetailItem({ icon: FaCamera, label: "Photos Count", valueKey: "photos", displayValue: photos.length > 0 ? `${photos.length} uploaded` : 'None' })}

                {photos.length > 0 && (
                    <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                        <h4 style={{ color: OYO_SECONDARY, marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                            <FaImage style={{ marginRight: '10px' }} /> Submitted Photos
                        </h4>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                            gap: '15px',
                        }}>
                            {photos.map((photoPath, index) => (
                                <div 
                                    key={index}
                                    style={{ overflow: 'hidden', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', height: isMobile ? '120px' : '180px', cursor: 'pointer' }}
                                    onClick={() => window.open(`http://localhost:5000/${photoPath}`, '_blank')} 
                                >
                                    <img 
                                        src={`http://localhost:5000/${photoPath}`} 
                                        alt={`Listing Photo ${index + 1}`} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/180?text=Image+Error" }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'flex-end' }}>
                {isEditing ? (
                    <>
                        <button onClick={handleSave} disabled={loading} style={{ backgroundColor: '#28a745', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>{loading ? 'Saving...' : 'Save'}</button>
                        <button onClick={() => setIsEditing(false)} style={{ backgroundColor: '#dc3545', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setIsEditing(true)} style={{ backgroundColor: '#1079d5', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            <FaEdit style={{ marginRight: '5px' }} /> Edit Listing
                        </button>
                        <button onClick={() => onApprove(editData._id)} style={{ backgroundColor: '#28a745', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            <FaCheckCircle style={{ marginRight: '5px' }} /> Approve Listing
                        </button>
                        <button onClick={() => onReject(editData._id)} style={{ backgroundColor: OYO_PRIMARY, color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            <FaTimesCircle style={{ marginRight: '5px' }} /> Reject Listing
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default DogStayDetail;