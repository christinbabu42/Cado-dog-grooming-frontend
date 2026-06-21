import React, { useState, useEffect } from 'react';
import { FaTrash, FaSearch, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { OYO_PRIMARY, OYO_SECONDARY, OYO_BG_LIGHT, CARD_BG } from './Constants.jsx';

// Helper function for status display
const getStatusDisplay = (item) => {
    if (item.isApproved) return { label: 'Active', bgColor: '#28a74520', color: '#28a745' };
    if (item.isRejected) return { label: 'Rejected', bgColor: `${OYO_PRIMARY}20`, color: OYO_PRIMARY };
    return { label: 'Pending', bgColor: '#ffc10720', color: '#ffc107' };
};

const DogStayListingsTable = ({ isMobile, onSelectListing, refetchTrigger }) => {
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    const fetchListings = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://cado-dog-grooming-backend.onrender.com/api/admin/dogstay');
            if (response.data.success) {
                setListings(response.data.data);
                setFilteredListings(response.data.data);
            } else {
                setListings([]);
                setFilteredListings([]);
            }
        } catch (err) {
            console.error(err);
            setError('Error fetching listings: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, [refetchTrigger]);

    // DELETE
    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm(`Delete listing ${id.slice(-4)}?`)) return;
        try {
            await axios.delete(`https://cado-dog-grooming-backend.onrender.com/api/admin/dogstay/${id}`);
            setListings(prev => prev.filter(l => l._id !== id));
            setFilteredListings(prev => prev.filter(l => l._id !== id));
            alert('Listing deleted successfully.');
        } catch (err) {
            console.error(err);
            alert('Error deleting listing: ' + err.message);
        }
    };

    // START EDIT
    const startEdit = (item) => {
        setEditingId(item._id);
        setEditData({
            roomName: item.roomName || '',
            pricePerDay: item.pricePerDay || '',
            ownerFullName: item.ownerFullName || '',
            isApproved: item.isApproved || false,
            isRejected: item.isRejected || false,
        });
    };

    // SAVE EDIT
    const saveEdit = async (id) => {
        try {
            const response = await axios.put(`https://cado-dog-grooming-backend.onrender.com/api/admin/dogstay/dogstay/${id}`, editData);
            if (response.data.success) {
                setListings(prev => prev.map(l => l._id === id ? response.data.listing : l));
                setFilteredListings(prev => prev.map(l => l._id === id ? response.data.listing : l));
                setEditingId(null);
                alert('Listing updated successfully!');
            }
        } catch (err) {
            console.error(err);
            alert('Error updating listing: ' + err.message);
        }
    };

    // CANCEL EDIT
    const cancelEdit = () => {
        setEditingId(null);
        setEditData({});
    };

    // SEARCH
    useEffect(() => {
        if (!searchTerm) setFilteredListings(listings);
        else {
            const term = searchTerm.toLowerCase();
            const filtered = listings.filter(item =>
                (item.roomName && item.roomName.toLowerCase().includes(term)) ||
                (item.hostId?.name && item.hostId.name.toLowerCase().includes(term)) ||
                (item.ownerFullName && item.ownerFullName.toLowerCase().includes(term)) ||
                (item._id && item._id.toLowerCase().includes(term))
            );
            setFilteredListings(filtered);
        }
    }, [searchTerm, listings]);

    if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: OYO_SECONDARY }}>Loading Listings...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '50px', color: OYO_PRIMARY }}>Error: {error}</div>;
    if (!listings.length) return <div style={{ textAlign: 'center', padding: '50px', color: OYO_SECONDARY, opacity: 0.7 }}>No listings found.</div>;

    return (
        <div>
            {/* SEARCH BOX */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <FaSearch color={OYO_SECONDARY} style={{ marginRight: '10px' }} />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: `1px solid ${OYO_BG_LIGHT}`, fontSize: '14px' }}
                />
            </div>

            <div style={{ overflowX: 'auto', backgroundColor: CARD_BG, borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ backgroundColor: OYO_BG_LIGHT, borderBottom: '2px solid #ddd' }}>
                            <th>ID</th>
                            <th>Room Name</th>
                            <th>Host Name</th>
                            <th>Price/Day</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredListings.map((item, index) => {
                            const status = getStatusDisplay(item);
                            const isEditing = editingId === item._id;
                            return (
                                <tr
                                    key={item._id}
                                    style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}
                                    onClick={() => !isEditing && onSelectListing(item)}
                                >
                                    <td>...{item._id.slice(-4)}</td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                value={editData.roomName}
                                                onChange={e => setEditData({ ...editData, roomName: e.target.value })}
                                            />
                                        ) : item.roomName || 'Untitled'}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                value={editData.ownerFullName}
                                                onChange={e => setEditData({ ...editData, ownerFullName: e.target.value })}
                                            />
                                        ) : item.hostId?.name || item.ownerFullName || 'Unknown'}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={editData.pricePerDay}
                                                onChange={e => setEditData({ ...editData, pricePerDay: e.target.value })}
                                            />
                                        ) : `₹${item.pricePerDay || 'N/A'}`}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <select
                                                value={editData.isApproved ? 'approved' : editData.isRejected ? 'rejected' : 'pending'}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    setEditData({ ...editData, isApproved: val === 'approved', isRejected: val === 'rejected' });
                                                }}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Active</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        ) : (
                                            <span style={{ padding: '5px 10px', borderRadius: '5px', fontSize: '12px', backgroundColor: status.bgColor, color: status.color }}>
                                                {status.label}
                                            </span>
                                        )}
                                    </td>
                                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        {isEditing ? (
                                            <>
                                                <button onClick={() => saveEdit(item._id)}>Save</button>
                                                <button onClick={cancelEdit}>Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); startEdit(item); }}
                                                    style={{ marginRight: '5px' }}
                                                >
                                                    <FaEdit /> Edit
                                                </button>
                                                <button onClick={(e) => handleDelete(e, item._id)}><FaTrash /> Delete</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DogStayListingsTable;
