import React, { useState } from "react";
import hospitalLogo from "../components/png/hospital-appointment.png";
import "../index.css";

function Profile() {
  const [activeTab, setActiveTab] = useState("appointments");

  const handleTabClick = (tab: "appointments" | "pastAppointments") => {
    setActiveTab(tab);
  };

  return (
    <div className="container">
      <div className="row mt-6">
        <div className="col-4">
          <div className="row">
            <div className="col-3">
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  height: "10vh",
                  marginBottom: "15px",
                }}
              >
                <img
                  src={hospitalLogo}
                  alt="Hospital Appointment System"
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#f0f4f8",
                    borderRadius: "50%",
                    marginTop: "20px",
                  }}
                />
              </div>
            </div>

            <div className="col-4">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "10vh",
                  marginBottom: "15px",
                }}
              >
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
            <div className="col-4"></div>
          </div>
        </div>

        <div
          className="col-4 mt-2"
          style={{
            backgroundColor: "#f0f4f8",
            marginLeft: "60px",
            display: "flex",
            justifyContent: "center",
            width: "300px",
            padding: "8px",
            height: "6vh",
            borderRadius: "10px",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.3)", // Hafif gölge efekti
          }}
        >
          <div
            role="tab"
            aria-disabled="false"
            aria-selected={activeTab === "appointments" ? "true" : "false"}
            className={`ant-tabs-tab ${
              activeTab === "appointments" ? "ant-tabs-tab-active" : ""
            }`}
            onClick={() => handleTabClick("appointments")}
            style={{
              backgroundColor: "#d9e2ec",
              borderRadius: "8px",
              marginRight: "30px",
              cursor: "pointer",
            }}
          >
            Randevularım
          </div>
          <div
            role="tab"
            aria-disabled="false"
            aria-selected={activeTab === "pastAppointments" ? "true" : "false"}
            className={`ant-tabs-tab ${
              activeTab === "pastAppointments" ? "ant-tabs-tab-active" : ""
            }`}
            onClick={() => handleTabClick("pastAppointments")}
            style={{
              backgroundColor: "#d9e2ec",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Geçmiş Randevularım
          </div>
        </div>
        <div className="col-1">
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