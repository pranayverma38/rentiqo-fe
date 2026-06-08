"use client";

import RegisterForm from "@/components/auth/RegisterForm";

function dismissModal(modalId: string) {
  const closeBtn = document.querySelector(
    `#${modalId} [data-bs-dismiss="modal"]`,
  ) as HTMLElement | null;
  closeBtn?.click();
}

export default function Register({
  registerModalElement,
}: {
  registerModalElement?: (el: HTMLElement | null) => void;
}) {
  return (
    <div
      ref={registerModalElement}
      className="modal modalCentered fade modal-log"
      id="register"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span className="icon-close-popup" data-bs-dismiss="modal">
            <i className="icon-X2" />
          </span>
          <div className="modal-heading text-center">
            <h3 className="title-pop mb-8">Create Account</h3>
            <p className="desc-pop cl-text-2">
              Be part of our growing family of new customers!
            </p>
          </div>
          <div className="modal-main">
            <RegisterForm
              submitClassName="action-create-account tf-btn animate-btn w-100"
              onSuccess={() => dismissModal("register")}
            />
            <div className="group-action mt-12">
              <a
                href="#sign"
                data-bs-toggle="modal"
                className="tf-btn btn-stroke w-100"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}