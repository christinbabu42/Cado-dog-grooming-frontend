import React from "react";
import { FaPaw, FaStar, FaShieldAlt, FaHandHoldingHeart, FaVideo, FaCut } from "react-icons/fa";

const COLORS = {
  primary: "#ff385c", // Cado Pink/Red
  secondary: "#007bff", // Action Blue
  textMain: "#222222",
  textLight: "#6a6a6a",
  bgLight: "#f7f7f7",
  white: "#ffffff"
};

const AboutUs = () => {
  return (
    <div style={styles.pageWrapper}>
      {/* Hero Section */}
      <header style={styles.hero}>
        <h1 style={styles.mainTitle}>Welcome to Cado</h1>
        <p style={styles.subTitle}>Where Pets Are Family & Comfort Is Priority</p>
        <div style={styles.underline}></div>
      </header>

      {/* Story Section */}
      <section style={styles.section}>
        <div style={styles.card}>
          <div style={styles.contentRow}>
            <div style={styles.textBlock}>
              <h2 style={styles.sectionTitle}>Our Story</h2>
              <p style={styles.paragraph}>
                Born from a deep love for animals, <strong>Cado</strong> was founded by <strong>Christin Babu</strong>. 
                We noticed a gap in the pet-care industry—finding a safe, clean, and loving environment for pets 
                while their owners are away was harder than it should be.
              </p>
              <p style={styles.paragraph}>
                Inspired by the hospitality standards of global travel brands, we created Cado to provide 
                verified, high-quality dog stays and expert grooming services across India, starting with Kerala.
              </p>
            </div>
            <div style={styles.iconCircle}>
                <FaPaw size={80} color={COLORS.primary} />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Values - Grid */}
      <section style={styles.gridSection}>
        <div style={{ ...styles.card, flex: 1 }}>
          <FaStar size={30} color={COLORS.primary} style={{ marginBottom: "15px" }} />
          <h3 style={styles.cardTitle}>Our Vision</h3>
          <p style={styles.cardText}>
            To become India’s most reliable pet-care ecosystem by empowering pet lovers, 
            hosts, and professionals through technology and trust.
          </p>
        </div>

        <div style={{ ...styles.card, flex: 1 }}>
          <FaShieldAlt size={30} color={COLORS.secondary} style={{ marginBottom: "15px" }} />
          <h3 style={styles.cardTitle}>Why Choose Cado?</h3>
          <ul style={styles.list}>
            <li>✔ Verified & background-checked hosts</li>
            <li>✔ 24/7 Support for pet parents</li>
            <li>✔ Transparent & affordable pricing</li>
            <li>✔ "No Cages" philosophy</li>
          </ul>
        </div>
      </section>

      {/* Features Row */}
      <h2 style={{ ...styles.sectionTitle, textAlign: "center", marginTop: "50px" }}>The Cado Standard</h2>
      <div style={styles.featuresRow}>
        <div style={styles.featureItem}>
          <FaVideo size={24} color={COLORS.primary} />
          <span style={styles.featureLabel}>Daily Updates</span>
        </div>
        <div style={styles.featureItem}>
          <FaHandHoldingHeart size={24} color={COLORS.primary} />
          <span style={styles.featureLabel}>Expert Care</span>
        </div>
        <div style={styles.featureItem}>
          <FaCut size={24} color={COLORS.primary} />
          <span style={styles.featureLabel}>Pro Grooming</span>
        </div>
      </div>

      {/* Footer CTA */}
      <div style={styles.ctaBox}>
        <h2 style={{ color: COLORS.white, marginBottom: "10px" }}>Join the Cado Family</h2>
        <p style={{ color: "rgba(255,255,255,0.9)", marginBottom: "20px" }}>Experience peace of mind with India's most trusted pet care platform.</p>
        <button style={styles.ctaButton} onClick={() => window.location.href='/Home'}>Find a Stay</button>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    backgroundColor: COLORS.bgLight,
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "'Inter', sans-serif"
  },
  hero: {
    textAlign: "center",
    marginBottom: "60px"
  },
  mainTitle: {
    fontSize: "42px",
    color: COLORS.textMain,
    fontWeight: "800",
    marginBottom: "10px"
  },
  subTitle: {
    fontSize: "18px",
    color: COLORS.textLight
  },
  underline: {
    width: "60px",
    height: "4px",
    backgroundColor: COLORS.primary,
    margin: "15px auto",
    borderRadius: "2px"
  },
  section: {
    maxWidth: "1000px",
    margin: "0 auto 30px auto"
  },
  gridSection: {
    maxWidth: "1000px",
    margin: "0 auto",
    display: "flex",
    gap: "20px",
    flexWrap: "wrap"
  },
  card: {
    background: COLORS.white,
    padding: "35px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    border: "1px solid #eeeeee"
  },
  contentRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px",
    flexWrap: "wrap"
  },
  textBlock: {
    flex: 2,
    minWidth: "300px"
  },
  iconCircle: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#fff0f3",
    width: "150px",
    height: "150px",
    borderRadius: "50%"
  },
  sectionTitle: {
    fontSize: "28px",
    color: COLORS.textMain,
    marginBottom: "20px"
  },
  cardTitle: {
    fontSize: "22px",
    color: COLORS.textMain,
    marginBottom: "15px"
  },
  paragraph: {
    fontSize: "16px",
    color: COLORS.textLight,
    lineHeight: "1.8",
    marginBottom: "15px"
  },
  cardText: {
    fontSize: "15px",
    color: COLORS.textLight,
    lineHeight: "1.7"
  },
  list: {
    listStyle: "none",
    padding: 0,
    fontSize: "15px",
    color: COLORS.textLight,
    lineHeight: "2"
  },
  featuresRow: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    margin: "30px 0 60px 0",
    flexWrap: "wrap"
  },
  featureItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px"
  },
  featureLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: COLORS.textMain
  },
  ctaBox: {
    maxWidth: "1000px",
    margin: "0 auto",
    background: COLORS.primary,
    borderRadius: "20px",
    padding: "50px",
    textAlign: "center",
    boxShadow: "0 15px 35px rgba(255, 56, 92, 0.3)"
  },
  ctaButton: {
    backgroundColor: COLORS.white,
    color: COLORS.primary,
    border: "none",
    padding: "15px 40px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "transform 0.2s ease"
  }
};

export default AboutUs;