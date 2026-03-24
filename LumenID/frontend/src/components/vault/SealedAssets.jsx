import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CheckCircle2, Share2, Eye, Shield, Award, Code, Sparkles } from "lucide-react";
import { apiClient } from "../../lib/api-client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";

export function SealedAssets() {
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [credentials, setCredentials] = useState([]);

  useEffect(() => {
    apiClient.get("/credentials").then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setCredentials(res.data.filter((c) => c.status === "active"));
      }
    });
  }, []);

  const getCredentialIcon = (type) => {
    if (type.includes("Degree")) return Award;
    if (type.includes("Micro")) return Code;
    return Shield;
  };

  return (
    <div className="space-y-6">
      {credentials.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No active credentials yet.</p>}
      {credentials.length > 0 && (
      <Card className="border">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30 mb-3">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verified on Chain
              </Badge>
              <CardTitle className="text-xl mb-2">{credentials[0]?.issuer} - {credentials[0]?.claims?.program}</CardTitle>
              <p className="text-sm text-muted-foreground">Issued: {credentials[0]?.issuedDate?.slice(0,10)}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button
              onClick={() => setSelectedCredential(credentials[0])}
              variant="outline"
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Micro-Credentials */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Micro-Credentials & Badges</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {credentials.slice(1).map((credential) => {
            const Icon = getCredentialIcon(credential.type);
            return (
              <Card
                key={credential.id}
                className="border hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => setSelectedCredential(credential)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{credential.claims.program}</h4>
                      <p className="text-xs text-muted-foreground">Badges</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Credential Details Dialog */}
      <Dialog open={!!selectedCredential} onOpenChange={() => setSelectedCredential(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border">
          <DialogHeader className="pr-8">
            <DialogTitle className="text-2xl font-bold">
              {selectedCredential?.claims.program}
            </DialogTitle>
            <DialogDescription>
              View and manage the details of your credential
            </DialogDescription>
          </DialogHeader>
          {selectedCredential && (
            <div className="space-y-6 pt-2">
              {/* Issuer Information */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Issuer Information</h3>
                <div className="p-4 bg-secondary/50 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">Issuer</p>
                  <p className="text-sm font-semibold mb-3">{selectedCredential.issuer}</p>
                  <p className="text-xs text-muted-foreground mb-1">DID</p>
                  <p className="text-xs font-mono break-all">{selectedCredential.issuerDID}</p>
                </div>
              </div>

              {/* Credential Details */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Credential Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-secondary/50 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-2">Program</p>
                    <p className="text-sm font-semibold">{selectedCredential.claims.program}</p>
                  </div>
                  {selectedCredential.claims.honors && (
                    <div className="p-4 bg-secondary/50 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-2">Honors</p>
                      <p className="text-sm font-semibold">{selectedCredential.claims.honors}</p>
                    </div>
                  )}
                  {selectedCredential.claims.gpa && (
                    <div className="p-4 bg-secondary/50 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-2">GPA</p>
                      <p className="text-xl font-bold text-cyan-400">{selectedCredential.claims.gpa}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Certifications & NFTs */}
              {selectedCredential.certifications && selectedCredential.certifications.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Certifications & NFT Badges</h3>
                  <div className="space-y-3">
                    {selectedCredential.certifications.map((cert) => (
                      <div key={cert.id} className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/30">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="text-sm font-semibold mb-1">{cert.title}</p>
                            <p className="text-xs text-muted-foreground">{cert.organization}</p>
                          </div>
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 capitalize">
                            {cert.type}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-3 p-3 bg-card/50 rounded-lg">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Unique ID</p>
                            <p className="text-xs font-mono font-semibold text-cyan-400">{cert.uniqueId}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">NFT Address</p>
                            <p className="text-xs font-mono text-cyan-400 truncate" title={cert.nftAddress}>
                              {cert.nftAddress.substring(0, 6)}...{cert.nftAddress.substring(cert.nftAddress.length - 4)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Token ID</p>
                            <p className="text-xs font-mono font-semibold text-cyan-400">#{cert.nftTokenId}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                          <span>Issued: {cert.issueDate}</span>
                          {cert.expirationDate && <span>• Expires: {cert.expirationDate}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {selectedCredential.claims.skills && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCredential.claims.skills.map((skill) => (
                      <Badge key={skill} className="bg-primary/20 text-primary border-primary/30 px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Privacy Settings</h3>
                <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg border border-accent/30">
                  <div>
                    <p className="text-sm font-medium mb-1">Hide in Presentation (ZKP Protected)</p>
                    <p className="text-xs text-muted-foreground">Enable zero-knowledge proof protection</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-purple-500"></div>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white border-0 h-11">
                  <Share2 className="w-4 h-4 mr-2" />
                  Generate Presentation QR
                </Button>
                <Button variant="outline" className="h-11">
                  View Raw JSON-LD
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}