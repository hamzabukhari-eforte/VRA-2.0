"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginImage from "@/components/login/LoginImage";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/member/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error || "Unable to sign in.");
        return;
      }

      router.push("/profile");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <LoginImage />
      <div className="w-full lg:w-1/2 bg-background dark:bg-[#2a2a2a] flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md">
          <h1 className="text-foreground dark:text-white text-3xl font-semibold mb-2">
            Member Login
          </h1>
          <p className="text-muted-foreground dark:text-white/70 mb-8 leading-relaxed">
            Sign in with the email address and temporary password provided in
            your VRA welcome email.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="member-email"
                className="block text-foreground dark:text-white text-sm font-medium mb-1.5"
              >
                Email Address
              </label>
              <input
                id="member-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full h-11 px-4 bg-white dark:bg-white rounded-lg border border-gray-300 dark:border-transparent text-gray-900 placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="member-password"
                className="block text-foreground dark:text-white text-sm font-medium mb-1.5"
              >
                Password
              </label>
              <input
                id="member-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full h-11 px-4 bg-white dark:bg-white rounded-lg border border-gray-300 dark:border-transparent text-gray-900 placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-foreground dark:bg-black text-background dark:text-white text-sm sm:text-base font-medium hover:opacity-90 dark:hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
