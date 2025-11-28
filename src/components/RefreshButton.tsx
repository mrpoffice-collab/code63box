'use client'

export default function RefreshButton() {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <button
      onClick={handleRefresh}
      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors"
      aria-label="Refresh"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
      </svg>
    </button>
  )
}
