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
      style={{ padding: isMobile ? '15px 20px' : '15px 60px' }}
    >
      <div className={nav.logo}>
Luvio
      </div>

      <div className={nav.links} style={{ gap: isMobile ? '15px' : '18px' }}>
        {!isMobile && (
          <a href="/owner/list-stay" className={nav.link}>
            📋 List your <span className={nav.primary}>Dog-Stay</span>
          </a>
        )}

        <a href="/staff" className={nav.link}>
          🐕‍🦺 {!isMobile && 'Grooming Career'}
        </a>

        <a href="/profile" className={nav.link}>
          ⚙️ {!isMobile && 'My Account'}
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
            fontWeight: "600"
          }}
        >
          🚪 {!isMobile && "Logout"}
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
      style={{ padding: isMobile ? '50px 20px' : '100px 0 50px' }}
    >
      <h2 className={search.heading}>
        Book a cozy room for your best friend!
      </h2>

      <div
        className={search.box}
        style={{ flexDirection: isMobile ? 'column' : 'row' }}
      >
        <input
          className={search.input}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="📍 Location"
        />

        {/* 🔄 Position Swap: Location detection trigger button now lives in the search layout block */}
        <button
          className={search.searchBtn}
          onClick={handleNearMe}
          disabled={isLocating}
        >
          {isLocating ? '📍 Detecting...' : 'Use My Current Location'}
        </button>
      </div>

      {/* 🔄 Position Swap: Main search navigation trigger button now sits here styled as the secondary button */}
      <button
        className={search.nearBtn}
        onClick={() => navigate('/rooms')}
      >
        🔍 search your pet's room
      </button>

      <div className={search.groomerWrap}>
        <button
          className={search.groomerBtn}
          onClick={() => navigate('/groomers')}
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
      padding: '20px 0',
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
          flex: '1 1 250px',
          maxWidth: '300px',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 8px 20px rgba(255, 255, 255, 0.1)',
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