import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaStar,
  FaUserCircle,
  FaArrowLeft,
  FaTimes,
  FaUser
} from "react-icons/fa";
import "./ReviewsPage.css";

const BACKEND_BASE_URL = "https://cado-dog-grooming-backend.onrender.com/";

const ReviewsPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${BACKEND_BASE_URL}api/reviews/${roomId}`);
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, [roomId]);

  const calculateAverage = () => {
    if (reviews.length === 0) return "0.0";
    const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  return (
    <div className="golden-theme-wrapper">
      {/* Lightbox */}
      {selectedImg && (
        <div className="lightbox-overlay" onClick={() => setSelectedImg(null)}>
          <button className="close-lightbox">
            <FaTimes />
          </button>
          <div className="lightbox-content">
            <img src={selectedImg} alt="Enlarged review" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="navbar-row">
        <div className="brand" onClick={() => navigate("/")}>
          DogStay<span>.</span>
        </div>
        <button className="back-link" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back to Listings
        </button>
      </nav>

      {/* Header */}
      <header className="hero-row">
        <h1>Guest Feedback</h1>
        <div className="summary-line">
          <span className="count-pill">{reviews.length} Verified Reviews</span>
          <span className="dot">•</span>
          <span className="rating-pill">
            <FaStar className="star-icon" /> {calculateAverage()} Rating
          </span>
        </div>
      </header>

      {/* Reviews */}
      <main className="reviews-list-container">
        {reviews.length === 0 ? (
          <div className="no-data">
            <p>No reviews yet for this property. Be the first to leave one!</p>
          </div>
        ) : (
          reviews.map((r, i) => (
            <div key={i} className="review-row-item">
              <div className="review-left-col">
                <div className="user-profile">
                  {r.user?.profilePic ? (
                    <img src={`${BACKEND_BASE_URL}${r.user.profilePic}`} alt="user" />
                  ) : (
                    <FaUserCircle className="placeholder-icon" />
                  )}
                  <div>
                    <h4 className="user-name">{r.user?.name || "Guest"}</h4>
                    <span className="stay-date">
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="row-rating">
                  <FaStar /> {r.rating}.0
                </div>
              </div>

              <div className="review-right-col">
                <p className="review-content">{r.reviewText}</p>

                {r.photo && (
                  <div
                    className="thumbnail-container"
                    onClick={() =>
                      setSelectedImg(
                        `${BACKEND_BASE_URL}${r.photo.replace(/\\/g, "/")}`
                      )
                    }
                  >
                    <img
                      src={`${BACKEND_BASE_URL}${r.photo.replace(/\\/g, "/")}`}
                      alt="Review attachment"
                      className="review-thumbnail"
                    />
                    <div className="thumbnail-hover">View Photo</div>
                  </div>
                )}

                {/* ✅ HOST RESPONSE (NEW) */}
                {r.hostResponse?.text && (
                  <div className="host-response-box">
                    <div className="host-response-header">
                      <FaUser /> Host Response
                    </div>
                    <p className="host-response-text">
                      {r.hostResponse.text}
                    </p>
                    <span className="host-response-date">
                      {new Date(r.hostResponse.respondedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </main>

      <footer className="footer-row">
        <p>&copy; {new Date().getFullYear()} DogStay Premium. Handcrafted with Care.</p>
      </footer>
    </div>
  );
};

export default ReviewsPage;
