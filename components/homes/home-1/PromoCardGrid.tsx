import Image from "next/image";

type PromoCardItem = {
  id: string;
  label: string;
  /** Optional image; placeholder block is shown when omitted */
  imageSrc?: string;
  imageAlt?: string;
};

const DEFAULT_ITEMS: PromoCardItem[] = [
  { id: "1", label: "BEDROOM" },
  { id: "2", label: "LIVING ROOM" },
  { id: "3", label: "STUDY ROOM" },
  { id: "4", label: "COMBOS" },
  { id: "5", label: "TEXT HERE" },
];

type PromoCardGridProps = {
  items?: PromoCardItem[];
};

function PromoCard({
  item,
  variant,
}: {
  item: PromoCardItem;
  variant: "compact" | "wide";
}) {
  const compactSwatchShape = "aspect-[1/1] w-full";

  const shadowCard =
    "shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1),0_2px_4px_-2px_rgb(0_0_0/0.1)] md:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)]";

  if (variant === "wide") {
    return (
      <div
        className={`relative min-h-0 w-full overflow-hidden rounded-[1.25rem] bg-[#48B47B] ${shadowCard} aspect-[2.75/1] md:rounded-[1.5rem]`}
      >
        {item.imageSrc ? (
          <Image
            src={item.imageSrc}
            alt={item.imageAlt ?? item.label}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 35vw"
          />
        ) : null}
      </div>
    );
  }

  return (
    <article
      className={`flex min-w-[0] flex-col rounded-[1.5rem] bg-white p-[4px] ${shadowCard} md:rounded-[1.75rem] md:p-[8px]`}
    >
      <div
        className={`relative w-full overflow-hidden rounded-[1.25rem] bg-[#48B47B] ${compactSwatchShape}`}
      >
        {item.imageSrc ? (
          <Image
            src={item.imageSrc}
            alt={item.imageAlt ?? item.label}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 20vw"
          />
        ) : null}
      </div>
      <div className="px-[0.25rem] pt-[0.45rem] pb-[0.25rem] text-center font-sans text-[0.525rem] font-medium uppercase leading-[1.375] tracking-[0.025em] text-[#000000] md:pt-[0.5rem] md:pb-[1px] md:text-[0.875rem] md:leading-[1.25rem]">
        {item.label}
      </div>
    </article>
  );
}

function PromoCardGrid({ items = DEFAULT_ITEMS }: PromoCardGridProps) {
  const list = items.length >= 5 ? items.slice(0, 5) : DEFAULT_ITEMS;
  const [a, b, c, d, wide] = list;

  return (
    <section className="promo-card-grid-section bg-[#fafafa] py-[1.5rem] md:py-[60px]">
      <div className="container">
        <div className="grid grid-cols-4 gap-x-[0.5rem] gap-y-[0.9rem] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,3.35fr)] md:gap-[0.75rem]">
          {[a, b, c, d].map((item) => (
            <div key={item.id} className="col-span-[1] min-h-0 min-w-[0]">
              <PromoCard item={item} variant="compact" />
            </div>
          ))}
          {wide ? (
            <div className="col-span-[4] h-full min-h-0 min-w-[0] md:col-span-[1]">
              <PromoCard item={wide} variant="wide" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default PromoCardGrid;
