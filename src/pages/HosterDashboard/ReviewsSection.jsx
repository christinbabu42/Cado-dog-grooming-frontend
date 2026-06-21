import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import SectionTitle from './SectionTitle';
import { FaStar, FaEdit, FaQuoteLeft, FaCrown } from 'react-icons/fa';
import './ReviewsSection.css'; 

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReviewId, setActiveReviewId] = useState(null);
  const [responseText, setResponseText] = useState("");

  const hostId = localStorage.getItem("hostId");
  const BACKEND_BASE_URL = "https://cado-dog-grooming-backend.onrender.com/";

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!hostId || hostId === "undefined") {
          console.error("❌ Host ID missing");
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const res = await axios.get(
          `${BACKEND_BASE_URL}api/host-reviews/host/${hostId}`,
          config
        );

        if (res.data.success) {
          setReviews(res.data.reviews);
        }
      } catch (err) {
        console.error(err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [hostId]);

  const submitResponse = async (reviewId) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');

      await axios.post(
        `${BACKEND_BASE_URL}api/reviews/respond/${reviewId}`,
        { text: responseText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReviews(prev =>
        prev.map(r =>
          r._id === reviewId
            ? { ...r, hostResponse: { text: responseText, respondedAt: new Date() } }
            : r
        )
      );

      setActiveReviewId(null);
      setResponseText("");

    } catch (err) {
      alert("Failed to submit response");
    }
  };

  if (loading) return (
    <div className="review-status-container gold-theme">
      <div className="gold-loader"></div>
      <p className="gold-text">Refining your guest experiences...</p>
    </div>
  );

  if (reviews.length === 0) return (
    <div className="review-status-container gold-theme">
      <p className="no-reviews gold-text">No reviews yet. Your golden reputation starts here!</p>
    </div>
  );

  return (
    <div className="reviews-wrapper gold-theme">
      <SectionTitle
        icon={FaCrown}
        title="Royal Review Manager"
        description="Exceptional feedback from your valued guests."
      />

      <div className="reviews-container">
        {reviews.map((review) => {
          const reviewPhoto = review.photo
            ? `${BACKEND_BASE_URL}${review.photo.replace(/\\/g, '/')}`
            : null;

          return (
            <div key={review._id} className="review-card">
              <FaQuoteLeft className="quote-icon-gold" />
              
              <div className="review-header">
                <div className="user-info">
                  <h4 className="user-name-gold">
                    {review.user?.name || "Anonymous Guest"} 
                  </h4>
                  <p className="room-label-gold">
                    Stayed at: <span>{review.dogStay?.roomName}</span>
                  </p>
                  {review.dogStay?.address && (
                    <p className="room-address-gold">{review.dogStay.address}</p>
                  )}
                </div>

                <div className="star-rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={i < review.rating ? "star-gold-active" : "star-gold-inactive"} 
                    />
                  ))}
                </div>
              </div>

              <div className="review-body">
                <p className="review-text-gold">{review.reviewText}</p>
                
                {reviewPhoto && (
                  <div className="photo-gallery">
                    <img
                      src={reviewPhoto}
                      alt="Review snapshot"
                      className="review-image-gold"
                    />
                  </div>
                )}
              </div>

              {/* Host Response Section */}
              {review.hostResponse && (
                <div className="host-response-box">
                  <h5 className="response-title">Your Response:</h5>
                  <p>{review.hostResponse.text}</p>
                </div>
              )}

              {/* Response Input Form */}
              {activeReviewId === review._id && (
                <div className="response-input-area">
                  <textarea 
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Write a royal thank you..."
                    className="gold-textarea"
                  />
                  <div className="btn-group">
                    <button className="gold-save-btn" onClick={() => submitResponse(review._id)}>Submit</button>
                    <button className="gold-cancel-btn" onClick={() => setActiveReviewId(null)}>Cancel</button>
                  </div>
                </div>
              )}

              <div className="review-footer">
                <span className="review-date-gold">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>

<button
  className="respond-btn-gold"
  disabled={activeReviewId === review._id}
  onClick={() => {
    setActiveReviewId(review._id);
    setResponseText(review.hostResponse?.text || "");
  }}
>
  <FaEdit />
  <span>{review.hostResponse ? "Edit Response" : "Respond"}</span>
</button>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewsSection;