import Image from "next/image";

import TfSwiper from "@/components/ui/TfSwiper";

/** Same aspect as desktop theme heroes (e.g. 1770×680 construction slides). */
const BANNER_ASPECT_CLASS = "aspect-[1770/680]";

const BANNER_SLIDES = [
  {
    src: "/assets/images/second-section/292647.jpg",
    alt: "Featured banner",
  },
  {
    src: "/assets/images/second-section/954.jpg",
    alt: "Featured banner",
  },
] as const;

export default function CustomBannerHero() {
  return (
    <section
      className="tf-slideshow tf-btn-swiper-main bg-[#fafafa] pt-[10px] pb-[10px]"
      aria-label="Featured banner"
    >
      <div className="w-full max-w-full px-[15px] md:mx-auto md:w-[1440px] md:max-w-full">
        <TfSwiper
          loop
          effect="fade"
          auto
          delay={3000}
          preview={1}
          tablet={1}
          mobile={1}
          spaceLg={30}
          spaceMd={20}
          space={15}
          className="sw-slide-show slider_effect_fade"
          paginationClassName="sw-line-default tf-sw-pagination"
        >
          {BANNER_SLIDES.map((slide, index) => (
            <div
              key={slide.src}
              className="slider-wrap relative h-unset w-full overflow-hidden rounded-20"
            >
              <div
                className={`relative w-full ${BANNER_ASPECT_CLASS}`}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, min(1440px, 100vw)"
                  loading={index === 0 ? "eager" : "lazy"}
                  priority={index === 0}
                  className="object-cover object-bottom"
                />
              </div>
            </div>
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}
