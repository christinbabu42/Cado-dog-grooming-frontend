import React from 'react';
import DogStayListingDetail from './DogStayListingDetail.jsx'; // Assuming this component exists
import DogStayListingsTable from './DogStayListingsTable.jsx'; // Assuming this component exists
import { OYO_SECONDARY, BOX_STYLE } from './Constants.jsx';

const ListingsPage = ({ isMobile, selectedListing, setSelectedListing, refetchTrigger, handleApproveReject }) => {

    // Premium Color Palette
    const GOLD_GRADIENT = 'linear-gradient(135deg, #D4AF37 0%, #F9F295 50%, #B8860B 100%)';
    const PREMIUM_GOLD = '#B8860B'; 
    const SOFT_WHITE = '#FFFFFF';
    const OFF_WHITE = '#FBFBFB';

    // Global CSS Injection to force strict black text and golden buttons
    const GlobalStyleOverride = () => (
        <style>{`
            /* Force all general text, paragraphs, spans, and table cells to Black */
            .premium-container, 
            .premium-container p, 
            .premium-container span, 
            .premium-container div, 
            .premium-container td, 
            .premium-container th,
            .premium-container label {
                color: #000000 !important;
            }

            /* Keep Headings Gold for the Premium look */
            .premium-container h1, 
            .premium-container h2, 
            .premium-container h3 {
                color: ${PREMIUM_GOLD} !important;
            }

            /* Golden Button Logic */
            button {
                background: ${GOLD_GRADIENT} !important;
                color: #000000 !important; /* Button text stays black */
                font-weight: 700 !important;
                border: 1px solid rgba(0,0,0,0.1) !important;
                border-radius: 50px !important;
                padding: ${isMobile ? '10px 18px' : '12px 26px'} !important;
                cursor: pointer !important;
                box-shadow: 0 4px 12px rgba(184, 134, 11, 0.4) !important;
                transition: all 0.3s ease !important;
                text-transform: uppercase !important;
                font-size: ${isMobile ? '12px' : '13px'} !important;
                letter-spacing: 1px !important;
            }

            button:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 6px 20px rgba(184, 134, 11, 0.6) !important;
                filter: brightness(1.05);
            }

            /* Ensure table borders and lines fit the theme */
            table {
                border-collapse: collapse !important;
            }
            tr {
                border-bottom: 1px solid rgba(184, 134, 11, 0.1) !important;
            }
        `}</style>
    );

    const PREMIUM_BOX_STYLE = {
        ...BOX_STYLE,
        backgroundColor: SOFT_WHITE,
        borderRadius: '20px',
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.08), 0 5px 15px rgba(184, 134, 11, 0.1)',
        border: `1px solid rgba(184, 134, 11, 0.25)`,
        transition: 'all 0.3s ease',
        overflow: 'hidden'
    };

    if (selectedListing) {
        return (
            <div className="premium-container" style={{
                ...PREMIUM_BOX_STYLE, 
                padding: isMobile ? '15px' : '30px',
                background: SOFT_WHITE 
            }}>
                <GlobalStyleOverride />
                <button 
                    onClick={() => setSelectedListing(null)}
                    style={{ marginBottom: '25px' }}
                >
                    ← Back to Overview
                </button>

                <DogStayListingDetail 
                    listing={selectedListing} 
                    onBack={() => setSelectedListing(null)} 
                    isMobile={isMobile}
                    onApprove={(id) => handleApproveReject(id, true)} 
                    onReject={(id) => handleApproveReject(id, false)} 
                />
            </div>
        );
    }
    
    return (
        <div className="premium-container" style={{
            ...PREMIUM_BOX_STYLE, 
            padding: isMobile ? '25px' : '45px',
            position: 'relative'
        }}>
            <GlobalStyleOverride />
            
            {/* Elegant Top Decorative Border */}
            <div style={{
                height: '6px',
                width: '100%',
                background: GOLD_GRADIENT,
                position: 'absolute',
                top: 0,
                left: 0
            }} />

            <h2 style={{ 
                fontSize: isMobile ? '28px' : '38px',
                fontWeight: '800',
                letterSpacing: '-0.5px',
                marginBottom: '12px'
            }}>
                DogStay Listings 🐾
            </h2>
            
            <p style={{ 
                fontSize: isMobile ? '15px' : '17px',
                marginBottom: '30px',
                borderLeft: `4px solid ${PREMIUM_GOLD}`,
                paddingLeft: '15px',
                fontWeight: '500'
            }}>
                Click on any row to view full host submission details. Use the action button to delete.
            </p>

            <div style={{ 
                marginTop: '20px',
                borderRadius: '12px',
                background: OFF_WHITE,
                padding: '5px'
            }}>
                <DogStayListingsTable 
                    isMobile={isMobile} 
                    onSelectListing={setSelectedListing} 
                    refetchTrigger={refetchTrigger} 
                />
            </div>
        </div>
    );
};

export default ListingsPage;