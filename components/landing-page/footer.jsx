"use client"
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import footerImage from "@/public/images/landing-page/footer.png"
import facebook from "@/public/images/social/facebook-1.png"
import dribble from "@/public/images/social/dribble-1.png"
import linkedin from "@/public/images/social/linkedin-1.png"
import github from "@/public/images/social/github-1.png"
import behance from "@/public/images/social/behance-1.png"
import twitter from "@/public/images/social/twitter-1.png"
import youtube from "@/public/images/social/youtube.png"

const Footer = () => {
  const socials = [
    {
      icon: facebook,
      href: "https://www.facebook.com/people/Touchtek-India/61573722944708/"
    },
    {
      icon: linkedin,
      href: "https://www.linkedin.com/in/touchtek-india-499a08383/"
    },
    {
      icon: youtube,
      href: "https://youtube.com/@touchtekindia?si=I1wDSVpTaW0CPaEx"
    },
    {
      icon: twitter,
      href: "https://twitter.com/TouchtekIndia"
    }
  ]
  return (
    <footer
      className=" bg-cover bg-center bg-no-repeat relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-default-900/90 dark:before:bg-default-100"
      style={{
        background: `url(${footerImage.src})`
      }}
    >
      <div className="py-16 2xl:py-[120px]">
        <div className="max-w-[700px] mx-auto flex flex-col items-center relative">
          <Link
            href="/"
            className="inline-flex items-center gap-4 text-primary-foreground"
          >
            <Image
              src="/images/touchtek/logo/touchtek.png"
              alt="Touchtek"
              width={180}
              height={45}
              className="h-12 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <p className="text-base leading-7 text-default-200 dark:text-default-600 text-center mt-3">
            Touchtek delivers premium smart accessories, power banks, chargers, and audio gear built with cutting-edge technology.
          </p>
          <div className="mt-9 flex justify-center flex-wrap gap-4">
            <Button asChild variant="outline" className="rounded text-primary-foreground border-primary">
              <Link href="/en/products">Explore Products</Link>
            </Button>
            <Button asChild variant="outline" className="rounded text-primary-foreground border-primary">
              <Link href="/en/user/orders">My Orders</Link>
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center flex-wrap gap-5">
            {
              socials.map((item, index) => (
                <Link
                  href={item.href}
                  key={`social-link-${index}`}
                  target="_blank"
                >
                  <Image src={item.icon} alt="social" width={30} height={30} />
                </Link>
              ))
            }
          </div>
        </div>
      </div>
      <div className="relative bg-default-900 dark:bg-default-50 py-6">
        <div className="container flex flex-col text-center md:text-start md:flex-row gap-2">
          <p className="text-primary-foreground flex-1 text-base xl:text-lg font-medium">COPYRIGHT &copy;&nbsp;{new Date().getFullYear()}&nbsp;Touchtek All rights Reserved</p>
          <p className="text-primary-foreground flex-none text-base font-medium">
            Crafted with care by Touchtek
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;