import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PrachayLogo from '../components/PrachayLogo';
import {
  FileText,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  Receipt,
  UserCheck,
  Sparkles,
  PieChart,
  Calendar,
  Lock,
} from 'lucide-react';

export default function LandingPage() {
  const [activeRole, setActiveRole] = useState('employee');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-amber-100 selection:text-amber-900">
      {/* Top Header / Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <PrachayLogo className="h-10" />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 hover:text-[#1d5b96] transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-[#1d5b96] hover:bg-[#154675] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Employee Register</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-blue-50/60 via-slate-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-100/80 border border-blue-200/80 text-[#1d5b96] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-4 h-4 text-[#f39c12]" />
              <span>PSPL Financial Management Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Digitize & Accelerate <br />
              <span className="bg-gradient-to-r from-[#1d5b96] via-[#1b4e80] to-[#f39c12] bg-clip-text text-transparent">
                Expense Vouchers
              </span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed font-normal">
              A comprehensive corporate solution for **Prachay Securities Private Limited (PSPL)**.
              Seamlessly handle employee reimbursements, advance expense requests, Director digital signatures, and Accounts settlement.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#1d5b96] hover:bg-[#14426f] text-white font-semibold text-base px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                <span>Register as Employee</span>
                <ArrowRight className="w-5 h-5 text-[#f39c12]" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-base px-8 py-3.5 rounded-xl border border-slate-300 shadow-sm transition-all"
              >
                <Lock className="w-4 h-4 text-[#1d5b96]" />
                <span>Portal Login</span>
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
                <div className="text-2xl font-bold text-[#1d5b96]">100%</div>
                <div className="text-xs text-slate-500 font-medium">Digital Audit Trail</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
                <div className="text-2xl font-bold text-[#f39c12]">&lt; 24 hrs</div>
                <div className="text-xs text-slate-500 font-medium">Avg. Approval Time</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
                <div className="text-2xl font-bold text-[#1d5b96]">Future & Past</div>
                <div className="text-xs text-slate-500 font-medium">Advance & Reimbursements</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
                <div className="text-2xl font-bold text-slate-800">Verified</div>
                <div className="text-xs text-slate-500 font-medium">Director Digital Signature</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold text-slate-900">Designed for Enterprise Operations</h2>
            <p className="mt-3 text-slate-600">Built to ensure transparency, compliance, and zero delays across all departments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1d5b96] flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Advance & Reimbursements</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Submit claims for past receipts or request advance funds for upcoming travel and vendor expenses with future date support.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#f39c12] flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Director Digital Signatures</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Executives review voucher details, attached bill proofs, and authorize claims with authenticated signature stamps.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1d5b96] flex items-center justify-center mb-6">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Printable PDF & QR Verification</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Generate official Prachay Group PDF expense vouchers with embedded QR codes for instant verification and compliance filing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Preview Interactive Tabs */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Role-Based Corporate Workflows</h2>
            <p className="mt-2 text-slate-600">Explore tailored dashboards engineered for each role in PSPL.</p>

            <div className="mt-8 inline-flex bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300">
              <button
                onClick={() => setActiveRole('employee')}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeRole === 'employee'
                    ? 'bg-white text-[#1d5b96] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Employee Portal
              </button>
              <button
                onClick={() => setActiveRole('director')}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeRole === 'director'
                    ? 'bg-white text-[#1d5b96] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Director Approval Hub
              </button>
              <button
                onClick={() => setActiveRole('accounts')}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeRole === 'accounts'
                    ? 'bg-white text-[#1d5b96] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Accounts & Disbursement
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-lg max-w-4xl mx-auto">
            {activeRole === 'employee' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-[#1d5b96] rounded-2xl">
                    <UserCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Employee Workspace</h3>
                    <p className="text-sm text-slate-500">Create, submit, and track expense vouchers in real-time.</p>
                  </div>
                </div>
                <ul className="space-y-3 text-slate-600 text-sm">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Create draft vouchers and upload signature images & bill proofs.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Support for past expense reimbursements or future advance requests.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Instant status updates (Draft, Pending Approval, Approved, Rejected).</span>
                  </li>
                </ul>
              </div>
            )}

            {activeRole === 'director' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-[#f39c12] rounded-2xl">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Director Approval Hub</h3>
                    <p className="text-sm text-slate-500">Executive dashboard for review, digital authorization, or rejection.</p>
                  </div>
                </div>
                <ul className="space-y-3 text-slate-600 text-sm">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#f39c12] shrink-0" />
                    <span>Dedicated pending approval queue with one-click voucher inspection.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#f39c12] shrink-0" />
                    <span>Attach authorized digital signature image upon approving.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#f39c12] shrink-0" />
                    <span>Mandatory rejection reason input for complete policy transparency.</span>
                  </li>
                </ul>
              </div>
            )}

            {activeRole === 'accounts' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-[#1d5b96] rounded-2xl">
                    <PieChart className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Accounts & Financial Tracking</h3>
                    <p className="text-sm text-slate-500">Centralized view for audit compliance, payment disbursement, and analytics.</p>
                  </div>
                </div>
                <ul className="space-y-3 text-slate-600 text-sm">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                    <span>Track total company payout statistics and departmental expense distributions.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                    <span>Mark approved vouchers as disbursed with payment reference IDs (UTR).</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                    <span>Export audit-ready CSV reports or official printable vouchers.</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <PrachayLogo className="h-8" showText={true} />
          </div>
          <p className="text-xs text-slate-500 text-center md:text-right">
            © {new Date().getFullYear()} Prachay Securities Private Limited (PSPL). All rights reserved. <br />
            Internal Enterprise Financial Operations Portal.
          </p>
        </div>
      </footer>
    </div>
  );
}
