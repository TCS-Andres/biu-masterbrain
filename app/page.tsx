import SkipLink from "@/components/SkipLink";
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import SideNav from "@/components/SideNav";
import WhatIs from "@/components/WhatIs";
import FourParts from "@/components/FourParts";
import HowItWorks from "@/components/HowItWorks";
import Builder from "@/components/builder/Builder";
import PutToWork from "@/components/PutToWork";
import About from "@/components/About";
import Agenda from "@/components/Agenda";
import SiteFooter from "@/components/SiteFooter";

export default function Page() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="contenido" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14 xl:gap-20">
            <SideNav />
            <div className="min-w-0 max-w-4xl">
              <WhatIs />
              <FourParts />
              <HowItWorks />
              <Builder />
              <PutToWork />
              <About />
              <Agenda />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
