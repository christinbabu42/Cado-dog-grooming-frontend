import React from "react";
import { FaShieldAlt, FaLock, FaUserSecret, FaEye, FaDatabase, FaHeadset } from "react-icons/fa";

const COLORS = {
  primary: "#ff385c", // Cado Pink
  textMain: "#222222",
  textLight: "#5d5d5d",
  bgLight: "#f4f7f6",
  white: "#ffffff",
  border: "#e5e7eb"
};

const PrivacyPolicy = () => {
  const lastUpdated = "December 28, 2025";

  return (
    <div style={styles.pageWrapper}>
      {/* Top Banner */}
      <div style={styles.headerBanner}>
        <FaShieldAlt size={40} color={COLORS.primary} style={{ marginBottom: '15px' }} />
        <h1 style={styles.title}>Privacy Policy</h1>
        <p style={styles.updatedDate}>Last Updated: {lastUpdated}</p>
      </div>

      <div style={styles.container}>
        {/* Intro Section */}
        <section style={styles.section}>
          <p style={styles.introText}>
            At <strong>Cado</strong>, we take your privacy seriously. This policy describes how Alwin Kuriyan's 
            PetCare Network ("we", "us", or "our") collects, uses, and shares your personal information 
            when you use our website and pet-care services.
          </p>
        </section>

        {/* 1. Information Collection */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <FaDatabase style={styles.icon} />
            <h2 style={styles.cardTitle}>1. Information We Collect</h2>
          </div>
          <div style={styles.cardBody}>
            <h4 style={styles.subHeading}>Personal Identification</h4>
            <p style={styles.text}>Name, email address, phone number, and physical address for service delivery.</p>
            
            <h4 style={styles.subHeading}>Pet Specific Data</h4>
            <p style={styles.text}>Breed, age, medical history, vaccination records, and behavioral traits to ensure safety during stays.</p>
            
            <h4 style={styles.subHeading}>Technical Data</h4>
            <p style={styles.text}>IP addresses, browser type, and location data (collected only with your explicit consent via GPS).</p>
          </div>
        </div>

        {/* 2. How We Use Data */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <FaEye style={styles.icon} />
            <h2 style={styles.cardTitle}>2. How We Use Your Data</h2>
          </div>
          <div style={styles.cardBody}>
            <ul style={styles.list}>
              <li><strong>Service Fulfillment:</strong> To process bookings, grooming appointments, and payments.</li>
              <li><strong>Communication:</strong> To send real-time updates of your pet's status via WhatsApp or Email.</li>
              <li><strong>Platform Improvement:</strong> Analyzing user behavior to fix bugs and improve the Cado UI.</li>
              <li><strong>Legal Compliance:</strong> To prevent fraudulent bookings and maintain safety records.</li>
            </ul>
          </div>
        </div>

        {/* 3. Data Protection */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <FaLock style={styles.icon} />
            <h2 style={styles.cardTitle}>3. Security & Protection</h2>
          </div>
          <div style={styles.cardBody}>
            <p style={styles.text}>
              We implement <strong>256-bit SSL encryption</strong> for all data transmissions. Your payment 
              information is handled by PCI-DSS compliant partners and is never stored directly on our servers. 
              Only authorized staff members involved in your pet's care have access to specific pet health data.
            </p>
          </div>
        </div>

        {/* 4. Your Rights */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <FaUserSecret style={styles.icon} />
            <h2 style={styles.cardTitle}>4. Your Privacy Rights</h2>
          </div>
          <div style={styles.cardBody}>
            <p style={styles.text}>
              You have the right to request access to the data we hold about you, or to request the deletion 
              of your account. To do so, please contact our privacy officer.
            </p>
          </div>
        </div>

        {/* Contact Footer */}
        <div style={styles.contactSection}>
          <FaHeadset size={24} color={COLORS.primary} style={{ marginBottom: '10px' }} />
          <h3 style={styles.contactTitle}>Have Questions?</h3>
          <p style={styles.text}>Email our Privacy Team at:</p>
          <a href="mailto:alwinkuriyan96@gmail.com" style={styles.emailLink}>alwinkuriyan96@gmail.com</a>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    backgroundColor: COLORS.bgLight,
    minHeight: "100vh",
    paddingBottom: "80px",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  headerBanner: {
    backgroundColor: COLORS.white,
    padding: "60px 20px",
    textAlign: "center",
    borderBottom: `1px solid ${COLORS.border}`,
  },
  title: {
    fontSize: "36px",
    fontWeight: "800",
    color: COLORS.textMain,
    margin: "0 0 10px 0",
  },
  updatedDate: {
    color: COLORS.textLight,
    fontSize: "14px",
    fontWeight: "500",
  },
  container: {
    maxWidth: "850px",
    margin: "40px auto 0 auto",
    padding: "0 20px",
  },
  section: {
    marginBottom: "30px",
  },
  introText: {
    fontSize: "16px",
    lineHeight: "1.8",
    color: COLORS.textLight,
    textAlign: "center",
  },
  card: {
    background: COLORS.white,
    borderRadius: "16px",
    padding: "30px",
    marginBottom: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
    border: `1px solid ${COLORS.border}`,
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
  },
  icon: {
    fontSize: "20px",
    color: COLORS.primary,
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: COLORS.textMain,
    margin: 0,
  },
  subHeading: {
    fontSize: "15px",
    fontWeight: "700",
    color: COLORS.textMain,
    margin: "15px 0 5px 0",
  },
  text: {
    fontSize: "15px",
    lineHeight: "1.6",
    color: COLORS.textLight,
    margin: 0,
  },
  list: {
    paddingLeft: "20px",
    fontSize: "15px",
    color: COLORS.textLight,
    lineHeight: "2",
  },
  contactSection: {
    textAlign: "center",
    marginTop: "50px",
    padding: "40px",
    borderRadius: "20px",
    backgroundColor: "rgba(255, 56, 92, 0.05)",
  },
  contactTitle: {
    fontSize: "20px",
    color: COLORS.textMain,
    marginBottom: "10px",
  },
  emailLink: {
    color: COLORS.primary,
    fontWeight: "700",
    textDecoration: "none",
    fontSize: "16px",
  }
};

export default PrivacyPolicy;