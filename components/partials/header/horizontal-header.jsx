import React from "react";
import Link from "next/link";
import Image from "next/image";

const HorizontalHeader = () => {
  return (
    <div className="flex items-center lg:gap-12 gap-3 ">
      <div>
        <Link
          href="/en/user/orders"
          className="text-primary flex items-center gap-2"
        >
          <Image
            src="/images/touchtek/logo/touchtek.png"
            alt="Touchtek"
            width={140}
            height={35}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>
      </div>
    </div>
  );
};

export default HorizontalHeader;
