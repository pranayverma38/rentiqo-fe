"use client";

import { useCallback, useState } from "react";

const REFERRAL_CODE = "CF5785862564";
const REFERRALS_COMPLETED = 0;
const CASH_EARNED = 0;
const MIN_WITHDRAW = 1000;
const EARN_PER_REFERRAL = 500;
const MAX_EARN = 5000;

/** Rentiqo brand orange palette */
const ORANGE = {
  primary: "#E56942",
  dark: "#C24E2E",
  deeper: "#9A3D24",
  light: "#FDECE7",
  soft: "#FFF8F5",
  border: "#F0D9CF",
  muted: "#B85C3A",
} as const;

const STEPS = [
  { icon: "icon-ShareNetwork", label: "Share Link" },
  { icon: "icon-Package", label: "Friend Rents" },
  { icon: "icon-Handbag", label: "Both Earn" },
] as const;

const WHATSAPP_MESSAGE = encodeURIComponent(
  `Join Rentiqo with my referral code ${REFERRAL_CODE} and we both earn rewards!`,
);

const CARD =
  "rounded-[14px] border border-[#E8E8E8] bg-white p-6 shadow-[0_2px_12px_rgba(16,16,16,0.04)] md:rounded-[16px]";

const SECTION_GAP = "gap-6";

