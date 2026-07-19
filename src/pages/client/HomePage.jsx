import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import home from './Home/HomePage.module.css';
import nav from './Home/NavBar.module.css';
import search from './Home/SearchBar.module.css';
import footer from './Home/Footer.module.css';

import image2 from '../../../public/image2.png';
import image3 from '../../../public/image3.png';
import image4 from '../../../public/image4.png';
import image5 from '../../../public/image5.png';


[
  image2,
  image3,
  image4,
  image5,
]

// --- Icon ---
const Icon = ({ children, className }) => (
  <span className={className}>{children}</span>
);

// --- Custom Hook ---
const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: windowWidth < 768,
  };
};

/* ================= FOOTER ================= */
const Footer = () => {
  const { isMobile } = useWindowWidth();

  return (
    <footer
      className={footer.footer}
      style={{ padding: isMobile ? '20px' : '40px 60px' }}
    >
      <div
        className={footer.container}
        style={{ flexDirection: isMobile ? 'column' : 'row' }}
      >
        <div className={footer.column}>
          <h4 className={footer.title}>Dog-Stay 🐾</h4>
          <p>The best place for your best friend's vacation.</p>
        </div>

        <div className={footer.column}>
          <ul className={footer.list}>
            <li><a href="/about-us">About Us</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className={footer.column}>
          <ul className={footer.list}>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms-and-conditions">Terms & Conditions</a></li>
          </ul>
        </div>
      </div>

      <div className={footer.bottom}>
        © {new Date().getFullYear()} Dog-Stay. All rights reserved.
      </div>
    </footer>
  );
};

