import { SITE_INFO } from "@/config/site"
import { markdownResponse } from "@/lib/markdown-response"

const content = `# ${SITE_INFO.name}

> ${SITE_INFO.description}

- [About](${SITE_INFO.url}/#hello): A quick intro — who I am, what I'm learning, and my tech stack.
- [Education](${SITE_INFO.url}/#education): My academic background at MSAJCE, CSE department.
- [Skills](${SITE_INFO.url}/#stack): Technologies I'm learning and tools I use.
`

export const revalidate = false
export const dynamic = "force-static"

export async function GET() {
  return markdownResponse(content, { negotiated: true })
}
