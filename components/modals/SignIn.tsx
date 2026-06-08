"use client";

import { Suspense } from "react";

import LoginForm from "@/components/auth/LoginForm";

function dismissModal(modalId: string) {
  const closeBtn = document.querySelector(
    `#${modalId} [data-bs-dismiss="modal"]`,
  ) as HTMLElement | null;
  closeBtn?.click();
}

export default function SignIn({
  registerModalElement,
}: {
  registerModalElement?: (el: HTMLElement | null) => void;
}) {
  return (
    <div
      ref={registerModalElement}
      className="modal modalCentered fade modal-log"
      id="sign"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span className="icon-close-popup" data-bs-dismiss="modal">
            <i className="icon-X2" />
          </span>
          <div className="modal-heading text-center">
            <h3 className="title-pop mb-8">Sign In</h3>
            <p className="desc-pop cl-text-2">
              Sign in to access your personalized experience.
            </p>
          </div>
          <div className="modal-main">
            <Suspense fallback={<p className="cl-text-2 text-center">Loading…</p>}>
              <LoginForm
                forgotPasswordHref="#modalForgot"
                onSuccess={() => dismissModal("sign")}
              />
            </Suspense>
            <div className="group-action mt-12">
              <a
                href="#register"
                data-bs-toggle="modal"
                className="tf-btn btn-stroke w-100"
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}