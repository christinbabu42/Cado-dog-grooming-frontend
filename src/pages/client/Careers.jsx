import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCut, FaPaw, FaHeart, FaSmile, FaArrowRight } from "react-icons/fa";

const COLORS = {
  primary: "#ff385c", // Cado Pink
  textMain: "#222222",
  textLight: "#6a6a6a",
  bgLight: "#f7f7f7",
  white: "#ffffff",
  accent: "#fff0f3"
};

const Careers = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.pageWrapper}>
      {/* Header Section */}
      <header style={styles.header}>
        <h1 style={styles.title}>Work With <span style={{color: COLORS.primary}}>Cado</span></h1>
        <p style={styles.subtitle}>
          Help us redefine pet care in India. We're looking for passionate individuals who treat every pet like their own.
        </p>
      </header>

      {/* Main Content Grid */}
      <div style={styles.contentGrid}>
        
        {/* Left Side: Culture/Info */}
        <div style={styles.infoSection}>
          <h2 style={styles.sectionTitle}>Why Join Our Pack?</h2>
          <div style={styles.benefitItem}>
            <div style={styles.iconBox}><FaHeart /></div>
            <div>
              <h4 style={styles.benefitTitle}>Pet-First Culture</h4>
              <p style={styles.benefitDesc}>Everything we do starts with the well-being and happiness of our furry guests.</p>
            </div>
          </div>
          <div style={styles.benefitItem}>
            <div style={styles.iconBox}><FaSmile /></div>
            <div>
              <h4 style={styles.benefitTitle}>Great Environment</h4>
              <p style={styles.benefitDesc}>Work in a stress-free, supportive environment led by Alwin Kuriyan's vision.</p>
            </div>
          </div>
          <div style={styles.benefitItem}>
            <div style={styles.iconBox}><FaPaw /></div>
            <div>
              <h4 style={styles.benefitTitle}>Career Growth</h4>
              <p style={styles.benefitDesc}>Gain hands-on experience with diverse breeds and high-end grooming standards.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Featured Vacancy Card */}
        <div style={styles.vacancyCard}>
          <div style={styles.badge}>Hiring Now</div>
          <FaCut size={40} color={COLORS.primary} style={{ marginBottom: '15px' }} />
          <h2 style={styles.jobTitle}>Professional Pet Groomer</h2>
          <p style={styles.jobLocation}>Location: Kerala (Multiple Branches)</p>
          
          <div style={styles.divider}></div>
          
          <h4 style={styles.listTitle}>What we're looking for:</h4>
          <ul style={styles.jobList}>
            <li>Experience in breed-specific haircuts</li>
            <li>Patient and gentle handling skills</li>
            <li>Knowledge of pet hygiene & safety</li>
            <li>Willingness to learn Cado's standards</li>
          </ul>

          <button 
            style={styles.applyBtn} 
            onClick={() => navigate('/staff')}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Apply for this Role <FaArrowRight style={{ marginLeft: '10px' }} />
          </button>
        </div>

      </div>

      {/* General Inquiry Footer */}
      <footer style={styles.footer}>
        <p style={{ color: COLORS.textLight }}>
          Don't see a role for you? We are always looking for talent. 
          Email your resume to <strong style={{color: COLORS.textMain}}>alwinkuriyan96@gmail.com</strong>
        </p>
      </footer>
    </div>
  );
};

const styles = {
  pageWrapper: {
    backgroundColor: COLORS.bgLight,
    minHeight: "100vh",
    padding: "60px 20px",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    textAlign: "center",
    maxWidth: "800px",
    margin: "0 auto 60px auto",
  },
  title: {
    fontSize: "48px",
    fontWeight: "800",
    color: COLORS.textMain,
    marginBottom: "15px",
  },
  subtitle: {
    fontSize: "18px",
    color: COLORS.textLight,
    lineHeight: "1.6",
  },
  contentGrid: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "40px",
    alignItems: "start",
  },
  infoSection: {
    padding: "20px",
  },
  sectionTitle: {
    fontSize: "28px",
    color: COLORS.textMain,
    marginBottom: "30px",
  },
  benefitItem: {
    display: "flex",
    gap: "20px",
    marginBottom: "25px",
  },
  iconBox: {
    minWidth: "50px",
    height: "50px",
    backgroundColor: COLORS.accent,
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: COLORS.primary,
    fontSize: "20px",
  },
  benefitTitle: {
    margin: "0 0 5px 0",
    fontSize: "18px",
    color: COLORS.textMain,
  },
  benefitDesc: {
    margin: 0,
    fontSize: "14px",
    color: COLORS.textLight,
    lineHeight: "1.5",
  },
  vacancyCard: {
    background: COLORS.white,
    padding: "40px",
    borderRadius: "24px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
    border: "1px solid #eeeeee",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: "20px",
    right: "20px",
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  jobTitle: {
    fontSize: "26px",
    color: COLORS.textMain,
    margin: "0 0 5px 0",
  },
  jobLocation: {
    fontSize: "14px",
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: "20px",
  },
  divider: {
    height: "1px",
    backgroundColor: "#f0f0f0",
    margin: "20px 0",
  },
  listTitle: {
    fontSize: "16px",
    color: COLORS.textMain,
    marginBottom: "15px",
  },
  jobList: {
    paddingLeft: "20px",
    color: COLORS.textLight,
    fontSize: "15px",
    lineHeight: "2",
    marginBottom: "30px",
  },
  applyBtn: {
    width: "100%",
    padding: "16px",
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    border: "none",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 20px rgba(255, 56, 92, 0.2)",
  },
  footer: {
    textAlign: "center",
    marginTop: "80px",
    padding: "20px",
    borderTop: "1px solid #eee",
  }
};

export default Careers;