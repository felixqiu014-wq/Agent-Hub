import { Cpu, Database, HardDrive } from 'lucide-react'
import { RESOURCE_PRESETS, resolveTemplateById } from '../../../domains/agents/templates'
import type { AgentBlueprint, AgentTemplateId } from '../../../domains/agents/types'
import type { ReactNode } from 'react'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { Modal } from '../../ui/Modal'

interface AgentConfigModalProps {
  open: boolean
  mode: 'create' | 'edit'
  templateId: AgentTemplateId
  blueprint: AgentBlueprint
  workspaceModelBaseURL: string
  workspaceModelKey: string
  workspaceModelKeyReady: boolean
  submitting: boolean
  onClose: () => void
  onChange: (field: keyof AgentBlueprint, value: string) => void
  onSelectPreset: (presetId: AgentBlueprint['profile']) => void
  onSubmit: () => void
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
        {icon}
        {label}
      </div>
      <div className="mt-3 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  )
}

export function AgentConfigModal({
  open,
  mode,
  templateId,
  blueprint,
  workspaceModelBaseURL,
  workspaceModelKey,
  workspaceModelKeyReady,
  submitting,
  onClose,
  onChange,
  onSelectPreset,
  onSubmit,
}: AgentConfigModalProps) {
  const template = resolveTemplateById(templateId)
  const isCustomPreset = blueprint.profile === 'custom'
  const resolvedModelBaseURL = workspaceModelBaseURL || blueprint.modelBaseURL
  const resolvedModelAPIKey = workspaceModelKey || '打开页面时自动检查，如缺失会先创建后填入'
  const createModeProviderText = 'OpenAI-compatible（固定走 AIProxy）'

  return (
    <Modal
      description={
        mode === 'create'
          ? '前端现在直接对接统一后端 API，由后端完成 DevBox / Service / Ingress 编排。'
          : `正在编辑 ${blueprint.aliasName || blueprint.appName} 的资源规格。`
      }
      footer={
        <>
          <Button onClick={onClose} variant="secondary">
            取消
          </Button>
          <Button disabled={submitting} onClick={onSubmit}>
            {submitting ? '部署中...' : mode === 'create' ? '确认部署' : '保存配置'}
          </Button>
        </>
      }
      onClose={onClose}
      open={open}
      title={mode === 'create' ? `配置 ${template.name}` : `配置 ${template.name}`}
      widthClassName="max-w-4xl"
    >
      <div className="space-y-6">
        <div className="flex items-start gap-4 rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-5">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <img alt={`${template.name} logo`} className="h-10 w-10 object-cover" src={template.logo} />
          </div>
          <div className="space-y-2">
            <div className="text-base font-semibold text-slate-950">{template.name}</div>
            <p className="max-w-2xl text-sm leading-6 text-slate-500">{template.description}</p>
          </div>
        </div>

        {mode === 'create' ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              hint="这是用户侧的展示名称；系统会自动生成一个技术实例名用于资源关联和账单查询。"
              label="别名"
              onChange={(event) => onChange('aliasName', event.target.value)}
              placeholder="例如：客服助手"
              value={blueprint.aliasName}
            />
            <Input disabled hint="实例会创建在当前工作区命名空间。" label="命名空间" value={blueprint.namespace} />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              hint="这是用户侧的展示名称。"
              label="别名"
              onChange={(event) => onChange('aliasName', event.target.value)}
              placeholder="例如：客服助手"
              value={blueprint.aliasName}
            />
            <Input
              disabled
              hint="技术实例名由系统生成，用于资源关联和账单查询。"
              label="实例名称"
              value={blueprint.appName}
            />
            <Input disabled label="命名空间" value={blueprint.namespace} />
          </div>
        )}

        <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-5">
          <div className="mb-4 text-sm font-semibold text-slate-950">资源规格</div>
          <div className="grid gap-3 lg:grid-cols-4">
            {RESOURCE_PRESETS.map((preset) => {
              const active = blueprint.profile === preset.id
              return (
                <button
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    active
                      ? 'border-slate-900 bg-slate-50 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.08)]'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                  }`}
                  key={preset.id}
                  onClick={() => onSelectPreset(preset.id)}
                  type="button"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-950">{preset.label}</span>
                    {active ? <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white">当前</span> : null}
                  </div>
                  <div className="mt-2 text-xs leading-5 text-slate-500">{preset.description}</div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <MetricCard icon={<Cpu size={14} />} label="默认镜像" value={template.image} />
          <MetricCard icon={<Database size={14} />} label="默认端口" value={String(template.port)} />
          <MetricCard icon={<HardDrive size={14} />} label="工作目录" value={template.defaultWorkingDirectory} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Input
            disabled={!isCustomPreset}
            label="CPU"
            onChange={(event) => onChange('cpu', event.target.value)}
            placeholder="例如 2000m"
            value={blueprint.cpu}
          />
          <Input
            disabled={!isCustomPreset}
            label="内存"
            onChange={(event) => onChange('memory', event.target.value)}
            placeholder="例如 4096Mi"
            value={blueprint.memory}
          />
          <Input
            label="存储"
            onChange={(event) => onChange('storageLimit', event.target.value)}
            placeholder="例如 10Gi"
            value={blueprint.storageLimit}
          />
        </div>

        {mode === 'create' ? (
          <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-5">
            <div className="text-sm font-semibold text-slate-950">模型接入</div>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Hermes Agent 会直接使用当前工作区的 AIProxy 配置。下面展示的 URL 和密钥，就是这次创建时会写入后端的实际值。
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Input
                className="font-mono text-xs"
                hint="根据当前集群自动推导，并写入 agent-model-baseurl。"
                label="AIProxy URL"
                readOnly
                value={resolvedModelBaseURL}
              />
              <Input
                className="font-mono text-xs"
                hint="打开页面时自动检查 Agent-Hub Key，并写入 agent-model-apikey。"
                label="AIProxy 密钥"
                readOnly
                value={resolvedModelAPIKey}
              />
              <Input
                hint="Provider 固定为 OpenAI-compatible，对用户不开放修改。"
                label="模型 Provider"
                readOnly
                value={createModeProviderText}
              />
              <Input
                hint="例如 gpt-4o-mini。"
                label="模型名称"
                onChange={(event) => onChange('model', event.target.value)}
                placeholder="例如 gpt-4o-mini"
                value={blueprint.model}
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              hint="对应后端 create / patch 请求中的 agent-model-provider。"
              label="模型 Provider"
              onChange={(event) => onChange('modelProvider', event.target.value)}
              placeholder="例如 openai"
              value={blueprint.modelProvider}
            />
            <Input
              hint="需要是 http 或 https URL。"
              label="模型 Base URL"
              onChange={(event) => onChange('modelBaseURL', event.target.value)}
              placeholder="例如 https://api.openai.com/v1"
              value={blueprint.modelBaseURL}
            />
          </div>
        )}

        {mode === 'create' ? null : (
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              hint="例如 gpt-4o-mini。"
              label="模型名称"
              onChange={(event) => onChange('model', event.target.value)}
              placeholder="例如 gpt-4o-mini"
              value={blueprint.model}
            />
            <Input
              disabled
              hint="由 Ingress 自动派生。"
              label="公网 API 地址"
              value={blueprint.apiUrl || '创建后自动生成'}
            />
            <Input
              disabled
              hint="后端不会回显明文 key；如需轮换，可走 rotate-key 接口。"
              label="Agent API Key"
              value={blueprint.apiKey || '后端安全策略：不回显'}
            />
          </div>
        )}

        {mode === 'create' ? (
          <div className="rounded-[24px] border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm leading-6 text-emerald-900">
            {workspaceModelKeyReady
              ? '当前工作区 AIProxy Key 已就绪。确认部署时，后端会把上面显示的 URL 和密钥直接注入 Hermes。'
              : '当前工作区 AIProxy Key 尚未就绪，暂时无法展示创建所需的真实密钥。'}
          </div>
        ) : null}

        <div className="rounded-[24px] border border-sky-100 bg-sky-50 px-5 py-4 text-sm leading-6 text-sky-900">
          当前页面已经改成通过后端统一管理 Agent。创建和更新只会调用后端 `/api/v1/agents`，前端不再直接并发创建底层 Kubernetes 资源。
        </div>
      </div>
    </Modal>
  )
}
