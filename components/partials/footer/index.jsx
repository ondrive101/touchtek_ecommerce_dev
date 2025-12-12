import React from "react";
import { useSidebar, useThemeStore } from "@/store";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import MobileFooter from "./mobile-footer";
import FooterLayout from "./footer-layout";
import { useMounted } from "@/hooks/use-mounted";
// import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

const Footer = ({ handleOpenSearch }) => {
  const { collapsed, sidebarType } = useSidebar();
  const { layout, footerType } = useThemeStore();
  const mounted = useMounted();
  const isMobile = useMediaQuery("(min-width: 768px)");

  if (!mounted) {
    return null;
  }
  if (!isMobile && sidebarType === "module") {
    return <MobileFooter handleOpenSearch={handleOpenSearch} />;
  }

  if (footerType === "hidden") {
    return null;
  }

  if (layout === "semibox") {
    return (
      <div className="xl:mx-20 mx-6">
        <FooterLayout
          className={cn(" rounded-md border", {
            "ltr:xl:ml-[72px] rtl:xl:mr-[72px]": collapsed,
            "ltr:xl:ml-[272px] rtl:xl:mr-[272px]": !collapsed,
            "sticky bottom-0": footerType === "sticky",
          })}
        >
          <FooterContent />
        </FooterLayout>
      </div>
    );
  }
  if (sidebarType !== "module" && layout !== "horizontal") {
    return (
      <FooterLayout
        className={cn("", {
          "ltr:xl:ml-[248px] rtl:xl:mr-[248px]": !collapsed,
          "ltr:xl:ml-[72px] rtl:xl:mr-[72px]": collapsed,
          "sticky bottom-0": footerType === "sticky",
        })}
      >
        <FooterContent />
      </FooterLayout>
    );
  }

  if (layout === "horizontal") {
    return (
      <FooterLayout
        className={cn("", {
          "sticky bottom-0": footerType === "sticky",
        })}
      >
        <FooterContent />
      </FooterLayout>
    );
  }

  return (
    <FooterLayout
      className={cn("", {
        "ltr:xl:ml-[300px] rtl:xl:mr-[300px]": !collapsed,
        "ltr:xl:ml-[72px] rtl:xl:mr-[72px]": collapsed,
        "sticky bottom-0": footerType === "sticky",
      })}
    >
      <FooterContent />
    </FooterLayout>
  );
};

export default Footer;

const FooterContent = () => {
  return (
    <div className="flex items-center justify-between gap-2 md:gap-4 text-muted-foreground text-center text-xs md:text-sm">


<div className="flex space-x-4 justify-center">
  
      {/* Website */}
      <a
        href="https://touchtek.in/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Website"
      >
        <Icon icon="mdi:web" className="md:size-5 size-4 hover:opacity-80 transition" />
      </a>
      {/* Instagram */}
      <a
        href="https://www.instagram.com/touchtekindia?igsh=enc1dWFzMWY2NWg1"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
      >
        <Icon icon="mdi:instagram" className="md:size-5 size-4 hover:opacity-80 transition" />
      </a>


      {/* Facebook */}
      <a
        href="https://www.facebook.com/people/Touchtek-India/61573722944708/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
      >
        <Icon icon="ic:round-facebook" className="md:size-5 size-4 hover:opacity-80 transition" />
      </a>

      {/* YouTube */}
      <a
        href="https://youtube.com/@touchtekindia?si=I1wDSVpTaW0CPaEx"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="YouTube"
      >
        <Icon icon="mdi:youtube" className="md:size-5 size-4 hover:opacity-80 transition" />
      </a>
    </div>
      {/* Center: Copyright */}
      <p>
  <span className="md:hidden">© {new Date().getFullYear()} Touchtek</span>
  <span className="hidden md:inline">COPYRIGHT © Touchtek {new Date().getFullYear()} All rights Reserved</span>
</p>

      {/* Right: Version Number */}
      <div className="font-medium">Version: H.V.01</div>
    </div>
  );
};
