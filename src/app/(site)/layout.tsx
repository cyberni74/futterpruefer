import { SiteHeader } from "@/components/site-header";
import { BottomBar } from "@/components/bottom-bar";
import { SiteFooter } from "@/components/site-footer";
import { CookieBanner } from "@/components/cookie-banner";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#inhalt" className="skip-link">Zum Inhalt springen</a>
      <SiteHeader />
      <main id="inhalt" className="pt-[calc(env(safe-area-inset-top)+4.5rem)] md:pt-24">{children}</main>
      <SiteFooter />
      <BottomBar />
      <CookieBanner />
    </>
  );
}
