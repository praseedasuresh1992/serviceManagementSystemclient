import React from "react";

const AboutUs = () => {
  return (
    <div className="w-full">

      {/* ===== HERO ===== */}
      <section className="bg-gray-900 py-20 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            About Us
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            A modern platform designed to simplify service management,
            bookings, and provider coordination.
          </p>
        </div>
      </section>

      {/* ===== CONTENT ===== */}
      <section className="py-16 bg-lime-300">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">

            {/* LEFT */}
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 mb-3">
                ServicelQ was built to bridge the gap between customers and
                service providers by offering a reliable, transparent,
                and easy-to-use platform.
              </p>
              <p className="text-gray-600">
                We empower businesses to manage bookings, availability,
                and customer interactions efficiently while giving users
                a seamless service experience.
              </p>
            </div>

            {/* RIGHT */}
            <div className="bg-gray-100 p-6 rounded-xl shadow-sm">
              <h4 className="font-bold text-lg mb-3">
                Why ServicelQ?
              </h4>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Centralized service management</li>
                <li>Easy booking & scheduling</li>
                <li>Secure payments</li>
                <li>Role-based dashboards</li>
                <li>Scalable for growing businesses</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;