import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  CheckCircle2,
  Clock,
  TrendingUp,
  Activity
} from "lucide-react";
import { PageTransition, StaggerContainer, StaggerItem } from "../PageTransition";
import {
  IssuerIcon,
  MintCredentialIcon
} from "../icons/LumenIcons";
import { apiClient } from "../../lib/api-client";

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    { icon: MintCredentialIcon, label: "Credentials Issued", value: "—", change: "", gradient: "from-violet-500 to-purple-500" },
    { icon: Clock, label: "Pending Reviews", value: "—", change: "", gradient: "from-yellow-500 to-amber-500" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await apiClient.get("/admin/stats");
      if (res.success && Array.isArray(res.data)) {
        setStats([
          { icon: MintCredentialIcon, label: res.data[0]?.label || "Credentials Issued", value: res.data[0]?.value ?? "—", change: res.data[0]?.change || "", gradient: "from-violet-500 to-purple-500" },
          { icon: Clock, label: res.data[2]?.label || "Pending Reviews", value: res.data[2]?.value ?? "—", change: res.data[2]?.change || "", gradient: "from-yellow-500 to-amber-500" },
        ]);
      }
    };
    fetchStats();
  }, []);

  const quickActions = [
    {
      title: "Issuer Portal",
      description: "Create and manage digital credentials",
      icon: IssuerIcon,
      path: "/admin/issuer-portal",
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      features: [
        "W3C-Compliant Credential Minting",
        "Multi-Signature Authorization",
        "Bulk Issuance Management",
        "DID Document Control"
      ]
    }
  ];

  return (
    <PageTransition>
      <div className="page-shell relative">
        <div className="page-container space-y-8 sm:space-y-12 relative z-[2]">
          {/* Header */}
          <div className="text-center space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Manage credential issuance, verification, and institution governance
            </p>
          </div>

          {/* Stats Grid - Responsive 4-Column Layout */}
          <StaggerContainer>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <StaggerItem key={index}>
                    <Card className="border hover:border-primary/30 transition-colors">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col gap-3 sm:gap-4">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</p>
                            <p className="text-xs text-muted-foreground mb-2">{stat.label}</p>
                            <Badge className="text-xs bg-primary/10 text-primary border-primary/30">
                              {stat.change}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                );
              })}
            </div>
          </StaggerContainer>

          {/* Quick Actions */}
          <div className="max-w-2xl mx-auto w-full">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  className="border hover:border-primary/50 cursor-pointer transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Gradient glow effect */}
                  <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${action.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                  <CardHeader className="relative z-10 p-grid-6">
                    <div className="flex items-start gap-grid-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-2xl mb-1">{action.title}</CardTitle>
                        <CardDescription>{action.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10 pt-0">
                    {/* Features */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Key Features</h4>
                      <ul className="space-y-2">
                        {action.features.map((feature) => (
                          <li key={feature} className="text-sm flex items-start gap-2 text-muted-foreground">
                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${action.gradient} flex-shrink-0 mt-2`} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* System Status */}
          <Card className="border bg-gradient-to-br from-primary/5 via-purple-500/5 to-cyan-500/5">
            <CardContent className="py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">System Status: Operational</h3>
                    <p className="text-sm text-muted-foreground">
                      All systems running normally • Network uptime: 99.8%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Blockchain Connected
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}