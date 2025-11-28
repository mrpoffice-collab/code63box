import AppTile from '@/components/AppTile'
import StatusLegend from '@/components/StatusLegend'
import RefreshButton from '@/components/RefreshButton'
import { getVisibleApps } from '@/config/apps'

type SearchParams = Promise<{ dev?: string }>

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const showAll = params.dev === 'true'
  const visibleApps = getVisibleApps(showAll)

  return (
    <div className="min-h-screen flex flex-col relative">
      <RefreshButton />

      {/* Header */}
      <header className="pt-12 pb-6 px-4 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Code63Labs
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {visibleApps.length} apps
        </p>
      </header>

      {/* App Grid */}
      <main className="flex-1 px-4 pb-8">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-4 gap-4 sm:gap-6">
            {visibleApps.map((app) => (
              <AppTile key={app.slug} app={app} />
            ))}
          </div>

          {visibleApps.length === 0 && (
            <div className="text-center text-slate-500 py-12">
              No apps yet. Add some to apps.ts!
            </div>
          )}
        </div>
      </main>

      {/* Footer with Status Legend */}
      <footer className="py-6 px-4 space-y-4">
        <StatusLegend />

        {/* Tip Button */}
        <div className="flex justify-center">
          <a
            href="https://buy.stripe.com/7sYcN5fWne9Pae10Md6Ri00"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-full transition-colors"
          >
            <span>☕</span>
            <span>Buy me a coffee</span>
          </a>
        </div>
      </footer>
    </div>
  )
}
