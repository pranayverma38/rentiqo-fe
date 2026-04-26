import React from "react";

const policyItemTextClassName =
  "policy-text text-caption-02 !text-[14px] !leading-[20px] md:!text-[16px] md:!leading-[22px] text-uppercase ![font-weight:625]";

const policyIconClassName =
  "![font-size:22px] ![line-height:1] md:![font-size:26px]";

function InfiniteSlide() {
  return (
    <>
      <div className="infiniteSlide-policy style-2 wow fadeInUp md:mx-auto md:max-w-[1425px]">
        <div className="infiniteslide_wrap">
          <div className="infiniteSlide infinite-slider infiniteSlide-wrapper infiniteSlide-wrapper--policy-pairs">
            {Array.from({ length: 4 }).map((_, index) => (
              <React.Fragment key={index}>
                <i className={`icon icon-Lightning-1 ${policyIconClassName}`} />
                <p className={policyItemTextClassName}>Free Installation</p>
                <i className={`icon icon-Package ${policyIconClassName}`} />
                <p className={policyItemTextClassName}>Free Relocation</p>
                <i className={`icon icon-ArrowUDownLeft ${policyIconClassName}`} />
                <p className={policyItemTextClassName}>Free Cancellation</p>
                <i className={`icon icon-SealPercent ${policyIconClassName}`} />
                <p className={policyItemTextClassName}>Great prices</p>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default InfiniteSlide;
