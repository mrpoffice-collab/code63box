import { notFound } from 'next/navigation'
import Link from 'next/link'
import { apps } from '@/config/apps'
import ShareButton from '@/components/ShareButton'

type Params = Promise<{ slug: string }>

export default async function AppViewer({
  params,
}: {
  params: Params
}) {
  const { slug } = await params
  const app = apps.find((a) => a.slug === slug)

  if (!app) {
    notFound()
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-900">
      {/* Minimal Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-slate-800/80 backdrop-blur-sm">
        <Link
          href="/"
          className="flex items-center gap-2 text-white hover:text-slate-300 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-sm font-medium">Home</span>
        </Link>

        <div className="flex items-center gap-2">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ backgroundColor: app.color }}
          >
            {app.icon}
          </span>
          <span className="text-white font-medium">{app.title}</span>
        </div>

        <ShareButton title={app.title} />
      </header>

      {/* App iframe */}
      <main className="flex-1">
        <iframe
          src={app.embedUrl}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          title={app.title}
        />
      </main>
    </div>
  )
}

// Generate static params for all apps
export async function generateStaticParams() {
  return apps.map((app) => ({
    slug: app.slug,
  }))
}
