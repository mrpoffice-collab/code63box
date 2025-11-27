import { STATUS_CONFIG, AppStatus } from '@/config/apps'

export default function StatusLegend() {
  const statuses: AppStatus[] = ['idea', 'building', 'testing', 'mvp', 'shipped']

  return (
    <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-500">
      {statuses.map((status) => (
        <span key={status} className="flex items-center gap-1">
          <span>{STATUS_CONFIG[status].icon}</span>
          <span>{STATUS_CONFIG[status].label}</span>
        </span>
      ))}
    </div>
  )
}
