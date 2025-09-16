// Agent Manager to coordinate all departmental agents
import type { BaseAgent } from "./base-agent"
import { HRAgent } from "./hr-agent"
import { AcademicsAgent } from "./academics-agent"
import { TNPAgent } from "./tnp-agent"

export class AgentManager {
  private agents: Map<string, BaseAgent> = new Map()

  constructor() {
    this.initializeAgents()
  }

  private initializeAgents(): void {
    const agents = [new HRAgent(), new AcademicsAgent(), new TNPAgent()]

    agents.forEach((agent) => {
      this.agents.set(agent.getId(), agent)
    })
  }

  getAgent(agentId: string): BaseAgent | undefined {
    return this.agents.get(agentId)
  }

  getAllAgents(): BaseAgent[] {
    return Array.from(this.agents.values())
  }

  getAgentsByCapability(capability: string): BaseAgent[] {
    return Array.from(this.agents.values()).filter((agent) => agent.canHandle(capability))
  }

  async delegateAction(agentId: string, action: any): Promise<any> {
    const agent = this.getAgent(agentId)
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`)
    }

    if (agent.getStatus() === "offline") {
      throw new Error(`Agent ${agentId} is offline`)
    }

    return await agent.processAction(action)
  }

  getAgentStatus(agentId: string): string {
    const agent = this.getAgent(agentId)
    return agent ? agent.getStatus() : "not_found"
  }

  getAllAgentStatuses(): Record<string, string> {
    const statuses: Record<string, string> = {}
    this.agents.forEach((agent, id) => {
      statuses[id] = agent.getStatus()
    })
    return statuses
  }
}

// Singleton instance
export const agentManager = new AgentManager()
