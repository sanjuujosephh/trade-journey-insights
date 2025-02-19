
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TradeEntry from "@/components/TradeEntry";
import Analytics from "@/components/Analytics";
import LearningCenter from "@/components/LearningCenter";

export default function Index() {
  const [activeTab, setActiveTab] = useState("trade-entry");

  return (
    <div className="h-[calc(100vh-4rem)] bg-background">
      <div className="container h-full px-4 py-6">
        <header className="mb-4">
          <h1 className="text-4xl font-bold tracking-tight">Trading Journal</h1>
          <p className="text-muted-foreground mt-2">Track, analyze, and improve your trading performance</p>
        </header>

        <Card className="h-[calc(100%-7rem)]">
          <Tabs defaultValue="trade-entry" className="h-full" onValueChange={setActiveTab}>
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
            
            <div className="h-[calc(100%-3rem)] overflow-hidden">
              <TabsContent
                value="trade-entry"
                className="mt-0 h-full data-[state=active]:animate-fade-in"
              >
                <TradeEntry />
              </TabsContent>

              <TabsContent
                value="analytics"
                className="mt-0 h-full data-[state=active]:animate-fade-in"
              >
                <Analytics />
              </TabsContent>

              <TabsContent
                value="learning"
                className="mt-0 h-full data-[state=active]:animate-fade-in"
              >
                <LearningCenter />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
