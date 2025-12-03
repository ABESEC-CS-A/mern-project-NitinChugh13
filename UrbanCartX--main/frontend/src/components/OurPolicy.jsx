// src/pages/OurPolicy.jsx
import React, { useState } from "react";
import { FiTruck, FiRefreshCw, FiShield, FiLock, FiPhone, FiMail } from "react-icons/fi";
import { RiCustomerService2Fill } from "react-icons/ri";
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi";

/**
 * OurPolicy.jsx
 * - Dark-theme friendly
 * - Responsive
 * - Accordion for FAQs / sections
 * - Simple contact CTA and quick links
 */

const PolicyBadge = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4 p-4 bg-[#071219]/50 border border-[#ffffff12] rounded-lg">
    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#082028] text-teal-300 text-xl">
      {icon}
    </div>
    <div>
      <div className="text-teal-100 font-semibold">{title}</div>
      <div className="mt-1 text-slate-300 text-sm leading-relaxed">{desc}</div>
    </div>
  </div>
);

const AccordionItem = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  return (
    <div className="border border-[#ffffff10] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left bg-transparent"
        aria-expanded={open}
      >
        <div className="text-left">
          <div className="text-base font-medium text-slate-100">{title}</div>
        </div>
        <div className="text-teal-200">
          {open ? <HiOutlineChevronUp className="w-5 h-5" /> : <HiOutlineChevronDown className="w-5 h-5" />}
        </div>
      </button>

      <div
        className={`px-4 pb-4 pt-0 transition-all duration-200 ${open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
      >
        <div className="text-slate-300 text-sm leading-relaxed pt-3">{children}</div>
      </div>
    </div>
  );
};

export default function OurPolicy() {
  return (
    <main className="pt-28 pb-12 min-h-screen px-4 sm:px-8 bg-gradient-to-b from-[#071014] via-[#07181a] to-[#08171a]">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-teal-100 tracking-tight">
            Our Policies
          </h1>
          <p className="mt-3 text-slate-300">
            Clear, customer-first policies — shipping, returns, payments, and privacy. If anything is unclear, contact our support anytime.
          </p>
        </header>

        {/* BADGES */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <PolicyBadge
            icon={<FiTruck className="w-6 h-6" />}
            title="Fast & Reliable Shipping"
            desc="Standard, express and next-day delivery options. Track your order with live updates and SMS notifications."
          />
          <PolicyBadge
            icon={<FiRefreshCw className="w-6 h-6" />}
            title="Hassle-free Returns"
            desc="30-day easy returns on most items. Initiate returns from your Orders page and get fast refunds or replacements."
          />
          <PolicyBadge
            icon={<FiShield className="w-6 h-6" />}
            title="Buyer Protection"
            desc="All purchases are protected — receive a refund if the item you receive is damaged or significantly different from the listing."
          />
          <PolicyBadge
            icon={<FiLock className="w-6 h-6" />}
            title="Secure Payments"
            desc="We use industry-standard encryption & trusted payment gateways for secure card and UPI transactions."
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: detailed policies / accordions */}
          <div className="lg:col-span-2 space-y-4">
            <AccordionItem title="Shipping Policy" defaultOpen>
              <p>
                Orders are typically processed within 24–48 hours (business days). Shipping options:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li><strong>Standard Delivery</strong> — 4–7 business days (affordable & reliable).</li>
                <li><strong>Express Delivery</strong> — 1–3 business days (faster, higher fee).</li>
                <li><strong>Next Day</strong> — available in select cities for eligible items.</li>
              </ul>

              <p className="mt-3">
                Tracking: After dispatch, you'll receive email/SMS with tracking ID. If tracking is delayed, contact support.
              </p>

              <p className="mt-3 text-sm text-slate-400">
                Note: Delivery timelines may be affected by holidays or remote locations. For large or heavy items, additional handling time may apply.
              </p>
            </AccordionItem>

            <AccordionItem title="Returns & Refunds">
              <p>
                We offer a 30-day return window on most products from the delivery date. To be eligible:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li>Item must be unused, with original tags & packaging.</li>
                <li>Return request should be raised within 30 days via the Orders page.</li>
                <li>Proof of purchase (order ID) required.</li>
              </ul>

              <p className="mt-3">
                Refund timeline: After we receive and inspect the return, refunds are processed within 3–7 business days. Payment method refunds may take additional bank processing time.
              </p>
            </AccordionItem>

            <AccordionItem title="Payment & Pricing">
              <p>
                We accept major credit/debit cards, netbanking, UPI and trusted wallets. Prices displayed include applicable taxes unless stated otherwise.
              </p>

              <p className="mt-3">
                Promotions and coupon codes are applied at checkout. In case of discrepancies or price errors, we reserve the right to cancel the order and notify the customer.
              </p>
            </AccordionItem>

            <AccordionItem title="Privacy & Data Protection">
              <p>
                We take your privacy seriously. Personal data is processed to fulfill orders, provide support, and to improve our services.
              </p>

              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li>Payment information is handled by PCI-compliant payment providers.</li>
                <li>We will never sell your personal data to third parties.</li>
                <li>You may request deletion of your account data by contacting support (subject to legal record-keeping requirements).</li>
              </ul>

              <p className="mt-3 text-sm text-slate-400">
                For full details, see our Privacy Policy (linkable page).
              </p>
            </AccordionItem>

            <AccordionItem title="Security & Fraud Prevention">
              <p>
                We employ encryption, monitoring and verification to protect customers. Orders flagged for suspicious activity may be held for manual review.
              </p>
              <p className="mt-3">
                If you notice unauthorized charges, contact your bank immediately and then our support team so we can assist.
              </p>
            </AccordionItem>

            <AccordionItem title="Terms of Use & Liability">
              <p>
                By using our platform you agree to our Terms of Service. We limit liability for indirect or consequential losses. For warranty and product-specific guarantees, refer to item descriptions or manufacturer documentation.
              </p>
            </AccordionItem>

            <AccordionItem title="Frequently Asked Questions (FAQs)">
              <div className="space-y-3">
                <div>
                  <strong>Q: How do I track my order?</strong>
                  <div className="mt-1 text-slate-300">A: Use the tracking link in your order confirmation email or the Orders page in your account.</div>
                </div>

                <div>
                  <strong>Q: Can I cancel my order?</strong>
                  <div className="mt-1 text-slate-300">A: Orders can typically be cancelled within 1–2 hours of placement. If already shipped, please initiate a return after delivery.</div>
                </div>

                <div>
                  <strong>Q: What if my item is damaged?</strong>
                  <div className="mt-1 text-slate-300">A: Report damage immediately using the Returns process — we’ll prioritize replacements or refunds.</div>
                </div>
              </div>
            </AccordionItem>
          </div>

          {/* RIGHT: contact + quick links */}
          <aside className="space-y-4">
            <div className="sticky top-36">
              <div className="bg-[#07171a] border border-[#ffffff12] rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <div className="text-2xl text-teal-300">
                    <RiCustomerService2Fill />
                  </div>
                  <div>
                    <div className="text-slate-100 font-semibold">Need help?</div>
                    <div className="text-slate-300 text-sm mt-1">Our support is here 7 days a week</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3">
                  <a href="tel:1800123456" className="flex items-center gap-2 px-3 py-2 bg-[#071a1d] rounded-md">
                    <FiPhone className="w-5 h-5 text-teal-200" />
                    <div>
                      <div className="text-sm text-slate-100">Call us</div>
                      <div className="text-xs text-slate-300">1800-123-456</div>
                    </div>
                  </a>

                  <a href="mailto:support@urbancartx.example" className="flex items-center gap-2 px-3 py-2 bg-[#071a1d] rounded-md">
                    <FiMail className="w-5 h-5 text-teal-200" />
                    <div>
                      <div className="text-sm text-slate-100">Email</div>
                      <div className="text-xs text-slate-300">support@urbancartx.example</div>
                    </div>
                  </a>

                  <a href="/contact" className="flex items-center gap-2 px-3 py-2 rounded-md border border-[#ffffff12] text-teal-100 justify-center">
                    Contact Form
                  </a>
                </div>
              </div>

              <div className="mt-4 bg-[#07171a] border border-[#ffffff12] rounded-lg p-4">
                <div className="text-sm text-slate-300 mb-3 font-semibold">Quick Links</div>
                <ul className="text-slate-300 text-sm space-y-2">
                  <li><a href="/returns" className="hover:underline">Returns & Refunds</a></li>
                  <li><a href="/shipping" className="hover:underline">Shipping Info</a></li>
                  <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:underline">Terms & Conditions</a></li>
                </ul>
              </div>

              <div className="mt-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-black rounded-lg p-4">
                <div className="text-sm font-semibold">Pro Tip</div>
                <div className="text-xs mt-1">
                  Sign up for SMS alerts to receive shipping & deal notifications. Free returns on orders above ₹2000.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

