import React, { useState } from "react";
import hospitalLogo from "../components/png/hospital-appointment.png";
import "../index.css";

function Profile() {
  const [activeTab, setActiveTab] = useState<"appointments" | "pastAppointments">("appointments");

  const handleTabClick = (tab: "appointments" | "pastAppointments") => {
    setActiveTab(tab);
  };

  return (
    <div className="container">
      <div className="row mt-6">
        <div className="col-4">
          <div className="row">
            <div className="col-3">
              <div className="logo-container">
                <img
                  src={hospitalLogo}
                  alt="Hospital Appointment System"
                  className="profile-logo"
                />
              </div>
            </div>

            <div className="col-4">
              <div className="search-container">
                <form className="d-flex search-form">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <button className="btn btn-outline-success" type="submit">
                    Search
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="col-4 mt-2 tab-container">
          <div
            role="tab"
            className={`tab ${activeTab === "appointments" ? "active" : ""}`}
            onClick={() => handleTabClick("appointments")}
          >
            Randevularım
          </div>
          <div
            role="tab"
            className={`tab ${activeTab === "pastAppointments" ? "active" : ""}`}
            onClick={() => handleTabClick("pastAppointments")}
          >
            Geçmiş Randevularım
          </div>
        </div>

        <div className="col-12 mt-4">
          {activeTab === "appointments" && (
            <div className="appointments-section">
              <p>aktif randevularım</p>
            </div>
          )}

          {activeTab === "pastAppointments" && (
            <div className="past-appointments-section">
              <p>geçmiş randevularım</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;