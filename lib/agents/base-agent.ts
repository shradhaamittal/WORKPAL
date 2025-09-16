// Base class for all departmental agents
export interface AgentCapability {
  name: string
  description: string
  requiredParams: string[]
  optionalParams?: string[]
}

export interface AgentPolicy {
  name: string
  rules: Record<string, any>
  description: string
}

export interface AgentAction {
  id: string
  type: string
  description: string
  status: "pending" | "processing" | "completed" | "failed"
  result?: any
  error?: string
}

export abstract class BaseAgent {
  protected id: string
  protected name: string
  protected capabilities: AgentCapability[]
  protected policies: AgentPolicy[]
  protected status: "online" | "busy" | "offline" = "online"

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
    this.capabilities = []
    this.policies = []
  }

  abstract initialize(): void

  getId(): string {
    return this.id
  }

  getName(): string {
    return this.name
  }

  getCapabilities(): AgentCapability[] {
    return this.capabilities
  }

  getPolicies(): AgentPolicy[] {
    return this.policies
  }

  getStatus(): "online" | "busy" | "offline" {
    return this.status
  }

  setStatus(status: "online" | "busy" | "offline"): void {
    this.status = status
  }

  canHandle(capability: string): boolean {
    return this.capabilities.some((cap) => cap.name === capability)
  }

  abstract processAction(action: AgentAction): Promise<AgentAction>

  protected validateParams(action: AgentAction, requiredParams: string[]): boolean {
    if (!action.result) return false
    return requiredParams.every((param) => action.result[param] !== undefined)
  }

  protected applyPolicy(policyName: string, data: any): any {
    const policy = this.policies.find((p) => p.name === policyName)
    if (!policy) return data

    // Apply policy rules to data
    return this.transformDataWithPolicy(data, policy.rules)
  }

  protected transformDataWithPolicy(data: any, rules: Record<string, any>): any {
    // Base implementation - can be overridden by specific agents
    return { ...data, appliedRules: rules }
  }
}
