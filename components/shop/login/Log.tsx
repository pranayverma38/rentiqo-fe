"use client";

import Link from "next/link";
import { Suspense } from "react";

import LoginForm from "@/components/auth/LoginForm";

export default function Log() {
  return (
    <section className="section-log flat-spacing">
      <div className="container">
        <div className="row align-items-center gy-30">
          <div className="col-md-5 ms-auto">
            <div className="col-left">
              <h4 className="title mb-20">Login</h4>
              <Suspense fallback={<p className="cl-text-2">Loading…</p>}>
                <LoginForm submitClassName="tf-btn animate-btn" />
              </Suspense>
            </div>
          </div>
          <div className="col-md-5 me-auto">
            <div className="col-right">
              <h4 className="mb-8">New Customer</h4>
              <p className="cl-text-2 mb-20">
                Be part of our growing family of new customers! Join us today and
                unlock a world of exclusive benefits, offers, and personalized
                experiences.
              </p>
              <Link href="/register" className="tf-btn animate-btn">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
