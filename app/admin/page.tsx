"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

interface LoginForm {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Validation
    if (!form.email.trim()) {
      toast.error("Email address is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!form.password.trim()) {
      toast.error("Password is required");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Signing in...");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data: LoginResponse = await res.json();

      if (!data.success) {
        toast.dismiss(toastId);
        toast.error(data.message || "Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      if (!data.token) {
        toast.dismiss(toastId);
        toast.error("Invalid response from server");
        setLoading(false);
        return;
      }

      localStorage.setItem("admin_token", data.token);
      toast.dismiss(toastId);
      toast.success("Welcome back! Redirecting to dashboard...");
      
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1000);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Network error. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-6">
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

      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-[#2A2A4A] bg-[#0F0F1A] p-8 md:p-10 shadow-2xl shadow-[#4A90D9]/5">
          <div className="text-center">
            <div className="inline-block rounded-full border border-[#2A2A4A] bg-[#1A1A2E] px-6 py-2 mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#4A90D9]">
                LeadDesk
              </p>
            </div>
            <h1 className="text-3xl font-bold text-white">Admin login</h1>
            <p className="mt-2 text-sm text-[#A0A0B0]">Sign in to manage your leads.</p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#C0C0D0]">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-[#2A2A4A] bg-[#1A1A2E] px-4 py-3 text-white placeholder:text-[#505060] transition-colors focus:border-[#4A90D9] focus:outline-none focus:ring-2 focus:ring-[#4A90D9]/30"
                placeholder="admin@leaddesk.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#C0C0D0]">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-[#2A2A4A] bg-[#1A1A2E] px-4 py-3 text-white placeholder:text-[#505060] transition-colors focus:border-[#4A90D9] focus:outline-none focus:ring-2 focus:ring-[#4A90D9]/30"
                placeholder="••••••••"
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
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2A2A4A]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#0F0F1A] px-4 text-[#505060]">Demo credentials</span>
              </div>
            </div>
            <div className="text-center text-xs text-[#505060] space-y-1">
              <p>Email: admin@leaddesk.com</p>
              <p>Password: admin123</p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
