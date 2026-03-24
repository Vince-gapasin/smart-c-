import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Fingerprint, Lock, Key, Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export function IdentityProfile() {
  const { user } = useAuth();
  const [showSecretPhrase, setShowSecretPhrase] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  // Mock secret phrase (in real app, this would be stored securely)
  const secretPhrase = "abandon ability able about above absent absorb abstract absurd abuse access accident";

  const handleBiometricSetup = () => {
    toast.success("Biometric authentication enabled");
  };

  const handleVerifyPassword = () => {
    // Mock password verification (in real app, verify against stored hash)
    if (passwordInput === "password123") { // Replace with actual password verification
      setIsPasswordVerified(true);
      toast.success("Password verified");
    } else {
      toast.error("Incorrect password");
    }
  };

  const handleToggleSecretPhrase = () => {
    if (!isPasswordVerified) {
      toast.error("Please verify your password first");
      return;
    }
    setShowSecretPhrase(!showSecretPhrase);
  };

  return (
    <div className="space-y-6">
      <Card className="border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">LumenID Profile</CardTitle>
              <p className="text-sm text-muted-foreground">Sovereign Manager - Non-Custodial Wallet</p>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Shield className="w-3 h-3 mr-1" />
              Secured
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-3">
            <h3 className="font-semibold">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                <p className="text-sm bg-secondary/50 px-3 py-2 rounded border">{user?.fullName || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">DID Identifier</p>
                <p className="text-sm bg-secondary/50 px-3 py-2 rounded border font-mono">{user?.did || "—"}</p>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-400" />
              Security Settings
            </h3>

            {/* Biometric Lock */}
            <div className="bg-secondary/50 rounded-lg p-4 border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Fingerprint className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Biometric Lock</h4>
                    <p className="text-xs text-muted-foreground">FaceID / Fingerprint Authentication</p>
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Enabled</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Your private key is encrypted and secured by biometric authentication. It never leaves your device.
              </p>
              <Button
                onClick={handleBiometricSetup}
                variant="outline"
                size="sm"
              >
                Configure Biometric
              </Button>
            </div>

            {/* Private Key */}
            <div className="bg-secondary/50 rounded-lg p-4 border">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Key className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Private Key Management</h4>
                  <p className="text-xs text-muted-foreground">Non-Custodial Storage</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Public Key</p>
                  <p className="text-sm bg-background px-3 py-2 rounded border font-mono break-all">
                    {user?.walletAddress || "Not set"}
                  </p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
                  <p className="text-xs text-yellow-400">
                    ⚠️ Your private key is encrypted locally and never transmitted. Only you have access to your
                    credentials.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recovery Method */}
          <div className="space-y-3">
            <h3 className="font-semibold">Recovery Method</h3>

            {/* Secret Phrase Section */}
            <div className="bg-secondary/50 rounded-lg p-4 border">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Secret Phrase</h4>
                  <p className="text-xs text-muted-foreground">Recovery Access Key</p>
                </div>
              </div>

              <div className="space-y-4">
                {!isPasswordVerified ? (
                  <div className="space-y-3">
                    <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
                      <p className="text-xs text-red-300">
                        🔐 Enter your password to view your secret phrase
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-verify">Enter Password</Label>
                      <div className="flex gap-2">
                        <Input
                          id="password-verify"
                          type="password"
                          placeholder="Enter your password"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          className="bg-background/50 border-border/50"
                        />
                        <Button
                          onClick={handleVerifyPassword}
                          className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:opacity-90 text-white border-0"
                        >
                          Verify
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="secret-phrase">Secret Phrase</Label>
                      <div className="flex gap-2 items-start">
                        <Input
                          id="secret-phrase"
                          type={showSecretPhrase ? "text" : "password"}
                          value={secretPhrase}
                          readOnly
                          className="bg-background/50 border-border/50 font-mono text-sm"
                        />
                        <Button
                          onClick={handleToggleSecretPhrase}
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 shrink-0"
                        >
                          {showSecretPhrase ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Keep this phrase safe. It's essential for recovering your profile.
                      </p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
                      <p className="text-xs text-yellow-400">
                        ⚠️ Never share your secret phrase with anyone. Store it in a secure location.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4 border">
              <p className="text-sm text-muted-foreground mb-3">
                Set up a recovery method to regain access to your identity vault if you lose your device.
              </p>
              <div className="flex gap-3">
                <Button variant="outline">
                  Seed Phrase Backup
                </Button>
                <Button variant="outline">
                  Social Recovery
                </Button>
              </div>
            </div>
          </div>

          {/* Blockchain Info */}
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-indigo-400 mb-2">Blockchain Network</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Network</p>
                <p>"LumenID Network"</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Verification Status</p>
                <p className="text-green-400">✓ Verified On-Chain</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}