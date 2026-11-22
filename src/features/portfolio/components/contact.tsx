import { ApprovedBySanjay } from "@/components/approved-by-sanjay"
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "@/features/portfolio/components/panel"
import { PanelTitleCopy } from "@/features/portfolio/components/panel-title-copy"
import { SOCIAL_ICONS } from "@/features/portfolio/components/social-link-icons"
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links"
import { UTM_PARAMS } from "@/config/site"
import { addQueryParams } from "@/utils/url"

const ID = "contact"

export function Contact() {
  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Contact</a>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <PanelContent className="space-y-8">
        {/* Invitation */}
        <p className="text-base text-muted-foreground max-w-prose">
          Have an idea, opportunity, or just want to connect? I&apos;d be happy
          to hear from you!
        </p>

        {/* Social links row */}
        <ul className="flex flex-wrap gap-3">
          {SOCIAL_LINKS.map((item) => (
            <li key={item.name}>
              <a
                href={addQueryParams(item.href, UTM_PARAMS)}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted text-sm font-mono text-foreground/80 hover:text-foreground transition-colors [&_svg]:size-4 [&_svg]:shrink-0"
              >
                {SOCIAL_ICONS[item.name]}
                <span>{item.handle}</span>
              </a>
            </li>
          ))}
        </ul>

        {/* Animated signature card */}
        <div className="flex justify-start">
          <ApprovedBySanjay
            refCode="#042"
            headerTitle="Details"
            headerSubtitle="Making Software"
            signerName="SANJAY"
            autoPlayOnMount={true}
          />
        </div>
      </PanelContent>
    </Panel>
  )
}
