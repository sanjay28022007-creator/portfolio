import type { Metadata } from "next"
import type { ProfilePage, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { SITE_OPEN_GRAPH } from "@/config/site"
import { JsonLdScript } from "@/lib/json-ld"
import { absoluteUrl, cn } from "@/lib/utils"
import { Contact } from "@/features/portfolio/components/contact"
import { Education } from "@/features/portfolio/components/education"
import { FrameWidthDimension } from "@/features/portfolio/components/frame-width-dimension"
import { Hello } from "@/features/portfolio/components/hello"
import { Overview } from "@/features/portfolio/components/overview"
import { ProfileHeader } from "@/features/portfolio/components/profile-header"
import { SeparatorHeightDimension } from "@/features/portfolio/components/separator-height-dimension"
import { SocialLinks } from "@/features/portfolio/components/social-links"
import { TechStack } from "@/features/portfolio/components/tech-stack"
import { USER } from "@/features/portfolio/data/user"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    ...SITE_OPEN_GRAPH,
  },
}

export default function HomePage() {
  return (
    <>
      <JsonLdScript data={getProfilePageJsonLd()} />

      <div className="[--separator-height:--spacing(8)] **:data-[slot=panel]:scroll-mt-[calc(var(--header-height)+var(--separator-height))]">
        <div className="mx-auto md:max-w-3xl">
          <FrameWidthDimension />
          <ProfileHeader />
          <Separator>
            <SeparatorHeightDimension className="hidden lg:block" height={32} />
          </Separator>

          <Overview />
          <SocialLinks />
          <Separator />

          <Hello />
          <Separator />

          <TechStack />
          <Separator />

          <Education />
          <Separator />

          <Contact />
        </div>
      </div>
    </>
  )
}

function getProfilePageJsonLd(): WithContext<ProfilePage> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": absoluteUrl("/"),
    dateCreated: new Date(USER.dateCreated).toISOString(),
    dateModified: new Date().toISOString(),
    mainEntity: { "@id": JSON_LD_ID.person },
  }
}

function Separator({ className, children }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "stripe-divider h-(--separator-height) w-full border-x border-x-line",
        className
      )}
    >
      {children}
    </div>
  )
}
