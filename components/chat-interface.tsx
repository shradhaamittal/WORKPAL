"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, Mic, Bot, User, Clock, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { chatService, type ChatMessage } from "@/lib/chat-service"

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize messages and set up listener
    setMessages(chatService.getMessages())

    const unsubscribe = chatService.onMessagesUpdate((updatedMessages) => {
      setMessages(updatedMessages)
      setIsTyping(false)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    setIsTyping(true)
    const userInput = input
    setInput("")

    try {
      await chatService.processUserMessage(userInput)
    } catch (error) {
      console.error("Error processing message:", error)
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case "processing":
        return <Clock className="h-3 w-3 text-yellow-500 animate-spin" />
      case "pending":
        return <Clock className="h-3 w-3 text-gray-400" />
      default:
        return null
    }
  }

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "processing":
        return "bg-yellow-500 animate-pulse"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-300"
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex gap-4", message.type === "user" && "justify-end")}>
              {message.type !== "user" && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}

              <div className={cn("flex flex-col gap-2 max-w-2xl", message.type === "user" && "items-end")}>
                <Card className={cn("p-4", message.type === "user" ? "bg-primary text-primary-foreground" : "bg-card")}>
                  <div className="space-y-3">
                    <p className="text-sm leading-relaxed">{message.content}</p>

                    {message.workflow && (
                      <div className="space-y-3 pt-3 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm font-medium">{message.workflow.name}</span>
                          <Badge
                            variant={message.workflow.status === "completed" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {message.workflow.status}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          {message.workflow.steps.map((step, index) => (
                            <div key={step.id} className="flex items-start gap-3 text-sm">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <div
                                  className={cn("w-3 h-3 rounded-full flex-shrink-0", getStepStatusColor(step.status))}
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-medium text-xs">{step.department}:</span>
                                    <span className="text-xs">{step.action}</span>
                                  </div>
                                  {step.data && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {step.data.internStudents && (
                                        <span>Found {step.data.internStudents.length} students</span>
                                      )}
                                      {step.data.subjectChanges && <span>Applied subject swap rules</span>}
                                      {step.data.approvalStatus && <span>Approved by {step.data.approvedBy}</span>}
                                      {step.data.updatedRecords && (
                                        <span>Updated {step.data.updatedRecords} records</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {getStatusIcon(step.status)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {message.department && (
                    <Badge variant="outline" className="text-xs">
                      {message.department}
                    </Badge>
                  )}
                  {message.status && (
                    <Badge variant={message.status === "completed" ? "default" : "secondary"} className="text-xs">
                      {message.status}
                    </Badge>
                  )}
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>

              {message.type === "user" && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <Card className="p-4 bg-card">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">WorkPal is coordinating with departments...</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-border p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask WorkPal to help with any departmental task..."
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            WorkPal can coordinate with HR, Finance, Academics, IT, and other departments to handle your requests.
          </p>
        </div>
      </div>
    </div>
  )
}
