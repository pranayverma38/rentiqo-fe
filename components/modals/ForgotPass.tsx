"use client";

import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPass({
  registerModalElement,
}: {
  registerModalElement?: (el: HTMLElement | null) => void;
}) {
  return (
    <div
      ref={registerModalElement}
      className="modal modalCentered fade modal-log modal-log_forgot"
      id="modalForgot"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span className="icon-close-popup" data-bs-dismiss="modal">
            <i className="icon-X2" />
          </span>
                    <div className="modal-heading text-center">
            <h3 className="title-pop mb-8">Forgot Password</h3>
            <p className="desc-pop cl-text-2">
              We will send instructions to reset your password.
            </p>
          </div>
          <div className="modal-main">
            <ForgotPasswordForm submitClassName="tf-btn animate-btn w-100" />
            <p className="orther-log text-center mt-12">
              Remember your password? 
              <a
                href="#sign"
                data-bs-toggle="modal"
                className="text-primary text-decoration-underline"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}