import React from "react";

const AboutUs = () => {
  return (
    <div className="w-full">

      {/* ===== HERO ===== */}
      <section className="bg-dark text-white py-20 text-center">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-green-400">ServicelQ</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            A modern platform designed to simplify service management,
            bookings, and provider coordination.
          </p>
        </div>
      </section>

      {/* ===== CONTENT ===== */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-md-6">
              <h2 className="text-3xl font-bold mb-4">
                Our Mission
              </h2>
              <p className="text-muted mb-3">
                ServicelQ was built to bridge the gap between customers and
                service providers by offering a reliable, transparent,
                and easy-to-use platform.
              </p>
              <p className="text-muted">
                We empower businesses to manage bookings, availability,
                and customer interactions efficiently while giving users
                a seamless service experience.
              </p>
            </div>

            <div className="col-md-6">
              <div className="bg-gray-100 p-5 rounded-lg shadow-sm">
                <h4 className="fw-bold mb-3">Why ServicelQ?</h4>
                <ul className="list-disc pl-4 text-muted space-y-2">
                  <li>Centralized service management</li>
                  <li>Easy booking & scheduling</li>
                  <li>Secure payments</li>
                  <li>Role-based dashboards</li>
                  <li>Scalable for growing businesses</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;
