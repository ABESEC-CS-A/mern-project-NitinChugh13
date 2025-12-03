// src/pages/BecomeaSeller.jsx
import React, { useState, useRef } from "react";

const CATEGORIES = [
  "Clothing",
  "Beauty & Personal Care",
  "Electronics",
  "Home & Living",
  "Footwear",
  "Sports & Outdoors",
  "Groceries",
  "Other",
];

export default function BecomeaSeller() {
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    category: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const fileInputRef = useRef(null);

  function validate() {
    const e = {};
    if (!form.businessName.trim()) e.businessName = "Business name is required";
    if (!form.ownerName.trim()) e.ownerName = "Owner / contact name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^[\d+\-\s()]{6,20}$/.test(form.phone)) e.phone = "Invalid phone number";
    if (!form.category) e.category = "Choose a category";
    if (!form.description.trim() || form.description.trim().length < 20)
      e.description = "Please describe your products (min 20 chars)";
    if (imageFile) {
      const allowed = ["image/png", "image/jpeg", "image/webp"];
      if (!allowed.includes(imageFile.type)) e.imageFile = "Upload PNG/JPEG/WEBP only";
      if (imageFile.size > 3 * 1024 * 1024) e.imageFile = "Image must be < 3MB";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleFileChange(e) {
    const f = e.target.files && e.target.files[0];
    setImageFile(null);
    setImagePreview(null);
    setErrors((s) => ({ ...s, imageFile: undefined }));
    if (!f) return;
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(f.type)) {
      setErrors((s) => ({ ...s, imageFile: "Only PNG/JPEG/WEBP allowed" }));
      return;
    }
    if (f.size > 3 * 1024 * 1024) {
      setErrors((s) => ({ ...s, imageFile: "Image must be smaller than 3MB" }));
      return;
    }
    setImageFile(f);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(f);
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setSuccessMsg("");
    setErrors({});
    if (!validate()) return;
    setBusy(true);

    const payload = {
      ...form,
      submittedAt: new Date().toISOString(),
      imageName: imageFile ? imageFile.name : null,
    };

    try {
      // keep your existing event-based submission (backend integration elsewhere)
      window.dispatchEvent(new CustomEvent("becomeSeller", { detail: { payload, file: imageFile } }));
      // small UX delay
      await new Promise((res) => setTimeout(res, 900));
      setSuccessMsg(
        "Thanks — your seller application has been submitted. We'll review and contact you at the provided email/phone."
      );
      setForm({
        businessName: "",
        ownerName: "",
        email: "",
        phone: "",
        category: "",
        description: "",
      });
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setErrors({});
    } catch (err) {
      console.error("submit error", err);
      setErrors((s) => ({ ...s, submit: "Could not submit. Try again later." }));
    } finally {
      setBusy(false);
    }
  }

  return (
    // IMPORTANT: pt-28 gives room for your fixed Nav — keep consistent across pages
    <div className="pt-28 pb-12 bg-gray-50 min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-6xl">
        {/* Hero */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Become a Seller</h1>
          <p className="mt-1 text-sm text-slate-600 max-w-3xl">
            Join our marketplace to reach customers across the region. Fill the quick application below and we'll
            review your store.
          </p>
        </div>

        {/* benefits + aside */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 items-start">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-white rounded-md border border-slate-200 shadow-sm">
              <h3 className="font-medium text-slate-800">Fast onboarding</h3>
              <p className="text-sm text-slate-500 mt-2">Complete setup and start listing products in under 24 hours.</p>
            </div>
            <div className="p-3 bg-white rounded-md border border-slate-200 shadow-sm">
              <h3 className="font-medium text-slate-800">Low commissions</h3>
              <p className="text-sm text-slate-500 mt-2">Competitive rates so you keep more of your revenue.</p>
            </div>
            <div className="p-3 bg-white rounded-md border border-slate-200 shadow-sm">
              <h3 className="font-medium text-slate-800">Seller support</h3>
              <p className="text-sm text-slate-500 mt-2">Dedicated onboarding support to help with listings and setup.</p>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
              <h4 className="text-lg font-medium text-slate-900">How it works</h4>
              <ol className="mt-3 space-y-2 text-sm text-slate-600">
                <li><strong className="text-slate-800">1.</strong> Submit your application & sample product image.</li>
                <li><strong className="text-slate-800">2.</strong> We validate documents (if required) and approve.</li>
                <li><strong className="text-slate-800">3.</strong> Start listing products and receive orders.</li>
              </ol>
              <div className="mt-3">
                <a href="#form" className="inline-block px-4 py-2 bg-sky-600 text-white rounded-md text-sm shadow-sm hover:bg-sky-700">
                  Apply now
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* form card */}
        <section id="form" className="bg-white rounded-md border border-slate-200 p-6 md:p-8 shadow-sm">
          <div>
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-slate-900">Seller application</h2>
              <p className="text-sm text-slate-600 mt-1">Tell us about your store and product range.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Business name</span>
                  <input
                    name="businessName"
                    value={form.businessName}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-sky-200 ${
                      errors.businessName ? "border-rose-400" : "border-slate-200"
                    }`}
                    placeholder="Ex: Blue Pine Clothing"
                    aria-invalid={!!errors.businessName}
                  />
                  {errors.businessName && <p className="text-rose-600 text-sm mt-1">{errors.businessName}</p>}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Owner / Contact name</span>
                    <input
                      name="ownerName"
                      value={form.ownerName}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-sky-200 ${
                        errors.ownerName ? "border-rose-400" : "border-slate-200"
                      }`}
                      placeholder="Ex: Nitin Chugh"
                      aria-invalid={!!errors.ownerName}
                    />
                    {errors.ownerName && <p className="text-rose-600 text-sm mt-1">{errors.ownerName}</p>}
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Category</span>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-sky-200 ${
                        errors.category ? "border-rose-400" : "border-slate-200"
                      }`}
                      aria-invalid={!!errors.category}
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-rose-600 text-sm mt-1">{errors.category}</p>}
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Description</span>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-sky-200 ${
                      errors.description ? "border-rose-400" : "border-slate-200"
                    }`}
                    placeholder="Briefly tell us about your product range, manufacturing or sourcing, and target customers."
                  />
                  {errors.description && <p className="text-rose-600 text-sm mt-1">{errors.description}</p>}
                </label>
              </div>

              <div className="md:col-span-1 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Email</span>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-sky-200 ${
                      errors.email ? "border-rose-400" : "border-slate-200"
                    }`}
                    placeholder="your@business.com"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="text-rose-600 text-sm mt-1">{errors.email}</p>}
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Phone</span>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-sky-200 ${
                      errors.phone ? "border-rose-400" : "border-slate-200"
                    }`}
                    placeholder="+91 98765 43210"
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && <p className="text-rose-600 text-sm mt-1">{errors.phone}</p>}
                </label>

                <div>
                  <span className="text-sm font-medium text-slate-700">Sample product image</span>
                  <div className="mt-2 flex items-center gap-3">
                    <label className="inline-flex items-center justify-center px-3 py-2 bg-white border border-slate-300 rounded-md text-sm cursor-pointer hover:bg-slate-50">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      Upload image
                    </label>
                    <div className="text-sm text-slate-500">PNG / JPG / WEBP • &lt; 3MB</div>
                  </div>
                  {errors.imageFile && <p className="text-rose-600 text-sm mt-1">{errors.imageFile}</p>}
                  {imagePreview ? (
                    <div className="mt-3">
                      <img src={imagePreview} alt="preview" className="w-full h-40 object-cover rounded-md border" />
                    </div>
                  ) : (
                    <div className="mt-3 text-sm text-slate-400">No image uploaded yet</div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-md shadow-sm hover:bg-sky-700 disabled:opacity-60"
                  >
                    {busy ? "Submitting..." : "Submit application"}
                  </button>
                </div>

                {errors.submit && <p className="text-rose-600 text-sm mt-2">{errors.submit}</p>}
                {successMsg && <p className="text-emerald-600 text-sm mt-2">{successMsg}</p>}
              </div>
            </form>

            {/* FAQs */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 text-sm text-slate-600">
                <h3 className="font-medium text-slate-800">What we need</h3>
                <ul className="list-disc ml-5 mt-3 space-y-2">
                  <li>A short description of your product range and who you sell to.</li>
                  <li>A sample image of your product/s to show on your storefront.</li>
                  <li>Valid contact email and phone so we can reach you for verification.</li>
                </ul>

                <h3 className="font-medium text-slate-800 mt-4">What happens next</h3>
                <ol className="list-decimal ml-5 mt-3 space-y-2">
                  <li>We review your application within 24–48 hours.</li>
                  <li>If more documents are needed we'll contact the provided email/phone.</li>
                  <li>Once approved you can start listing products & receiving orders.</li>
                </ol>
              </div>

              <div className="bg-slate-50 p-4 rounded-md border border-slate-200 text-sm text-slate-600">
                <strong className="text-slate-800">Need help?</strong>
                <p className="mt-2">
                  Email <a className="text-sky-600" href="mailto:support@yoursite.com">support@yoursite.com</a> or chat with
                  seller support in the app.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