export default function AccountReferEarn() {
  const [copied, setCopied] = useState(false);
  const canWithdraw = CASH_EARNED >= MIN_WITHDRAW;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_CODE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  const progressPercent =
    MAX_EARN > 0 ? Math.min(100, (CASH_EARNED / MAX_EARN) * 100) : 0;

  return (
    <div
      className={`account-refer-earn flex w-full max-w-[720px] flex-col ${SECTION_GAP}`}
    >
      {/* Hero + steps */}
      <section className="relative mb-0">
        <div
          className="relative overflow-hidden rounded-[16px] px-6 pb-[4.75rem] pt-9 text-center md:rounded-[20px] md:px-10 md:pb-[5.5rem] md:pt-11"
          style={{
            background: `radial-gradient(ellipse 90% 70% at 50% -10%, rgba(255,255,255,0.18) 0%, transparent 50%), linear-gradient(165deg, ${ORANGE.primary} 0%, ${ORANGE.dark} 48%, ${ORANGE.deeper} 100%)`,
          }}
        >
          <span className="mb-5 inline-flex items-center rounded-full bg-white px-5 py-2 text-[13px] font-semibold tracking-wide text-[#E56942] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            1 Referral = ₹{EARN_PER_REFERRAL}
          </span>
          <h2 className="mx-auto max-w-[18rem] text-[1.375rem] font-bold leading-[1.35] text-white md:max-w-none md:text-[1.75rem]">
            Refer &amp; Earn upto{" "}
            <span className="text-[#FFEB8A]">₹{MAX_EARN}</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[16rem] text-[14px] leading-relaxed text-white/90 md:max-w-none md:text-[15px]">
            Real cash – Direct to your account.
          </p>
        </div>

        <div className="relative z-[1] -mt-12 mx-0 md:-mt-14">
          <div
            className={`${CARD} px-5 py-6 shadow-[0_8px_24px_rgba(16,16,16,0.06)] md:px-7 md:py-7`}
          >
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              {STEPS.map((step, index) => (
                <div
                  key={step.label}
                  className="relative flex flex-col items-center px-1"
                >
                  {index < STEPS.length - 1 ? (
                    <span
                      className="pointer-events-none absolute left-[calc(50%+1.75rem)] top-5 hidden h-px w-[calc(100%-3.5rem)] border-t border-dashed border-[#E8D4CC] md:block"
                      aria-hidden
                    />
                  ) : null}
                  <span
                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-full md:h-11 md:w-11"
                    style={{ backgroundColor: ORANGE.light, color: ORANGE.primary }}
                  >
                    <i className={`icon ${step.icon} text-[1.125rem] md:text-[1.25rem]`} />
                  </span>
                  <span className="text-center text-[12px] font-medium leading-snug text-[#3D3D3D] md:text-[13px]">
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Referral code */}
      <section className={CARD}>
        <label
          htmlFor="referral-code"
          className="mb-4 block text-[13px] font-medium text-[#696E73]"
        >
          Your referral code
        </label>

        <div className="account-refer-earn__code-row flex flex-nowrap items-stretch gap-3">
          <div className="flex h-[44px] min-w-0 flex-1 items-center gap-2 rounded-[12px] border border-[#E8E8E8] bg-[#FAFAFA] px-3 md:gap-3 md:px-4">
            <input
              id="referral-code"
              type="text"
              readOnly
              value={REFERRAL_CODE}
              className="min-w-0 flex-1 border-0 bg-transparent text-[14px] font-semibold tracking-[0.02em] text-[#101010] outline-none md:text-[15px]"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-[#E8E8E8] bg-white transition hover:border-[#101010]"
              style={{ color: ORANGE.primary }}
              aria-label="Copy referral code"
            >
              <i className="icon icon-CopySimple text-[1.125rem]" />
            </button>
          </div>

          <a
            href={`https://wa.me/?text=${WHATSAPP_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="account-refer-earn__refer-btn h-[44px]"
            style={{ backgroundColor: ORANGE.primary }}
          >
            <WhatsAppIcon />
            <span>Refer Now</span>
          </a>
        </div>

        {copied ? (
          <p className="mt-3 text-[13px] font-medium text-[#101010]">
            Code copied to clipboard
          </p>
        ) : null}
      </section>

      {/* Stats */}
      <section className={`grid grid-cols-1 md:grid-cols-2 ${SECTION_GAP}`}>
        <div className={`${CARD} flex flex-col`}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[14px] font-semibold text-[#101010]">
              {String(REFERRALS_COMPLETED).padStart(2, "0")} Referrals Completed
            </span>
            <span className="text-[14px] font-bold text-[#101010]">
              ₹{CASH_EARNED} Earned
            </span>
          </div>
          <div className="mb-4 h-2 overflow-hidden rounded-full bg-[#E8E8E8]">
            <div
              className="h-full rounded-full bg-[#101010] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-auto text-[14px] font-semibold leading-relaxed text-[#101010]">
            Refer a friend to earn your first ₹{EARN_PER_REFERRAL}!
          </p>
        </div>

        <div className={`${CARD} flex flex-col overflow-hidden p-0`}>
          <div className="flex flex-1 flex-col p-6 md:p-6">
            <p className="text-[11px] font-bold tracking-[0.08em] text-[#101010]">
              TOTAL CASH EARNED
            </p>
            <p className="my-3 text-[2.25rem] font-bold leading-none text-[#101010] md:text-[2.5rem]">
              ₹{CASH_EARNED}
            </p>
            <p className="mb-5 text-[12px] leading-relaxed text-[#696E73]">
              *Withdraw once your balance hits ₹{MIN_WITHDRAW}.
            </p>
            <button
              type="button"
              disabled={!canWithdraw}
              className="w-full rounded-[10px] px-4 py-3 text-[14px] font-semibold transition disabled:cursor-not-allowed disabled:bg-[#F0F0F0] disabled:text-[#B1B2B7] enabled:bg-[#101010] enabled:text-white enabled:hover:opacity-90"
            >
              Withdraw Cash &gt;&gt;
            </button>
          </div>
          <div className="border-t border-[#E8E8E8] bg-[#FAFAFA] px-6 py-3.5 text-center text-[13px] font-medium text-[#101010]">
            Start referring to unlock cash rewards.
          </div>
        </div>
      </section>

      {/* Tracker */}
      <section className={CARD}>
        <h3 className="mb-5 border-b border-dashed border-[#E8E8E8] pb-4 text-[17px] font-bold text-[#101010] md:text-[18px]">
          Referral Tracker
        </h3>
        <div className="flex flex-col items-center justify-center px-4 py-12 text-center md:py-16">
          <span
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: ORANGE.light, color: ORANGE.primary }}
          >
            <i className="icon icon-Users text-[1.5rem]" />
          </span>
          <p className="text-[15px] font-semibold text-[#101010]">No referrals yet</p>
          <p className="mt-2 max-w-[20rem] text-[13px] leading-relaxed text-[#696E73]">
            Share your code and track friends who sign up and rent here.
          </p>
        </div>
      </section>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      className="block h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}