import React from "react";

const Home = () => {
  return (
    <div className="w-full overflow-x-hidden">

      {/* ================= HERO SECTION ================= */}
      <section
        style={{
          backgroundImage: "url('/backGroundImage.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          height: "100vh",
        }}
        className="relative flex items-center pt-20"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>

        <div className="container-fluid relative z-10 text-center text-white px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-3 pt-5">
              Welcome to <span className="text-green-400">ServicelQ</span>
            </h1>

            <p className="text-lg md:text-xl mb-8  text-gray-200">
              A modern service management system to handle bookings,
              providers, and services efficiently.
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <a
                href="/login"
                className="btn btn-success btn-lg rounded-pill px-5"
              >
                Get Started
              </a>

              <a
                href="/userregistration"
                className="btn btn-outline-light btn-lg rounded-pill px-5"
              >
                Register
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-16 bg-gray-100">
        <div className="container">
          <h2 className="text-center pt-5 text-3xl font-bold mb-12">
            Why Choose <span className="text-green-500">ServicelQ</span>?
          </h2>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <h5 className="fw-bold mb-3">Easy Booking</h5>
                <p className="text-muted pt-4">
                  Book services instantly with real-time availability.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <h5 className="fw-bold mb-3">Provider Management</h5>
                <p className="text-muted">
                  Manage providers, schedules, and requests in one dashboard.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <h5 className="fw-bold mb-3">Secure Payments</h5>
                <p className="text-muted pt-4">
                  Safe and seamless payment integration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-center text-3xl pt-5 pb-5 font-bold mb-10">
            Frequently Asked Questions
          </h2>

          <div className="accordion" id="faqAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faq1"
                >
                  What is ServicelQ?
                </button>
              </h2>
              <div id="faq1" className="accordion-collapse collapse show">
                <div className="accordion-body">
                  ServicelQ is a service management platform for handling bookings,
                  providers, and customers efficiently.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#faq2"
                >
                  Is it free to use?
                </button>
              </h2>
              <div id="faq2" className="accordion-collapse collapse">
                <div className="accordion-body">
                  Yes, basic features are free. Advanced features can be added later.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#faq3"
                >
                  Can providers manage availability?
                </button>
              </h2>
              <div id="faq3" className="accordion-collapse collapse">
                <div className="accordion-body">
                  Yes, providers can create and manage their availability easily.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
