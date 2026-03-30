import React, { useState } from "react";

const Home = () => {
  const [open, setOpen] = useState(0);

  const toggle = (index) => {
    setOpen(open === index ? null : index);
  };

  return (
    <div className="w-full overflow-x-hidden">

      {/* ================= HERO ================= */}
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>

        <div className="relative z-10 text-center text-white px-4 w-full">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-3 pt-5">
              Welcome to <span className="text-green-400">ServicelQ</span>
            </h1>

            <p className="text-lg md:text-xl mb-8 text-green-600">
              A modern service management system to handle bookings,
              providers, and services efficiently.
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <a
                href="/login"
                className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-full text-white font-medium transition"
              >
                Get Started
              </a>

              <a
                href="/userregistration"
                className="border border-white px-6 py-3 rounded-full text-white hover:bg-white hover:text-black transition"
              >
                Register
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* ================= FEATURES ================= */}
      <section className="py-16 bg-lime-300">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-center text-3xl font-bold mb-12">
            Why Choose <span className="text-green-900">ServicelQ</span>?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-xl shadow-sm text-center p-6">
              <h5 className="font-bold mb-3">Easy Booking</h5>
              <p className="text-gray-600">
                Book services instantly with real-time availability.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm text-center p-6">
              <h5 className="font-bold mb-3">Provider Management</h5>
              <p className="text-gray-600">
                Manage providers, schedules, and requests in one dashboard.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm text-center p-6">
              <h5 className="font-bold mb-3">Secure Payments</h5>
              <p className="text-gray-600">
                Safe and seamless payment integration.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="py-16 bg-lime-300">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-center text-3xl font-bold mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">

            {/* FAQ 1 */}
            <div className="border rounded-lg bg-green-100">
              <button
                onClick={() => toggle(1)}
                className="w-full text-left px-4 py-3 font-medium flex justify-between"
              >
                What is ServicelQ?
                <span>{open === 1 ? "-" : "+"}</span>
              </button>
              {open === 1 && (
                <div className="px-4 pb-3 text-gray-600">
                  ServicelQ is a service management platform for handling bookings,
                  providers, and customers efficiently.
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="border rounded-lg bg-green-100">
              <button
                onClick={() => toggle(2)}
                className="w-full text-left px-4 py-3 font-medium flex justify-between"
              >
                Is it free to use?
                <span>{open === 2 ? "-" : "+"}</span>
              </button>
              {open === 2 && (
                <div className="px-4 pb-3 text-gray-600">
                  Yes, basic features are free. Advanced features can be added later.
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="border rounded-lg bg-green-100">
              <button
                onClick={() => toggle(3)}
                className="w-full text-left px-4 py-3 font-medium flex justify-between"
              >
                Can providers manage availability?
                <span>{open === 3 ? "-" : "+"}</span>
              </button>
              {open === 3 && (
                <div className="px-4 pb-3 text-gray-600">
                  Yes, providers can create and manage their availability easily.
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;