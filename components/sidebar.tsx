"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  Users,
  Building2,
  GraduationCap,
  CreditCard,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Bot,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { agentManager } from "@/lib/agents/agent-manager"

const departmentIcons: Record<string, any> = {
  hr: Users,
  finance: CreditCard,
  academics: GraduationCap,
  tnp: Building2,
  it: Settings,
  admin: BarChart3,
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeChat, setActiveChat] = useState<string | null>("general")
  const [agentStatuses, setAgentStatuses] = useState<Record<string, string>>({})

  useEffect(() => {
    // Get initial agent statuses
    const statuses = agentManager.getAllAgentStatuses()
    setAgentStatuses(statuses)

    // Set up periodic status updates
    const interval = setInterval(() => {
      const updatedStatuses = agentManager.getAllAgentStatuses()
      setAgentStatuses(updatedStatuses)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const agents = agentManager.getAllAgents()

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "online":
        return "default"
      case "busy":
        return "secondary"
      case "offline":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-600"
      case "busy":
        return "text-yellow-600"
      case "offline":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-80",
      )}
    >
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-sidebar-primary" />
              <span className="font-semibold text-sidebar-foreground">Departments</span>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          <Button
            variant={activeChat === "general" ? "secondary" : "ghost"}
            className={cn("w-full justify-start gap-3 mb-2", collapsed && "justify-center px-2")}
            onClick={() => setActiveChat("general")}
          >
            <MessageSquare className="h-4 w-4" />
            {!collapsed && <span>General Chat</span>}
          </Button>

          {!collapsed && (
            <div className="px-2 py-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Department Agents</h3>
            </div>
          )}

          <div className="space-y-1">
            {agents.map((agent) => {
              const agentId = agent.getId()
              const agentName = agent.getName()
              const status = agentStatuses[agentId] || "offline"
              const IconComponent = departmentIcons[agentId] || Users
              const capabilities = agent.getCapabilities()

              return (
                <div key={agentId} className="relative">
                  <Button
                    variant={activeChat === agentId ? "secondary" : "ghost"}
                    className={cn("w-full justify-start gap-3", collapsed && "justify-center px-2")}
                    onClick={() => setActiveChat(agentId)}
                  >
                    <IconComponent className="h-4 w-4" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{agentName}</span>
                        <Badge variant={getStatusVariant(status)} className="text-xs">
                          {status}
                        </Badge>
                      </>
                    )}
                  </Button>

                  {!collapsed && activeChat === agentId && (
                    <div className="mt-2 ml-6 p-2 bg-muted/50 rounded-md">
                      <div className="text-xs text-muted-foreground mb-2">
                        <span className="font-medium">Status:</span>{" "}
                        <span className={getStatusColor(status)}>{status}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Capabilities:</span>
                        <ul className="mt-1 space-y-1">
                          {capabilities.slice(0, 3).map((cap, index) => (
                            <li key={index} className="text-xs">
                              • {cap.description}
                            </li>
                          ))}
                          {capabilities.length > 3 && (
                            <li className="text-xs text-muted-foreground">+{capabilities.length - 3} more...</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
