import { USER } from "@/features/portfolio/data/user"

export default function Page() {
  return (
    <div className="max-w-screen overflow-x-clip">
      <div className="mx-auto flex h-screen flex-col items-center justify-center md:max-w-3xl">
        <h1 className="text-6xl font-bold">{USER.displayName}</h1>
        <p className="mt-4 text-2xl text-muted-foreground">{USER.jobTitle}</p>
      </div>
    </div>
  )
}