/* ================= NAVBAR ================= */
const NavBar = () => {
  const { isMobile } = useWindowWidth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch(
        "https://cado-dog-grooming-backend.onrender.com/auth/google/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userPhoto");
      localStorage.removeItem("userCountry");
      localStorage.removeItem("walletBalance");
      localStorage.removeItem("staffProfile");
      localStorage.removeItem("staffId");
      localStorage.removeItem("staffUserId");
      localStorage.removeItem("hostListingIds");

      localStorage.setItem("justLoggedOut", "true");
      navigate("/login", { replace: true });

    } catch (error) {
      console.error("Logout error:", error);
      
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userPhoto");
      localStorage.removeItem("userCountry");
      localStorage.removeItem("walletBalance");
      localStorage.removeItem("staffProfile");
      localStorage.removeItem("staffId");
      localStorage.removeItem("staffUserId");
      localStorage.removeItem("hostListingIds");

      localStorage.setItem("justLoggedOut", "true");
      navigate("/login", { replace: true });
    }
  };

  return (
    <nav
      className={nav.nav}
      style={{ 
        padding: isMobile ? '15px 20px' : '15px 60px',
        position: 'relative',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <div className={nav.logo} style={{ fontWeight: 'bold', fontSize: '24px' }}>
        Luvio
      </div>

      {isMobile && (
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '24px',
            height: '18px',
            padding: '0',
            zIndex: '10'
          }}
        >
          <span style={{ width: '100%', height: '2px', backgroundColor: '#484848', transition: '0.3s', transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
          <span style={{ width: '100%', height: '2px', backgroundColor: '#484848', transition: '0.3s', opacity: isMenuOpen ? '0' : '1' }}></span>
          <span style={{ width: '100%', height: '2px', backgroundColor: '#484848', transition: '0.3s', transform: isMenuOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'none' }}></span>
        </button>
      )}

      <div 
        className={nav.links} 
        style={{ 
          gap: isMobile ? '15px' : '18px',
          display: isMobile ? (isMenuOpen ? 'flex' : 'none') : 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          width: isMobile ? '100%' : 'auto',
          marginTop: isMobile ? '15px' : '0',
          paddingTop: isMobile ? '10px' : '0',
          borderTop: isMobile ? '1px solid #eee' : 'none',
          alignItems: isMobile ? 'flex-start' : 'center'
        }}
      >
        <a href="/owner/list-stay" className={nav.link} style={{ width: isMobile ? '100%' : 'auto', padding: isMobile ? '5px 0' : '0' }}>
          📋 List your <span className={nav.primary}>Dog-Stay</span>
        </a>

        <a href="/staff" className={nav.link} style={{ width: isMobile ? '100%' : 'auto', padding: isMobile ? '5px 0' : '0' }}>
          🐕‍🦺 Grooming Career
        </a>

        <a href="/profile" className={nav.link} style={{ width: isMobile ? '100%' : 'auto', padding: isMobile ? '5px 0' : '0' }}>
          ⚙️ My Account
        </a>

        <button
          onClick={handleLogout}
          style={{
            background: "#ff4d4f",
            color: "white",
            border: "none",
            padding: "8px 15px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            width: isMobile ? '100%' : 'auto',
            textAlign: 'center'
          }}
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

/* ================= SEARCH BAR ================= */
const SearchBar = () => {
  const navigate = useNavigate();
  const { isMobile } = useWindowWidth();

  const [location, setLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const handleNearMe = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');

    setIsLocating(true);
    setLocation('Locating...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();
        setLocation(data.display_name || `${latitude}, ${longitude}`);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        alert('Location access denied');
      }
    );
  };

  return (
    <div
      className={search.wrapper}
      style={{ padding: isMobile ? '40px 20px' : '100px 0 50px' }}
    >
      <h2 className={search.heading} style={{ fontSize: isMobile ? '28px' : '36px', marginBottom: isMobile ? '25px' : '40px' }}>
        Book a cozy room for your best friend!
      </h2>

      <div
        className={search.box}
        style={{ 
          flexDirection: isMobile ? 'column' : 'row',
          borderRadius: '8px',
          boxShadow: '0 12px 25px rgba(139, 101, 8, 0.08)',
          overflow: 'hidden',
          border: '1px solid #D4AF37',
          maxWidth: '900px',
          width: '100%',
          margin: '0 auto'
        }}
      >
        <input
          className={search.input}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="📍 Location"
          style={{ 
            padding: '15px', 
            border: 'none', 
            outline: 'none', 
            flex: '3', 
            color: 'black', 
            fontSize: '16px',
            width: isMobile ? '100%' : 'auto',
            boxSizing: 'border-box'
          }}
        />

        <button
          className={search.searchBtn}
          onClick={handleNearMe}
          disabled={isLocating}
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
            color: '#ffffff',
            border: 'none',
            cursor: isLocating ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            padding: '14px 26px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: '14px',
            opacity: isLocating ? 0.7 : 1,
            width: isMobile ? '100%' : 'auto',
            boxSizing: 'border-box',
            transition: 'all 0.25s ease'
          }}
        >
          {isLocating ? '📍 Detecting...' : 'Use My Current Location'}
        </button>
      </div>

      <button
        className={search.nearBtn}
        onClick={() => navigate('/rooms')}
        style={{
          marginTop: '25px',
          padding: '12px 28px',
          background: '#ffffff',
          border: '2px solid #D4AF37',
          color: '#AA771C',
          cursor: 'pointer',
          fontWeight: '700',
          marginBottom: '25px',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          fontSize: '14px',
          borderRadius: '6px', 
          boxShadow: '0 4px 12px rgba(170, 119, 28, 0.1)',
          width: isMobile ? '100%' : 'auto',
          maxWidth: isMobile ? '900px' : 'none',
          boxSizing: 'border-box',
          transition: 'all 0.25s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #D4AF37 0%, #AA771C 100%)';
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.boxShadow = '0 6px 18px rgba(139, 101, 8, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#ffffff';
          e.currentTarget.style.color = '#AA771C';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(170, 119, 28, 0.1)';
        }}
      >
        🔍 search your pet's room
      </button>

      <div className={search.groomerWrap} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <button
          className={search.groomerBtn}
          onClick={() => navigate('/groomers')}
          style={{
            background: 'linear-gradient(135deg, #111111 0%, #222222 100%)', 
            color: '#D4AF37', 
            border: '2px solid #D4AF37', 
            borderRadius: '8px',
            fontWeight: '700',
            cursor: 'pointer',
            minHeight: '1.5cm',
            height: 'auto',
            padding: isMobile ? '15px 20px' : '0 28px',
            fontSize: '15px',
            letterSpacing: '0.5px',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
            width: isMobile ? '100%' : 'auto',
            maxWidth: '900px',
            boxSizing: 'border-box',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #D4AF37 0%, #AA771C 100%)';
            e.currentTarget.style.color = '#111111';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #111111 0%, #222222 100%)';
            e.currentTarget.style.color = '#D4AF37';
          }}
        >
          ✂️ Book a groomer now — do grooming in your home
        </button>
      </div>
    </div>
  );
};

/* ================= PAGE ================= */
const HomePage = () => {
  const { isMobile } = useWindowWidth();

  useEffect(() => {
    // Legacy URL token checking completely cleared to maintain security parity with HttpOnly Cookies.
  }, []);

  return (
    <div className={home.page}>
      <NavBar />
      <main>
        <SearchBar />

        {/* --- Flex Image / Promo Section --- */}
        <section
          className={home.main}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '20px',
            padding: '20px',
          }}
        >
          {[
            '/image2.png',
            '/image3.png',
            '/image4.png',
            '/image5.png',
          ].map((img, i) => (
            <div
              key={i}
              style={{
                flex: isMobile ? '1 1 100%' : '1 1 250px',
                maxWidth: '300px',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img
                src={img}
                alt={`Dog Stay ${i + 1}`}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;