import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://skillswap-backend-fte2.onrender.com";

function App() {
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  // Booking states
  const [selectedGig, setSelectedGig] = useState(null);
  const [clientName, setClientName] = useState("");
  const [clientMessage, setClientMessage] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookings, setBookings] = useState([]);

  // Post Gig states
  const [gigTitle, setGigTitle] = useState("");
  const [gigCategory, setGigCategory] = useState("");
  const [gigRate, setGigRate] = useState("");
  const [gigDescription, setGigDescription] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [postMessage, setPostMessage] = useState("");

  // Load gigs
  const fetchGigs = async () => {
    try {
      const response = await fetch(
        `${API_URL}/gigs?search=${encodeURIComponent(
          search
        )}&category=${encodeURIComponent(category)}`
      );

      const data = await response.json();
      setGigs(data);
    } catch (error) {
      console.error("Error loading gigs:", error);
    }
  };

  // Load bookings
  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_URL}/bookings`);

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error loading bookings:", error);
    }
  };

  useEffect(() => {
    fetchGigs();
    fetchBookings();
  }, [search, category]);

  // Open booking form
  const openBookingForm = (gig) => {
    setSelectedGig(gig);
    setBookingMessage("");
    setClientName("");
    setClientMessage("");
  };

  // Close booking form
  const closeBookingForm = () => {
    setSelectedGig(null);
    setClientName("");
    setClientMessage("");
    setBookingMessage("");
  };

  // Submit booking
  const submitBooking = async () => {
    if (!clientName.trim()) {
      setBookingMessage("Please enter your name.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gig_id: selectedGig.id,
          client_name: clientName,
          client_message: clientMessage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBookingMessage("Booking submitted successfully!");
        fetchBookings();
      } else {
        setBookingMessage(data.message || "Booking failed.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      setBookingMessage("Could not connect to the server.");
    }
  };

  // Accept or decline booking
  const updateBookingStatus = async (bookingId, status) => {
    try {
      const response = await fetch(
        `${API_URL}/bookings/${bookingId}/status?status=${status}`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (response.ok) {
        fetchBookings();
      } else {
        alert(data.error || "Failed to update booking.");
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("Could not connect to the server.");
    }
  };

  // Submit new gig
  const submitGig = async () => {
    if (
      !gigTitle.trim() ||
      !gigCategory ||
      !gigRate ||
      !gigDescription.trim() ||
      !creatorName.trim()
    ) {
      setPostMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/gigs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: gigTitle,
          category: gigCategory,
          rate: Number(gigRate),
          description: gigDescription,
          creator_name: creatorName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPostMessage("Gig posted successfully!");

        setGigTitle("");
        setGigCategory("");
        setGigRate("");
        setGigDescription("");
        setCreatorName("");

        fetchGigs();
      } else {
        setPostMessage(data.message || "Failed to post gig.");
      }
    } catch (error) {
      console.error("Post gig error:", error);
      setPostMessage("Could not connect to the server.");
    }
  };

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">SkillSwap</div>

        <div className="nav-links">
          <a href="#marketplace">Marketplace</a>
          <a href="#post">Post a Gig</a>
          <a href="#bookings">My Bookings</a>
          <a href="#dashboard">Dashboard</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section">
        <div>
          <p className="eyebrow">SKILLS. SERVICES. CONNECTIONS.</p>

          <h1>
            Find the skills
            <br />
            <span>you need.</span>
          </h1>

          <p className="hero-text">
            Discover talented creators and book their services in one simple
            marketplace.
          </p>

          <a href="#marketplace" className="hero-button">
            Explore Gigs
          </a>
        </div>
      </section>

      {/* Marketplace */}
      <section id="marketplace" className="marketplace">

        <div className="section-heading">
          <div>
            <p className="eyebrow">MARKETPLACE</p>
            <h2>Explore Gigs</h2>
          </div>

          <p className="gig-count">
            {gigs.length} {gigs.length === 1 ? "gig" : "gigs"} available
          </p>
        </div>

        {/* Search + Filter */}
        <div className="filters">
          <input
            type="text"
            placeholder="Search for a skill or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Design">Design</option>
            <option value="Programming">Programming</option>
            <option value="Writing">Writing</option>
            <option value="Marketing">Marketing</option>
            <option value="Video">Video</option>
            <option value="Tutoring">Tutoring</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Gig Cards */}
        <div className="gig-grid">
          {gigs.length === 0 ? (
            <div className="empty-state">
              <h3>No gigs found</h3>
              <p>Try another search or category.</p>
            </div>
          ) : (
            gigs.map((gig) => (
              <div className="gig-card" key={gig.id}>

                <div className="card-top">
                  <span className="category">{gig.category}</span>
                  <span className="gig-id">#{gig.id}</span>
                </div>

                <h3>{gig.title}</h3>

                <p className="description">
                  {gig.description}
                </p>

                <div className="creator">
                  <div className="avatar">
                    {gig.creator_name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <small>CREATOR</small>
                    <p>{gig.creator_name}</p>
                  </div>
                </div>

                <div className="card-bottom">
                  <div>
                    <small>RATE</small>
                    <strong>₹{gig.rate}</strong>
                  </div>

                  <button onClick={() => openBookingForm(gig)}>
                    View & Book
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Booking Form */}
        {selectedGig && (
          <div className="booking-form">

            <h2>Book This Gig</h2>

            <p>
              You are booking <strong>{selectedGig.title}</strong> from{" "}
              <strong>{selectedGig.creator_name}</strong>.
            </p>

            <input
              type="text"
              placeholder="Your name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />

            <textarea
              placeholder="Tell the creator what you need..."
              value={clientMessage}
              onChange={(e) => setClientMessage(e.target.value)}
              rows="5"
            />

            <div className="booking-actions">
              <button onClick={closeBookingForm}>
                Cancel
              </button>

              <button onClick={submitBooking}>
                Confirm Booking
              </button>
            </div>

            {bookingMessage && (
              <p className="booking-message">
                {bookingMessage}
              </p>
            )}

          </div>
        )}

      </section>

      {/* My Bookings */}
      <section id="bookings" className="bookings-section">

        <div className="bookings-container">

          <div className="bookings-heading">
            <p className="eyebrow">YOUR ACTIVITY</p>

            <h2>My Bookings</h2>

            <p>
              Track the services you have requested and their current status.
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="no-bookings">
              <h3>No bookings yet</h3>
              <p>Your bookings will appear here.</p>
            </div>
          ) : (
            <div className="bookings-list">

              {bookings.map((booking) => (
                <div className="booking-card" key={booking.id}>

                  <div>
                    <span className="booking-label">
                      GIG
                    </span>

                    <h3>{booking.gig_title}</h3>

                    <p>
                      Creator:{" "}
                      <strong>{booking.creator_name}</strong>
                    </p>

                    <p>
                      Client:{" "}
                      <strong>{booking.client_name}</strong>
                    </p>
                  </div>

                  <div className="booking-status">

                    <span className="booking-label">
                      STATUS
                    </span>

                    <span
                      className={`status ${booking.status.toLowerCase()}`}
                    >
                      {booking.status}
                    </span>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </section>

      {/* Creator Dashboard */}
      <section id="dashboard" className="dashboard-section">

        <div className="dashboard-container">

          <div className="dashboard-heading">
            <p className="eyebrow">CREATOR SPACE</p>

            <h2>Creator Dashboard</h2>

            <p>
              Manage incoming booking requests for your gigs.
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="no-bookings">
              <h3>No booking requests</h3>
              <p>
                Incoming booking requests will appear here.
              </p>
            </div>
          ) : (
            <div className="dashboard-list">

              {bookings.map((booking) => (
                <div
                  className="dashboard-card"
                  key={booking.id}
                >

                  <div className="dashboard-info">

                    <span className="booking-label">
                      GIG
                    </span>

                    <h3>{booking.gig_title}</h3>

                    <p>
                      Client:{" "}
                      <strong>{booking.client_name}</strong>
                    </p>

                    <p>
                      Creator:{" "}
                      <strong>{booking.creator_name}</strong>
                    </p>

                    {booking.client_message && (
                      <p>
                        Message: {booking.client_message}
                      </p>
                    )}

                  </div>

                  <div className="dashboard-actions">

                    <span className="booking-label">
                      STATUS
                    </span>

                    <span
                      className={`status ${booking.status.toLowerCase()}`}
                    >
                      {booking.status}
                    </span>

                    {booking.status === "Pending" && (
                      <div className="dashboard-buttons">

                        <button
                          className="accept-button"
                          onClick={() =>
                            updateBookingStatus(
                              booking.id,
                              "Accepted"
                            )
                          }
                        >
                          Accept
                        </button>

                        <button
                          className="decline-button"
                          onClick={() =>
                            updateBookingStatus(
                              booking.id,
                              "Declined"
                            )
                          }
                        >
                          Decline
                        </button>

                      </div>
                    )}

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </section>

      {/* Post a Gig */}
      <section id="post" className="post-section">

        <div className="post-container">

          <div className="post-heading">

            <p className="eyebrow">
              CREATOR SPACE
            </p>

            <h2>Post a Gig</h2>

            <p>
              Share your skill with the SkillSwap community and
              let others discover your service.
            </p>

          </div>

          <div className="post-form">

            <label>Gig Title</label>

            <input
              type="text"
              placeholder="e.g. I will design a professional logo"
              value={gigTitle}
              onChange={(e) => setGigTitle(e.target.value)}
            />

            <label>Category</label>

            <select
              value={gigCategory}
              onChange={(e) => setGigCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              <option value="Design">Design</option>
              <option value="Programming">Programming</option>
              <option value="Writing">Writing</option>
              <option value="Marketing">Marketing</option>
              <option value="Video">Video</option>
              <option value="Tutoring">Tutoring</option>
              <option value="Other">Other</option>
            </select>

            <label>Rate (₹)</label>

            <input
              type="number"
              placeholder="e.g. 500"
              value={gigRate}
              onChange={(e) => setGigRate(e.target.value)}
            />

            <label>Creator Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
            />

            <label>Description</label>

            <textarea
              rows="5"
              placeholder="Describe what you are offering..."
              value={gigDescription}
              onChange={(e) =>
                setGigDescription(e.target.value)
              }
            />

            <button
              className="post-button"
              onClick={submitGig}
            >
              Post Gig
            </button>

            {postMessage && (
              <p className="post-message">
                {postMessage}
              </p>
            )}

          </div>

        </div>

      </section>

    </div>
  );
}

export default App;