"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

// Types
interface Lead {
  _id: string;
  name: string;
  email: string;
  budget: string;
  message: string;
  status: "New" | "Contacted" | "Closed";
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  leads?: Lead[];
  message?: string;
}

const STATUS_COLORS: Record<Lead["status"], string> = {
  New: "bg-[#4A90D9]/20 text-[#4A90D9]",
  Contacted: "bg-blue-900/30 text-blue-400",
  Closed: "bg-zinc-800 text-zinc-400",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLeads = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        toast.error("Session expired. Please login again.");
        router.push("/admin");
        return;
      }

      const res = await fetch("/api/leads", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data: ApiResponse = await res.json();

      if (!data.success) {
        toast.error(data.message || "Failed to fetch leads");
        router.push("/admin");
        return;
      }

      setLeads(data.leads || []);
    } catch (error) {
      toast.error("Network error. Please try again.");
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id: string, status: Lead["status"]): Promise<void> => {
    const toastId = toast.loading("Updating status...");
    
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        toast.dismiss(toastId);
        toast.error("Session expired");
        router.push("/admin");
        return;
      }

      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.dismiss(toastId);
        toast.error(data.message || "Failed to update status");
        return;
      }

      toast.dismiss(toastId);
      toast.success(`Status updated to ${status}`);
      await fetchLeads();
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Network error. Please try again.");
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem("admin_token");
    toast.success("Logged out successfully");
    router.push("/admin");
  };

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#0A0A0F] px-6 py-10">
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

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#4A90D9]">
              LeadDesk
            </p>
            <h1 className="mt-1 text-3xl font-bold text-white">All leads</h1>
            <p className="mt-1 text-sm text-[#A0A0B0]">
              {filteredLeads.length} {filteredLeads.length === 1 ? "lead" : "leads"} found
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-2xl border border-[#2A2A4A] px-5 py-2.5 text-sm text-[#A0A0B0] transition-all hover:border-[#4A90D9] hover:text-white hover:bg-[#1A1A2E]"
          >
            Logout
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-6 w-full rounded-2xl border border-[#2A2A4A] bg-[#1A1A2E] px-4 py-3 pl-12 text-white placeholder:text-[#505060] transition-colors focus:border-[#4A90D9] focus:outline-none focus:ring-2 focus:ring-[#4A90D9]/30"
          />
          <svg
            className="absolute left-4 top-4 h-5 w-5 text-[#505060]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <svg className="h-8 w-8 animate-spin text-[#4A90D9]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <p className="text-[#A0A0B0]">Loading leads...</p>
            </div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="rounded-2xl border border-[#2A2A4A] bg-[#0F0F1A] p-12 text-center">
            <p className="text-[#A0A0B0]">No leads found</p>
            <p className="mt-2 text-sm text-[#606080]">
              {search ? "Try adjusting your search" : "Leads will appear here once submitted"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div
                key={lead._id}
                className="rounded-2xl border border-[#2A2A4A] bg-[#0F0F1A] p-6 transition-all hover:border-[#3A3A5A]"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#1A1A2E] flex items-center justify-center text-[#4A90D9] font-semibold">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-white truncate">{lead.name}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                          <span className="text-[#A0A0B0]">{lead.email}</span>
                          <span className="text-[#505060]">·</span>
                          <span className="text-[#A0A0B0]">{lead.budget}</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-[#808090] line-clamp-2">{lead.message}</p>
                    <p className="mt-2 text-xs text-[#505060]">
                      {new Date(lead.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:flex-nowrap">
                    {(["New", "Contacted", "Closed"] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(lead._id, status)}
                        className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                          lead.status === status
                            ? STATUS_COLORS[status]
                            : "bg-[#1A1A2E] text-[#505060] hover:bg-[#2A2A4A] hover:text-white"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}