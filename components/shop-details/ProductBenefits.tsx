"use client";

import { useCallback, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";

import TfSwiper from "@/components/ui/TfSwiper";

const BENEFITS = [
  {
    icon: "icon-Truck2",
    title: "Free Delivery & Setup*",
    description: "Delivered & set up by pros — absolutely free.",
  },
  {
    icon: "icon-Sparkle",
    title: "Mint Condition",
    description: "Looks new. Feels new. Delivered spotless.",
  },
  {
    icon: "icon-ShieldCheck",
    title: "Zero Deposit",
    description: "Skip Security Deposit on Upfront rental payment",
  },
  {
    icon: "icon-ArrowsLeftRight",
    title: "Free Relocation",
    description: "We Move for you, 100% free of cost",
  },
] as const;

const benefitCardClass =
  "flex h-full min-h-[112px] items-center gap-[16px] rounded-[12px] border border-[var(--line)] bg-[var(--bg)] px-[20px] py-[22px] transition-[border-color,box-shadow] duration-300 hover:border-[var(--primary)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]";

const benefitIconWrapClass =
  "flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[12px] bg-[var(--white)] text-[26px] text-[var(--primary)] shadow-[0_2px_8px_rgba(0,0,0,0.06)]";

function BenefitCard({
  icon,
  title,
  description,
}: (typeof BENEFITS)[number]) {
  return (
    <article className={benefitCardClass}>
      <span className={benefitIconWrapClass} aria-hidden>
        <i className={`icon ${icon}`} />
      </span>
      <div className="min-w-0 flex-1">
        <h6 className="mb-[6px] text-[15px] font-semibold leading-[1.35] text-[var(--black)]">
          {title}
        </h6>
        <p className="mb-0 text-[13px] leading-[1.55] text-[var(--text-2)]">
          {description}
        </p>
      </div>
    </article>
  );
}

export default function ProductBenefits() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [showNav, setShowNav] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const syncNavState = useCallback((swiper: SwiperType) => {
    setShowNav(!swiper.isLocked);
    setCanPrev(!swiper.isBeginning);
    setCanNext(!swiper.isEnd);
  }, []);

  const handleSwiper = useCallback(
    (swiper: SwiperType) => {
      swiperRef.current = swiper;
      syncNavState(swiper);

      const onChange = () => syncNavState(swiper);
      swiper.on("resize", onChange);
      swiper.on("breakpoint", onChange);
      swiper.on("slideChange", onChange);
      swiper.on("update", onChange);
    },
    [syncNavState],
  );

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const navBtnClass = (enabled: boolean) =>
    `tf-sw-nav-2 rounded-[8px]${enabled ? "" : " swiper-button-disabled pointer-events-none opacity-40"}`;

  return (
    <section className="section-product-benefits flat-spacing">
      <div className="container">
        <div className="sect-heading type-4 align-items-end mb-[24px] md:mb-[40px]">
          <div>
            <h3 className="s-title mb-0">Benefits</h3>
          </div>
          {showNav ? (
            <div className="group-btn-slider flex items-center gap-[10px]">
              <button
                type="button"
                className={navBtnClass(canPrev)}
                onClick={handlePrev}
                disabled={!canPrev}
                aria-label="Previous benefit"
              >
                <i className="icon icon-ArrowLeft" aria-hidden />
              </button>
              <button
                type="button"
                className={navBtnClass(canNext)}
                onClick={handleNext}
                disabled={!canNext}
                aria-label="Next benefit"
              >
                <i className="icon icon-ArrowRight" aria-hidden />
              </button>
            </div>
          ) : null}
        </div>

        <TfSwiper
          className="wrap-sw-over product-benefits-swiper"
          preview={4}
          tablet={3}
          mobileSm={2}
          mobile={1}
          spaceLg={20}
          spaceMd={16}
          space={12}
          pagination={1}
          paginationSm={1}
          paginationMd={2}
          paginationLg={3}
          paginationDisabled
          cursor
          onSwiper={handleSwiper}
        >
          {BENEFITS.map((benefit) => (
            <BenefitCard key={benefit.title} {...benefit} />
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}
