"use client";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function LandingPage() {
  const [form, setForm] = useState({ name: "", email: "", budget: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  const validateForm = () => {
    if (!form.name.trim()) return "Full name is required";
    if (!form.email.trim()) return "Email address is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email";
    if (!form.budget) return "Please select a budget range";
    if (!form.message.trim()) return "Message is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Sending your message...");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        toast.dismiss(toastId);
        toast.error(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      toast.dismiss(toastId);
      toast.success("Thank you! We'll be in touch within 24 hours.");
      setForm({ name: "", email: "", budget: "", message: "" });
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0F]">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            background: "#1A1A2E",
            color: "#E8E8E8",
            border: "1px solid #2A2A4A",
            borderRadius: "16px",
            padding: "16px 24px",
          },
          success: {
            style: {
              background: "#0F1F0F",
              border: "1px solid #2A5A2A",
            },
          },
          error: {
            style: {
              background: "#1F0F0F",
              border: "1px solid #5A2A2A",
            },
          },
        }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-28 pb-12 text-center">
        <div className="inline-block rounded-full border border-[#2A2A4A] bg-[#1A1A2E] px-6 py-2 mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#4A90D9]">
            LeadDesk
          </p>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white">
          Capture leads.<br />
          <span className="text-[#4A90D9]">Close deals faster.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-[#A0A0B0]">
          A simple, powerful lead capture platform built for modern businesses.
          Fill out the form below and we will get back to you within 24 hours.
        </p>
      </section>

      {/* Lead Form */}
      <section className="mx-auto max-w-2xl px-6 pb-24">
        <div className="rounded-3xl border border-[#2A2A4A] bg-[#0F0F1A] p-8 md:p-10 shadow-2xl shadow-[#4A90D9]/5">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-1 w-1 rounded-full bg-[#4A90D9]"></div>
            <h2 className="text-2xl font-semibold text-white">Get in touch</h2>
          </div>
          <p className="text-sm text-[#A0A0B0]">Tell us about your project and budget.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#C0C0D0]">
                Full name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-[#2A2A4A] bg-[#1A1A2E] px-4 py-3 text-white placeholder:text-[#505060] transition-colors focus:border-[#4A90D9] focus:outline-none focus:ring-2 focus:ring-[#4A90D9]/30"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#C0C0D0]">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-[#2A2A4A] bg-[#1A1A2E] px-4 py-3 text-white placeholder:text-[#505060] transition-colors focus:border-[#4A90D9] focus:outline-none focus:ring-2 focus:ring-[#4A90D9]/30"
              />
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-[#C0C0D0]">
                Budget range
              </label>
              <select
                id="budget"
                value={form.budget}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-[#2A2A4A] bg-[#1A1A2E] px-4 py-3 text-white transition-colors focus:border-[#4A90D9] focus:outline-none focus:ring-2 focus:ring-[#4A90D9]/30"
              >
                <option value="">Select budget</option>
                <option value="Under $1,000">Under $1,000</option>
                <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                <option value="$10,000+">$10,000+</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#C0C0D0]">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="Tell us about your project"
                value={form.message}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-[#2A2A4A] bg-[#1A1A2E] px-4 py-3 text-white placeholder:text-[#505060] transition-colors focus:border-[#4A90D9] focus:outline-none focus:ring-2 focus:ring-[#4A90D9]/30 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#4A90D9] px-5 py-3.5 font-semibold text-white transition-all hover:bg-[#3A7BC8] hover:shadow-lg hover:shadow-[#4A90D9]/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send message"
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2A2A4A] py-8 text-center">
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#606080] transition-colors hover:text-[#4A90D9]"
        >
          Built for Digital Heroes Training Task
        </a>
      </footer>
    </main>
  );
}