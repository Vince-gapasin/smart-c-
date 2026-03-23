import { useState } from "react";
import { User, Wallet, QrCode, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Card } from "../ui/card";
import { IdentityProfile } from "../vault/IdentityProfile";
import { SealedAssets } from "../vault/SealedAssets";
import { DetailedRecords } from "../vault/DetailedRecords";
import { CryptographicProof } from "../vault/CryptographicProof";
import { AuditStatus } from "../vault/AuditStatus";
import { PageTransition } from "../PageTransition";
import { useAuth } from "../../contexts/AuthContext";

export function CustomerVault() {
    const [activeTab, setActiveTab] = useState("credentials");
    const { user } = useAuth();

    const initials = user?.fullName
      ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
      : (user?.email?.[0] || "?").toUpperCase();

    return (
        <PageTransition>
            <div className="page-shell">
                <div className="page-container">
                    {/* Profile Header */}
                    <Card className="mb-6 border border-border/50 bg-card/60 backdrop-blur-xl">
                        <div className="p-grid-6 flex items-center gap-4">
                            <Avatar className="w-14 h-14 border-2 border-primary/20">
                                <AvatarFallback className="bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 text-white text-lg font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-xs text-muted-foreground font-mono">{user?.did || user?.email || "—"}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Content */}
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="w-full mb-6 bg-secondary/50 backdrop-blur p-1">
                            <TabsTrigger
                                value="credentials"
                                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
                            >
                                <Wallet className="w-4 h-4 mr-2" />
                                Credentials
                            </TabsTrigger>
                            <TabsTrigger
                                value="profile"
                                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                            >
                                <User className="w-4 h-4 mr-2" />
                                LumenID Profile
                            </TabsTrigger>
                            <TabsTrigger
                                value="share"
                                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
                            >
                                <QrCode className="w-4 h-4 mr-2" />
                                Share
                            </TabsTrigger>
                            <TabsTrigger
                                value="audit"
                                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
                            >
                                <Shield className="w-4 h-4 mr-2" />
                                Audit
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="credentials">
                            <SealedAssets />
                        </TabsContent>

                        <TabsContent value="profile">
                            <IdentityProfile />
                        </TabsContent>

                        <TabsContent value="share">
                            <div className="space-y-6">
                                <DetailedRecords />
                                <CryptographicProof />
                            </div>
                        </TabsContent>

                        <TabsContent value="audit">
                            <AuditStatus />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </PageTransition>
    );
}