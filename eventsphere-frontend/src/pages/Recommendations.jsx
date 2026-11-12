import { useState } from "react";
import "./Recommendations.css";

function Recommendations() {
  const interests = [
    "Technology",
    "AI & Machine Learning",
    "Startups",
    "Business",
    "Design",
    "Cybersecurity",
  ];

  const [selectedInterests, setSelectedInterests] = useState([
    "Technology",
    "AI & Machine Learning",
  ]);

  const [showRecommendations, setShowRecommendations] = useState(false);

  const events = [
    {
      id: 1,
      title: "AI and Machine Learning Conference",
      category: "AI & Machine Learning",
      date: "December 15, 2026",
      location: "Coimbatore",
      price: "₹399",
      reason: "Matches your interest in AI and Machine Learning.",
    },
    {
      id: 2,
      title: "Tech Innovation Summit 2026",
      category: "Technology",
      date: "November 15, 2026",
      location: "Coimbatore",
      price: "Free",
      reason: "Recommended based on your interest in Technology.",
    },
    {
      id: 3,
      title: "Startup Networking Meet",
      category: "Startups",
      date: "December 5, 2026",
      location: "Bangalore",
      price: "₹499",
      reason: "A good match for your professional interests.",
    },
  ];

  const handleInterestChange = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );

    setShowRecommendations(false);
  };

  const recommendedEvents = events.filter((event) =>
    selectedInterests.includes(event.category)
  );

  return (
    <div className="recommendations-page">
      <div className="recommendations-header">
        <span className="ai-label">✦ AI POWERED</span>
        <h1>Discover Events for You</h1>
        <p>
          Select your interests to discover events that match your preferences.
        </p>
      </div>

      <div className="interests-section">
        <h2>Select Your Interests</h2>

        <div className="interest-options">
          {interests.map((interest) => (
            <button
              key={interest}
              className={`interest-chip ${
                selectedInterests.includes(interest) ? "selected" : ""
              }`}
              onClick={() => handleInterestChange(interest)}
            >
              {selectedInterests.includes(interest) ? "✓ " : "+ "}
              {interest}
            </button>
          ))}
        </div>

        <button
          className="recommend-btn"
          onClick={() => setShowRecommendations(true)}
          disabled={selectedInterests.length === 0}
        >
          Get My Recommendations
        </button>
      </div>

      {showRecommendations && (
        <div className="recommended-section">
          <h2>Recommended Events for You</h2>

          {recommendedEvents.length > 0 ? (
            <div className="recommended-grid">
              {recommendedEvents.map((event) => (
                <div className="recommended-card" key={event.id}>
                  <span className="match-label">✦ Recommended</span>

                  <h3>{event.title}</h3>
                  <p>{event.category}</p>
                  <p>📅 {event.date}</p>
                  <p>📍 {event.location}</p>

                  <h3 className="recommended-price">{event.price}</h3>

                  <div className="recommendation-reason">
                    <strong>Why this event?</strong>
                    <p>{event.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-recommendations">
              No matching events found. Try selecting different interests.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Recommendations;