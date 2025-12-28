import React from "react";

const ContactUs = () => {
  return (
    <div className="w-full">

      {/* ===== HERO ===== */}
      <section className="bg-dark text-white py-20 text-center">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact <span className="text-green-400">Us</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Have questions or need support? We’re here to help.
          </p>
        </div>
      </section>

      {/* ===== CONTACT CONTENT ===== */}
      <section className="py-16 bg-gray-100">
        <div className="container">
          <div className="row g-5">

            {/* Contact Info */}
            <div className="col-md-5">
              <div className="bg-white p-5 rounded-lg shadow-sm h-100">
                <h4 className="fw-bold mb-4">Get in Touch</h4>

                <p className="text-muted mb-3">
                  <strong>Email:</strong> support@servicelq.com
                </p>
                <p className="text-muted mb-3">
                  <strong>Phone:</strong> +91 98765 43210
                </p>
                <p className="text-muted">
                  <strong>Address:</strong><br />
                  ServicelQ Technologies<br />
                  India
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-md-7">
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h4 className="fw-bold mb-4">Send us a Message</h4>

                <form>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Name"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Your Email"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Your Message"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success px-4 rounded-pill"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactUs;
