import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CheckCircle2, Globe, MapPin, Key, Shield } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";

export function LegalStanding() {
  const { user } = useAuth();

  const handleUpdateDID = () => {
    toast.success("DID document updated and published to blockchain");
  };

  return (
    <div className="space-y-6">
      <Card className="border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Legal Standing</CardTitle>
              <p className="text-sm text-muted-foreground">
                DID Controller - Manage your institution's Decentralized Identifier
              </p>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Verified
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current DID Status */}
          <div className="bg-secondary/50 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              Current DID Document
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">DID Identifier</p>
                <p className="text-sm font-mono bg-background px-3 py-2 rounded border">
                  {user?.did || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Public Key</p>
                <p className="text-sm font-mono bg-background px-3 py-2 rounded border">
                  {user?.walletAddress || "Not set"}
                </p>
              </div>
            </div>
          </div>

          {/* Institution Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Institution Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="institutionName">
                  <Building className="w-4 h-4 inline mr-1" />
                  Official Institution Name
                </Label>
                <Input
                  id="institutionName"
                  defaultValue={user?.fullName || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Website
                </Label>
                <Input
                  id="website"
                  defaultValue=""
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </Label>
                <Input
                  id="location"
                  defaultValue=""
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regNumber">
                  Government Registration Number
                </Label>
                <Input
                  id="regNumber"
                  defaultValue=""
                />
              </div>
            </div>
          </div>

          {/* Cryptographic Keys */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-400" />
              Cryptographic Keys
            </h3>
            <div className="space-y-3">
              <div>
                <Label className="mb-2 block">Public Key (Verification)</Label>
                <div className="bg-secondary/50 border rounded px-3 py-2">
                  <p className="text-sm font-mono">{user?.walletAddress || "Not set"}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This key is published on-chain and used by verifiers to authenticate credentials
                </p>
              </div>
              <div>
                <Label className="mb-2 block">Blockchain Network</Label>
                <div className="bg-secondary/50 border rounded px-3 py-2">
                  <p className="text-sm">"LumenID Network"</p>
                </div>
              </div>
            </div>
          </div>

          {/* Root of Trust */}
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-indigo-400 mb-2">On-Chain Root of Trust</h4>
            <p className="text-sm text-muted-foreground">
              Your DID document establishes a cryptographic link between your institution's legal identity and your
              blockchain address. This proves to verifiers that credentials issued by your DID are authentic and come
              from a legitimate academic entity.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleUpdateDID}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90"
            >
              Update & Publish DID Document
            </Button>
            <Button variant="outline">
              Rotate Keys
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Building({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}