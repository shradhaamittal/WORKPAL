import { ChatInterface } from "@/components/chat-interface"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { WorkflowDemo } from "@/components/workflow-demo"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HomePage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-hidden">
          <Tabs defaultValue="chat" className="h-full">
            <div className="border-b border-border px-6">
              <TabsList className="grid w-full max-w-lg grid-cols-3">
                <TabsTrigger value="chat">Chat Interface</TabsTrigger>
                <TabsTrigger value="demo">Workflow Demo</TabsTrigger>
                <TabsTrigger value="admin">Admin Dashboard</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="h-full mt-0">
              <ChatInterface />
            </TabsContent>

            <TabsContent value="demo" className="h-full mt-0 p-6">
              <div className="h-full flex items-center justify-center">
                <WorkflowDemo />
              </div>
            </TabsContent>

            <TabsContent value="admin" className="h-full mt-0 p-6">
              <div className="h-full overflow-auto">
                <AdminDashboard />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
