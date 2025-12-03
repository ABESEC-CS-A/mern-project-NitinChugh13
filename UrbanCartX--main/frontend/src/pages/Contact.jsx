import React from "react";
import { FiMail, FiPhone, FiMapPin, FiMessageSquare } from "react-icons/fi";

export default function Contact() {
  return (
    <main className="pt-28 pb-16 min-h-screen bg-gradient-to-b  from-[white]  text-black to-[#001a26] text-slate-200">
      {/* Page Header */}
      <section className="text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-black">
          Contact Us
        </h1>
        <p className="mt-3 max-w-xl mx-auto text-black text-sm sm:text-base">
          Have a question or need support? We’re here to help you 24/7.
        </p>
      </section>

      {/* Contact Cards */}
      <section className="mt-14 max-w-6xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Email */}
        <div className="bg-black backdrop-blur border border-black rounded-xl p-6 text-center shadow hover:shadow-teal-500/20 transition">
          <FiMail className="text-3xl text-teal-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-teal-100">Email Us</h3>
          <p className="text-sm text-slate-300 mt-1">
            support@urbancartx.com
          </p>
        </div>

        {/* Phone */}
        <div className="bg-black backdrop-blur border border-black rounded-xl p-6 text-center shadow hover:shadow-teal-500/20 transition">
          <FiPhone className="text-3xl text-teal-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-teal-100">Call Us</h3>
          <p className="text-sm text-slate-300 mt-1">+91 98765 43210</p>
        </div>

        {/* WhatsApp */}
        <div className="bg-black backdrop-blur border border-black rounded-xl p-6 text-center shadow hover:shadow-teal-500/20 transition">
          <FiMessageSquare className="text-3xl text-teal-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-teal-100">WhatsApp</h3>
          <p className="text-sm text-slate-300 mt-1">+91 98765 12345</p>
        </div>
      </section>

      {/* Two Column Layout */}
      <section className="mt-20 max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-[#0b2230]/60 backdrop-blur border border-[#ffffff12] rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-teal-100 mb-6">Send Us a Message</h2>

          <form className="space-y-6">
            <div>
              <label className="text-sm text-slate-300">Full Name</label>
              <input
                type="text"
                className="w-full mt-1 p-3 rounded-lg bg-[#07181a] border border-[#ffffff14] text-slate-100 focus:ring-2 focus:ring-teal-400 outline-none"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Email Address</label>
              <input
                type="email"
                className="w-full mt-1 p-3 rounded-lg bg-[#07181a] border border-[#ffffff14] text-slate-100 focus:ring-2 focus:ring-teal-400 outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Message</label>
              <textarea
                className="w-full mt-1 p-3 h-32 rounded-lg bg-[#07181a] border border-[#ffffff14] text-slate-100 resize-none focus:ring-2 focus:ring-teal-400 outline-none"
                placeholder="Write your message..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-500 text-black font-semibold rounded-lg hover:brightness-90 transition shadow-md"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Address + Map */}
        <div className="space-y-8">
          <div className="bg-[#0b2230]/60 backdrop-blur border border-[#ffffff12] rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-teal-100 mb-4">Our Office</h2>

            <div className="flex gap-3 items-start">
              <FiMapPin className="text-3xl text-teal-300 mt-1" />
              <p className="text-slate-300 leading-relaxed">
                UrbanCartX Headquarters  
                <br /> 221B Tech Street  
                <br /> New Delhi, Delhi – 110051 
                <br /> India
              </p>
            </div>
          </div>


        </div>
      </section>
    </main>
  );
}

