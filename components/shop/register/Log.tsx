"use client";

import Link from "next/link";

import RegisterForm from "@/components/auth/RegisterForm";

export default function Log() {
  return (
    <section className="section-log flat-spacing">
      <div className="container">
        <div className="row align-items-center gy-30">
          <div className="col-md-5 ms-auto">
            <div className="col-left">
              <h4 className="title mb-20">Create Account</h4>
              <RegisterForm />
            </div>
          </div>
          <div className="col-md-5 me-auto">
            <div className="col-right">
              <h4 className="mb-8">Already have an account?</h4>
              <p className="cl-text-2 mb-20">
                Welcome back. Sign in to access your personalized experience,
                saved preferences, and more. We are thrilled to have you with us
                again!
              </p>
              <Link href="/login" className="tf-btn animate-btn">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
