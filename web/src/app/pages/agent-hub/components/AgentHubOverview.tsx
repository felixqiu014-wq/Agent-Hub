interface AgentHubOverviewProps {
  message: string
}

export function AgentHubOverview({ message }: AgentHubOverviewProps) {
  return (
    <div className="mb-6 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <div className="pointer-events-none absolute right-[-84px] top-[-64px] h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.18),rgba(37,99,235,0))]" />
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)]">
            Backend Managed
          </div>
          <h1 className="mt-3 text-[28px] font-semibold leading-tight text-slate-950">
            所有实例操作统一走后端 API，前端不再直接编排 Kubernetes 资源。
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
            当前已切到 `/api/v1/agents` 和后端 WebSocket。创建、更新、删除、运行态切换与终端都经过统一后端；对话验证暂不可用，因为后端不会回显 Agent API Key。
          </p>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">当前能力</div>
        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
          <div>实例管理: 列表 / 创建 / 更新 / 删除</div>
          <div>运行态: 启动 / 暂停</div>
          <div>调试: 后端 WebSocket 终端</div>
        </div>
        {message ? (
          <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-900">{message}</div>
        ) : null}
      </div>
    </div>
  )
}
