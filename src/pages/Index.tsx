
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TradeEntry from "@/components/TradeEntry";
import Analytics from "@/components/Analytics";
import LearningCenter from "@/components/LearningCenter";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Index() {
  const [activeTab, setActiveTab] = useState("trade-entry");

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Trading Journal</h1>
        <p className="text-muted-foreground mt-2">Track, analyze, and improve your trading performance</p>
      </header>

      <Card className="w-full max-w-[1400px] mx-auto">
        <Tabs defaultValue="trade-entry" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start border-b rounded-none px-6 bg-card">
            <TabsTrigger
              value="trade-entry"
              className="data-[state=active]:bg-background"
            >
              Trade Entry
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-background"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="learning"
              className="data-[state=active]:bg-background"
            >
              Learning Center
            </TabsTrigger>
          </TabsList>
          
          <div className="p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
            <TabsContent
              value="trade-entry"
              className="mt-0 space-y-4"
            >
              <TradeEntry />
            </TabsContent>

            <TabsContent
              value="analytics"
              className="mt-0 space-y-4"
            >
              <Analytics />
            </TabsContent>

            <TabsContent
              value="learning"
              className="mt-0 space-y-4"
            >
              <LearningCenter />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}
