// src/pages/About.jsx
import React from "react";
import { FiTruck, FiShield, FiPhoneCall, FiStar } from "react-icons/fi";
import { AiOutlineShopping } from "react-icons/ai";
import newone from "../assets/newone.jpg";


export default function About() {
  return (
    <main className="pt-28 pb-16 min-h-screen bg-gradient-to-b from-[white]  text-black to-[#001a26]">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="rounded-2xl bg-black border border-black p-10 text-center backdrop-blur">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-teal-100 tracking-tight">
            About UrbanCartX
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            Your one-stop destination for premium quality products, fast delivery, and
            an unbeatable shopping experience — built with passion, precision, and
            customer-first values.
          </p>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="mt-16 max-w-6xl mx-auto px-4 sm:px-8 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold text-shadow-black mb-4">Our Story</h2>
          <p className="text-black leading-relaxed">
            UrbanCartX was born with a simple mission: make online shopping effortless,
            trustworthy, and enjoyable. Starting as a small idea in a college dorm, we’ve
            grown into one of the most loved modern e-commerce platforms by focusing on
            one thing — <span className="text-black font-semibold">customer satisfaction</span>.
          </p>

          <p className="mt-4 text-black leading-relaxed">
            Our vision isn’t just to sell products. It’s to build an online shopping
            experience that feels premium, personalized, and lightning fast —
            for every single user.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-[#ffffff12] shadow-lg">
          <img
            src="https://media.licdn.com/dms/image/v2/D5622AQFybgiUUBc5pA/feedshare-shrink_800/B56ZUV3JXuGoAk-/0/1739828533950?e=2147483647&v=beta&t=DuB4AEiWRpNYMmLJGNWGmkIPR6xzYlnSLQ2PPFVPHsI"
            alt="Our Mission"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* STATISTICS */}
      <section className="mt-20 max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { label: "Orders Delivered", value: "50K+", icon: <AiOutlineShopping /> },
            { label: "Happy Customers", value: "30K+", icon: <FiStar /> },
            { label: "Products Available", value: "10K+", icon: <FiShield /> },
            { label: "Cities Served", value: "120+", icon: <FiTruck /> },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#0b2230]/60 border border-[#ffffff14] rounded-xl p-6 flex flex-col items-center gap-3 shadow-lg"
            >
              <div className="text-3xl text-teal-300">{stat.icon}</div>
              <div className="text-2xl font-bold text-teal-100">{stat.value}</div>
              <div className="text-sm text-slate-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="mt-20 max-w-6xl mx-auto px-4 sm:px-8">
        <h2 className="text-3xl font-bold text-teal-100 mb-8 text-center">
          Why Choose UrbanCartX?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-[#0b2230]/50 rounded-xl border border-[#ffffff12] shadow hover:shadow-teal-500/20 transition">
            <FiTruck className="text-3xl text-teal-300 mb-3" />
            <h3 className="text-lg font-semibold text-teal-100 mb-1">Fast Delivery</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Lightning-fast shipping with live tracking & priority handling.
            </p>
          </div>

          <div className="p-6 bg-[#0b2230]/50 rounded-xl border border-[#ffffff12] shadow hover:shadow-teal-500/20 transition">
            <FiShield className="text-3xl text-teal-300 mb-3" />
            <h3 className="text-lg font-semibold text-teal-100 mb-1">Secure Shopping</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              PCI-compliant payments, safe checkout, and encrypted data protection.
            </p>
          </div>

          <div className="p-6 bg-[#0b2230]/50 rounded-xl border border-[#ffffff12] shadow hover:shadow-teal-500/20 transition">
            <FiPhoneCall className="text-3xl text-teal-300 mb-3" />
            <h3 className="text-lg font-semibold text-teal-100 mb-1">24/7 Support</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Our friendly support team is always here to help — anytime, anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="mt-20 max-w-5xl mx-auto px-4 sm:px-8">
        <h2 className="text-3xl font-bold text-teal-100 mb-10 text-center">Meet the Team</h2>

       <div className="flex justify-center">
          {[
  { 
    name: "Nitin Chugh", 
    role: <>Founder <br /> Full Stack Developer</>, 
    img: newone 
  }
].map((member, i) => (

            <div
              key={i}
              className="bg-[#0b2230]/50 rounded-xl p-6 border border-[#ffffff12] shadow hover:shadow-teal-500/20 transition text-center"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-28 h-28 rounded-full mx-auto border-2 border-teal-400 object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold text-teal-100">{member.name}</h3>
              <p className="text-sm text-slate-300">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="mt-24 text-center max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-teal-100">Join Our Journey</h2>
        <p className="mt-3 text-slate-300">
          Become part of a community that values quality, speed, and exceptional shopping experiences.
        </p>

        <button className="mt-6 px-6 py-3 bg-teal-500 text-black font-semibold rounded-lg hover:brightness-90 shadow-lg">
          Shop Now
        </button>
      </section>
    </main>
  );
}

