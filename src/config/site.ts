import type { Metadata, Route } from "next"

import type { NavItem } from "@/types/nav"
import { SOCIAL } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

export const SITE_INFO = {
  name: USER.displayName,
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: USER.ogImage,
  ogVideo: USER.ogVideo,
  description: USER.bio,
  keywords: USER.keywords,
}

// Metadata merges shallowly, so a page's openGraph must spread this to keep it.
export const SITE_OPEN_GRAPH = {
  siteName: SITE_INFO.name,
  url: "/",
  type: "profile",
  locale: "en_US",
  firstName: USER.firstName,
  lastName: USER.lastName,
  username: USER.username,
  gender: USER.gender,
  images: [
    {
      url: SITE_INFO.ogImage,
      width: 1200,
      height: 630,
      alt: SITE_INFO.name,
    },
  ],
} satisfies Metadata["openGraph"]

export const LICENSE = {
  name: "MIT License",
  url: "https://github.com/sanjay/portfolio/blob/main/LICENSE",
}

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}

export const MAIN_NAV: NavItem<Route>[] = [
  {
    title: "About",
    href: "/#hello",
  },
  {
    title: "Skills",
    href: "/#stack",
  },
  {
    title: "Education",
    href: "/#education",
  },
  {
    title: "Contact",
    href: "/#contact",
  },
]

export const MOBILE_NAV: NavItem<Route>[] = [
  {
    title: "Home",
    href: "/",
  },
  ...MAIN_NAV,
]

export const X_HANDLE = SOCIAL.x.handle
export const GITHUB_USERNAME = SOCIAL.github.handle
export const SOURCE_CODE_GITHUB_REPO = "sanjay/portfolio"
export const SOURCE_CODE_GITHUB_URL = "https://github.com/sanjay/portfolio"

export const SPONSORSHIP_URL = "https://github.com/sanjay"

export const UTM_PARAMS = {
  utm_source: "sanjay.dev",
}
