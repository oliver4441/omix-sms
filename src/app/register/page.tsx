"use client";

import { useState, Suspense } from "react";
import { Icon } from "@/components/ui/Icon"

function RegisterForm() {
  // School fields
  const [schoolName, setSchoolName] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [schoolPhone, setSchoolPhone] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");

  // Admin fields
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (adminPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (adminPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolName,
          schoolEmail,
          schoolPhone,
          schoolAddress,
          adminName,
          adminEmail,
          adminPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
          />
          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #818cf8, transparent)" }}
          />
        </div>

        <div
          className="w-full max-w-md relative"
        >
          {/* Logo & Brand */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-omix-500 to-omix-700 mb-6 glow"
            >
              <Icon name="GraduationCap" className="w-10 h-10 text-white" />
            </div>
            <h1
              className="text-3xl font-bold gradient-text"
            >
              omixsystems
            </h1>
            <p
              className="text-gray-400 mt-2 text-sm"
            >
              School Management Platform
            </p>
          </div>

          {/* Success Card */}
          <div
            className="glass rounded-2xl p-8 glow text-center"
          >
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6"
            >
              <Icon name="CheckCircle" className="w-8 h-8 text-emerald-400" />
            </div>

            <h2
              className="text-xl font-semibold text-gray-100 mb-3"
            >
              Registration Submitted for Approval
            </h2>

            <p
              className="text-gray-400 text-sm mb-8"
            >
              Your school account has been submitted for review. An administrator
              will review your registration and you will be notified once
              approved.
            </p>

            <div
            >
              <a
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-omix-600 to-omix-500 hover:from-omix-500 hover:to-omix-400 text-white font-medium rounded-xl transition-all duration-300 glow-sm"
              >
                <Icon name="ArrowLeft" className="w-4 h-4" />
                Return to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #818cf8, transparent)" }}
        />
      </div>

      <div
        className="w-full max-w-lg relative"
      >
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-omix-500 to-omix-700 mb-6 glow"
          >
            <Icon name="GraduationCap" className="w-10 h-10 text-white" />
          </div>
          <h1
            className="text-3xl font-bold gradient-text"
          >
            Register Your School
          </h1>
          <p
            className="text-gray-400 mt-2 text-sm"
          >
            Create your school&apos;s account on omixsystems
          </p>
        </div>

        {/* Registration Card */}
        <div
          className="glass rounded-2xl p-8 glow"
        >
          <div className="flex items-center gap-2 mb-6">
            <Icon name="Sparkles" className="w-4 h-4 text-omix-400" />
            <span className="text-sm text-gray-400">
              Fill in your school details
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* School Information Section */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Building2" className="w-4 h-4 text-omix-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  School Information
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  School Name
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g. Springfield Elementary"
                  required
                  className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none input-glow transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  School Email
                </label>
                <input
                  type="email"
                  value={schoolEmail}
                  onChange={(e) => setSchoolEmail(e.target.value)}
                  placeholder="admin@school.edu"
                  required
                  className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none input-glow transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  School Phone
                </label>
                <input
                  type="tel"
                  value={schoolPhone}
                  onChange={(e) => setSchoolPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  required
                  className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none input-glow transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  School Address
                </label>
                <textarea
                  value={schoolAddress}
                  onChange={(e) => setSchoolAddress(e.target.value)}
                  placeholder="123 Education Lane, City, State, ZIP"
                  required
                  rows={2}
                  className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none input-glow transition-all resize-none"
                />
              </div>
            </div>

            {/* Admin Information Section */}
            <div className="space-y-1 pt-2">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="User" className="w-4 h-4 text-omix-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Admin Information
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Name
                </label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none input-glow transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="john@school.edu"
                  required
                  className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none input-glow transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none input-glow transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <Icon name="EyeOff" className="w-4 h-4" /> : <Icon name="Eye" className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none input-glow transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showConfirmPassword ? <Icon name="EyeOff" className="w-4 h-4" /> : <Icon name="Eye" className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p
                className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2"
              >
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-omix-600 to-omix-500 hover:from-omix-500 hover:to-omix-400 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 glow-sm"
            >
              {loading ? (
                <div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  <Icon name="School" className="w-4 h-4" />
                  Register School
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-omix-400 hover:text-omix-300 transition-colors font-medium"
              >
                Sign in
              </a>
            </p>
          </div>

          <div className="mt-4">
            <p className="text-xs text-gray-500 text-center">
              Powered by <span className="text-omix-400">omixsystems</span> AI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
