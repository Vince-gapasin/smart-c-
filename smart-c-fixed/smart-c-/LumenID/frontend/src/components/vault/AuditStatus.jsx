import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { CheckCircle2, AlertTriangle, Shield, Database, Key, Cloud } from "lucide-react";

export function AuditStatus() {
  const healthChecks = [
    {
      name: "Blockchain Sync",
      status: "healthy",
      icon: Database,
      description: "Connected to Polkadot mainnet",
      details: "Last synced: 2 minutes ago",
    },
    {
      name: "Credential Validity",
      status: "healthy",
      icon: Shield,
      description: "All credentials verified on-chain",
      details: "3 active credentials",
    },
    {
      name: "Recovery Method",
      status: "healthy",
      icon: Key,
      description: "Backup configured",
      details: "Social recovery active",
    },
    {
      name: "IPFS Connection",
      status: "warning",
      icon: Cloud,
      description: "Decentralized storage accessible",
      details: "Partial connectivity",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/70 border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-2xl">Audit Status</CardTitle>
              <p className="text-sm text-slate-400">Health Check - System diagnostics and security status</p>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              All Systems Operational
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Health Checks */}
          <div className="space-y-3">
            {healthChecks.map((check) => {
              const Icon = check.icon;
              const isHealthy = check.status === "healthy";

              return (
                <div
                  key={check.name}
                  className="bg-slate-800/50 rounded-lg p-4 flex items-start gap-4"
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${isHealthy ? "bg-green-600" : "bg-yellow-600"
                      }`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold text-white">{check.name}</h4>
                      {isHealthy ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      )}
                    </div>
                    <p className="text-sm text-slate-300">{check.description}</p>
                    <p className="text-xs text-slate-500 mt-1">{check.details}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Wallet Statistics */}
          <div className="bg-slate-800/50 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Wallet Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-white">3</p>
                <p className="text-sm text-slate-400">Total Credentials</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">12</p>
                <p className="text-sm text-slate-400">Verifications</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-indigo-400">5</p>
                <p className="text-sm text-slate-400">Presentations Shared</p>
              </div>
            </div>
          </div>

          {/* Security Recommendations */}
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-indigo-300 mb-2">Security Recommendations</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                Biometric authentication is enabled
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                Recovery method is configured
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                Consider backing up credentials to IPFS
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}