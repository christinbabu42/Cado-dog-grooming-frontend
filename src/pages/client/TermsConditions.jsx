import React from "react";
import { FaGavel, FaCheckDouble, FaCreditCard, FaExclamationTriangle, FaFileSignature, FaClock } from "react-icons/fa";

const COLORS = {
  primary: "#ff385c", // Cado Pink
  textMain: "#1a1a1a",
  textLight: "#6b7280",
  bgLight: "#f9fafb",
  white: "#ffffff",
  border: "#e5e7eb",
  accent: "#fef2f2"
};

const TermsConditions = () => {
  return (
    <div style={styles.pageWrapper}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.iconCircle}>
          <FaFileSignature size={30} color={COLORS.primary} />
        </div>
        <h1 style={styles.title}>Terms & Conditions</h1>
        <p style={styles.subtitle}>Effective from December 2025. Please read these terms carefully before using Cado.</p>
      </div>

      <div style={styles.contentBody}>
        
        {/* Section 1: Acceptance */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <FaCheckDouble style={styles.sectionIcon} />
            <h2 style={styles.sectionTitle}>1. Acceptance of Terms</h2>
          </div>
          <p style={styles.text}>
            By accessing or using the Cado platform, you agree to be bound by these Terms of Service. 
            If you do not agree, you may not access our services. Cado acts as a marketplace 
            connecting pet owners with third-party service providers (Hosts and Groomers).
          </p>
        </section>

        {/* Section 2: Pet Health & Safety (CRITICAL FOR PET INDUSTRY) */}
        <div style={styles.highlightCard}>
          <div style={styles.sectionHeader}>
            <FaExclamationTriangle color={COLORS.primary} style={styles.sectionIcon} />
            <h2 style={styles.sectionTitle}>2. Pet Health & Safety</h2>
          </div>
          <p style={styles.text}>
            To ensure the safety of all animals, users must comply with the following:
          </p>
          <ul style={styles.list}>
            <li><strong>Vaccinations:</strong> All pets must have up-to-date DHPP, Rabies, and Bordetella vaccinations. Proof must be uploaded to the profile.</li>
            <li><strong>Aggression:</strong> Owners must disclose any history of aggression. Hosts reserve the right to terminate a stay if a pet poses a danger.</li>
            <li><strong>Medical Emergency:</strong> In case of emergency, Cado is authorized to seek veterinary care if the owner is unreachable. Costs will be billed to the owner.</li>
          </ul>
        </div>

        {/* Section 3: Payments */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <FaCreditCard style={styles.sectionIcon} />
            <h2 style={styles.sectionTitle}>3. Bookings & Financials</h2>
          </div>
          <p style={styles.text}>
            Cado uses secure third-party payment processors. A booking is only confirmed once the 
            initial deposit or full payment is received.
          </p>
          <div style={styles.nestedBox}>
            <h4 style={{ margin: "0 0 5px 0" }}>Cancellation Policy:</h4>
            <p style={{ margin: 0, fontSize: "14px" }}>
              <FaClock style={{ marginRight: "5px" }} /> 
              Full refund if cancelled 48 hours before check-in. 50% refund within 24 hours.
            </p>
          </div>
        </section>

        {/* Section 4: Liability */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <FaGavel style={styles.sectionIcon} />
            <h2 style={styles.sectionTitle}>4. Limitation of Liability</h2>
          </div>
          <p style={styles.text}>
            Cado is a platform for connection. While we verify hosts, we are not liable for 
            unforeseen incidents, injuries, or property damage occurring during a stay or grooming 
            session. We provide "Cado Guarantee" coverage for eligible incidents as per our secondary policy.
          </p>
        </section>

        {/* Section 5: User Conduct */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>5. User Responsibilities</h2>
          <p style={styles.text}>
            Users agree not to bypass the platform by booking directly with Cado-listed hosts. 
            Any attempt to "off-platform" bookings will result in permanent account suspension.
          </p>
        </section>

        {/* Bottom Notice */}
        <div style={styles.footer}>
          <p>Questions about our Terms? Contact Alwin's Legal Team:</p>
          <a href="mailto:alwinkuriyan96@gmail.com" style={styles.link}>legal@cado-petcare.com</a>
        </div>
      </div>
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
    margin: "0 auto 50px auto",
  },
  iconCircle: {
    width: "70px",
    height: "70px",
    backgroundColor: COLORS.white,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px auto",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    color: COLORS.textMain,
    margin: "0 0 10px 0",
  },
  subtitle: {
    color: COLORS.textLight,
    fontSize: "16px",
    lineHeight: "1.5",
  },
  contentBody: {
    maxWidth: "850px",
    margin: "0 auto",
    backgroundColor: COLORS.white,
    padding: "50px",
    borderRadius: "24px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
    border: `1px solid ${COLORS.border}`,
  },
  section: {
    marginBottom: "40px",
    paddingBottom: "20px",
    borderBottom: `1px solid ${COLORS.bgLight}`,
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "15px",
  },
  sectionIcon: {
    fontSize: "18px",
    color: COLORS.textLight,
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: COLORS.textMain,
    margin: 0,
  },
  text: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: COLORS.textLight,
  },
  highlightCard: {
    backgroundColor: COLORS.accent,
    padding: "30px",
    borderRadius: "16px",
    marginBottom: "40px",
    border: `1px solid #fee2e2`,
  },
  list: {
    paddingLeft: "20px",
    fontSize: "15px",
    color: COLORS.textLight,
    lineHeight: "2",
    marginTop: "15px",
  },
  nestedBox: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: COLORS.bgLight,
    borderRadius: "10px",
    borderLeft: `4px solid ${COLORS.primary}`,
    color: COLORS.textMain,
  },
  footer: {
    textAlign: "center",
    marginTop: "30px",
    fontSize: "14px",
    color: COLORS.textLight,
  },
  link: {
    color: COLORS.primary,
    textDecoration: "none",
    fontWeight: "700",
  }
};

export default TermsConditions;