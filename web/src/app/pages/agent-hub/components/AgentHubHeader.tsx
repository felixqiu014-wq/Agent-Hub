import { Plus } from 'lucide-react'
import { Button } from '../../../../components/ui/Button'
import { SearchField } from '../../../../components/ui/SearchField'

interface AgentHubHeaderProps {
  keyword: string
  operator: string
  onCreate: () => void
  onKeywordChange: (value: string) => void
}

export function AgentHubHeader({
  keyword,
  operator,
  onCreate,
  onKeywordChange,
}: AgentHubHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[1240px] items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-brand)] text-lg font-bold text-white">
            A
          </div>
          <div>
            <div className="text-lg font-semibold text-slate-950">AgentHub</div>
            <div className="mt-1 text-sm text-slate-500">Workspace: {operator}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SearchField
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="搜索实例名称、命名空间、模板或模型..."
            value={keyword}
          />
          <Button leading={<Plus size={18} />} onClick={onCreate}>
            创建 Agent
          </Button>
        </div>
      </div>
    </header>
  )
}
