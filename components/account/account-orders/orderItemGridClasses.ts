/** Tailwind arbitrary grid: desktop 5-col; mobile image row-span-2 left, content right. */

export const ORDER_ITEM_GRID =
  "grid items-start gap-x-[12px] gap-y-[10px] rounded-[10px] border border-[var(--line)] bg-white p-[14px] max-md:grid-cols-[72px_1fr_1fr_1fr] max-md:grid-rows-[auto_auto] md:grid-cols-[80px_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-[16px] md:gap-y-[12px]";

export const ORDER_ITEM_CELL_IMAGE =
  "min-w-0 max-md:col-start-1 max-md:row-start-1 max-md:row-span-2 md:col-start-1 md:row-span-1";

export const ORDER_ITEM_CELL_NAME =
  "flex min-w-0 items-center max-md:col-span-3 max-md:col-start-2 max-md:row-start-1 max-md:items-start md:col-start-2";

export const ORDER_ITEM_CELL_TENURE =
  "min-w-0 max-md:col-start-2 max-md:row-start-2 md:col-start-3";

export const ORDER_ITEM_CELL_RENT =
  "min-w-0 max-md:col-start-3 max-md:row-start-2 md:col-start-4";

export const ORDER_ITEM_CELL_DEPOSIT =
  "min-w-0 max-md:col-start-4 max-md:row-start-2 md:col-start-5";

export const ORDER_ITEM_FIELD =
  "flex min-w-0 flex-col gap-[4px]";

export const ORDER_ITEM_FIELD_LABEL =
  "text-[11px] leading-[1.2] tracking-[0.03em] uppercase cl-text-2 max-md:text-[10px]";

export const ORDER_ITEM_FIELD_VALUE =
  "text-[14px] leading-[1.35] break-words text-[var(--text)] max-md:text-[13px]";

export const ORDER_ITEM_THUMB =
  "relative size-[72px] shrink-0 overflow-hidden rounded-[8px] border border-[var(--line)] bg-[var(--bg)] md:size-[80px]";

export const ORDER_ITEM_NAME =
  "mb-0 text-[14px] leading-[1.4] font-medium break-words";
