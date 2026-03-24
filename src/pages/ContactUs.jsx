import React from "react";

const ContactUs = () => {
  return (
    <div className="w-full">

      {/* ===== HERO ===== */}
      <section className="bg-gray-900 text-white py-20 text-center">
        <div className="max-w-6xl mx-auto px-4">
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
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-8">

            {/* Contact Info */}
            <div className="md:col-span-5">
              <div className="bg-white p-6 rounded-xl shadow-sm h-full">
                <h4 className="font-bold text-lg mb-4">Get in Touch</h4>

                <p className="text-gray-600 mb-3">
                  <strong>Email:</strong> support@servicelq.com
                </p>
                <p className="text-gray-600 mb-3">
                  <strong>Phone:</strong> +91 98765 43210
                </p>
                <p className="text-gray-600">
                  <strong>Address:</strong><br />
                  ServicelQ Technologies<br />
                  India
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-7">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="font-bold text-lg mb-4">
                  Send us a Message
                </h4>

                <form className="space-y-4">
                  
                  <div>
                    <label className="block mb-1 font-medium">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Message
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Your Message"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full transition"
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