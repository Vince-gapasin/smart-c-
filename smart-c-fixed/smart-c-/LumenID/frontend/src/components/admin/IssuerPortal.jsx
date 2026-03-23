import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from "../ui/card";
import { NewIssuance } from "../issuer/NewIssuance";
import { IdentityLogs } from "../issuer/IdentityLogs";
import { LegalStanding } from "../issuer/LegalStanding";
import { PageTransition } from "../PageTransition";
import { IssuerIcon, MintCredentialIcon, ActivityLogsIcon, LegalStandingIcon } from "../icons/LumenIcons";
import { useAuth } from "../../contexts/AuthContext";

export function IssuerPortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("issuance");

  return (
    <PageTransition>
      <div className="page-shell">
        <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-section-medium)' }}>
          {/* Institution Header */}
          <Card className="border border-border/50 bg-card/60 backdrop-blur-xl hover:border-primary/30 transition-all shadow-lg">
            <div className="p-grid-6">
              <div className="flex items-center gap-grid-4">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 flex-shrink-0">
                  <IssuerIcon size={28} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent mb-1">
                    {user?.fullName || "LumenID University"}
                  </h1>
                  <p className="text-sm text-muted-foreground font-mono truncate">{user?.did || "did:lumen:issuer:unknown"}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full bg-card/60 backdrop-blur-xl border border-border/50 shadow-lg rounded-xl p-1 h-auto">
              <div className="grid grid-cols-3 gap-1 w-full">
                <TabsTrigger
                  value="issuance"
                  className="
                    relative h-14 rounded-lg
                    data-[state=active]:bg-gradient-to-r
                    data-[state=active]:from-violet-500
                    data-[state=active]:to-purple-500
                    data-[state=active]:text-white
                    data-[state=active]:shadow-lg
                    data-[state=active]:shadow-violet-500/30
                    data-[state=inactive]:text-muted-foreground
                    data-[state=inactive]:hover:bg-secondary/50
                    data-[state=inactive]:hover:text-foreground
                    transition-all duration-300
                    font-medium
                  "
                >
                  <div className="flex items-center justify-center gap-2">
                    <MintCredentialIcon size={18} />
                    <span>Issue</span>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="logs"
                  className="
                    relative h-14 rounded-lg
                    data-[state=active]:bg-gradient-to-r
                    data-[state=active]:from-cyan-500
                    data-[state=active]:to-blue-500
                    data-[state=active]:text-white
                    data-[state=active]:shadow-lg
                    data-[state=active]:shadow-cyan-500/30
                    data-[state=inactive]:text-muted-foreground
                    data-[state=inactive]:hover:bg-secondary/50
                    data-[state=inactive]:hover:text-foreground
                    transition-all duration-300
                    font-medium
                  "
                >
                  <div className="flex items-center justify-center gap-2">
                    <ActivityLogsIcon size={18} />
                    <span>Logs</span>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="legal"
                  className="
                    relative h-14 rounded-lg
                    data-[state=active]:bg-gradient-to-r
                    data-[state=active]:from-emerald-500
                    data-[state=active]:to-teal-500
                    data-[state=active]:text-white
                    data-[state=active]:shadow-lg
                    data-[state=active]:shadow-emerald-500/30
                    data-[state=inactive]:text-muted-foreground
                    data-[state=inactive]:hover:bg-secondary/50
                    data-[state=inactive]:hover:text-foreground
                    transition-all duration-300
                    font-medium
                  "
                >
                  <div className="flex items-center justify-center gap-2">
                    <LegalStandingIcon size={18} />
                    <span>Legal</span>
                  </div>
                </TabsTrigger>
              </div>
            </TabsList>

            <TabsContent value="issuance" className="mt-grid-8">
              <NewIssuance />
            </TabsContent>

            <TabsContent value="logs" className="mt-grid-8">
              <IdentityLogs />
            </TabsContent>

            <TabsContent value="legal" className="mt-grid-8">
              <LegalStanding />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
}