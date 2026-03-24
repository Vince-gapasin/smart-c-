import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload,
  ArrowRight,
  Share2,
  Plus,
  Trash2,
  FileText,
  X,
  Award,
  Eye,
  Edit,
  Check,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { PageTransition, StaggerContainer, StaggerItem } from "../PageTransition";
import { motion } from "motion/react";
import {
  HolderIcon,
  SelectiveDisclosureIcon,
  IPFSLinkIcon,
  ZKProofIcon,
  MintCredentialIcon,
} from "../icons/LumenIcons";
import { toast } from "sonner";
import { apiClient } from "../../lib/api-client";

export function CustomerDashboard() {
  const navigate = useNavigate();
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [selectedWalletCredential, setSelectedWalletCredential] = useState(null);
  const [selectedPendingCredential, setSelectedPendingCredential] = useState(null);

  // State for submitting new certifications/badges
  const [certifications, setCertifications] = useState([
    {
      id: "1",
      certificationTitle: "",
      issuingOrganization: "",
      issueDate: "",
      expirationDate: "",
      credentialID: "",
      credentialURL: "",
      certificationType: "certification",
      file: null,
    }
  ]);

  const [pendingCredentials, setPendingCredentials] = useState([]);
  const [walletCredentials, setWalletCredentials] = useState([]);

  // Load credentials from backend on mount
  useEffect(() => {
    const fetchCredentials = async () => {
      const res = await apiClient.get("/credentials");
      if (res.success && Array.isArray(res.data)) {
        setPendingCredentials(
          res.data
            .filter((c) => c.status === "pending")
            .map((c) => ({
              id: c.id,
              type: c.claims?.program || c.type,
              institution: c.issuer,
              issuer: c.issuer,
              offeredDate: c.issuedDate?.slice(0, 10),
              credentialType: c.type?.toLowerCase().includes("degree") ? "diploma" : "certification",
              _raw: c,
            }))
        );
        setWalletCredentials(
          res.data
            .filter((c) => c.status === "active")
            .map((c) => ({
              id: c.id,
              type: c.claims?.program || c.type,
              institution: c.issuer,
              issuer: c.issuer,
              status: "verified",
              acceptedDate: c.acceptedAt?.slice(0, 10) || c.issuedDate?.slice(0, 10),
              blockchainHash: c.blockchainHash || null,
              ipfsHash: c.nftMetadataURI || null,
              credentialType: c.type?.toLowerCase().includes("degree") ? "diploma" : "certification",
              _raw: c,
            }))
        );
      }
    };
    fetchCredentials();
  }, []);

  // Handlers for certifications
  const addCertification = () => {
    setCertifications([
      ...certifications,
      {
        id: Date.now().toString(),
        certificationTitle: "",
        issuingOrganization: "",
        issueDate: "",
        expirationDate: "",
        credentialID: "",
        credentialURL: "",
        certificationType: "certification",
        file: null,
      }
    ]);
  };

  const removeCertification = (id) => {
    setCertifications(certifications.filter(c => c.id !== id));
    toast.info("Certification removed");
  };

  const updateCertification = (id, field, value) => {
    setCertifications(certifications.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const handleCertificationFileUpload = (certId, event) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload PDF only.");
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File size exceeds 10MB. Please upload a smaller file.");
        return;
      }

      setCertifications(certifications.map(c =>
        c.id === certId ? { ...c, file } : c
      ));
      toast.success(`${file.name} uploaded successfully`);
    }
  };

  const handleRemoveCertificationFile = (certId) => {
    setCertifications(certifications.map(c =>
      c.id === certId ? { ...c, file: null } : c
    ));
    toast.info("File removed");
  };

  const handleSubmitCertifications = async () => {
    const valid = certifications.filter(
      cert => cert.certificationTitle && cert.issuingOrganization && cert.issueDate
    );
    if (valid.length === 0) {
      toast.error("Please fill in at least one certification");
      return;
    }
    const res = await apiClient.post("/credentials/request", { certifications: valid });
    if (res.success) {
      toast.success("Credential request submitted for review");
    } else {
      toast.error(res.error || "Failed to submit request");
    }
    setShowSubmitDialog(false);

    // Reset form
    setCertifications([{
      id: "1",
      certificationTitle: "",
      issuingOrganization: "",
      issueDate: "",
      expirationDate: "",
      credentialID: "",
      credentialURL: "",
      certificationType: "certification",
      file: null,
    }]);
  };

  // Handlers for pending credentials
  const handleAcceptCredential = async (id) => {
    const res = await apiClient.post(`/credentials/${id}/accept`, {});
    if (res.success) {
      const accepted = res.data;
      const credential = pendingCredentials.find(c => c.id === id);
      setWalletCredentials([
        ...walletCredentials,
        {
          ...(credential || {}),
          id: accepted.id,
          status: "verified",
          acceptedDate: accepted.acceptedAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
          blockchainHash: accepted.blockchainHash || null,
          ipfsHash: accepted.nftMetadataURI || null,
        }
      ]);
      setPendingCredentials(pendingCredentials.filter(c => c.id !== id));
      toast.success("Credential accepted and added to your wallet");
    } else {
      toast.error(res.error || "Failed to accept credential");
    }
  };

  const handleRejectCredential = async (id) => {
    const res = await apiClient.post(`/credentials/${id}/reject`, { reason: "Declined by recipient" });
    if (res.success) {
      setPendingCredentials(pendingCredentials.filter(c => c.id !== id));
      toast.info("Credential rejected");
    } else {
      toast.error(res.error || "Failed to reject credential");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case "unverified":
        // No badge for unverified user-submitted credentials
        return null;
      default:
        return null;
    }
  };

  const stats = {
    wallet: walletCredentials.length,
    pending: pendingCredentials.length,
  };

  return (
    <PageTransition>
      <div className="page-shell relative">
        <div className="page-container space-y-8 sm:space-y-12 relative z-[2]">
          {/* Header */}
          <div className="text-center space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Identity Vault
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Manage your digital credentials and identity vault
            </p>
          </div>

          {/* Stats Grid */}
          <StaggerContainer>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <StaggerItem>
                <Card className="border hover:border-primary/30 transition-colors">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl sm:text-3xl font-bold mb-1">{stats.wallet}</p>
                        <p className="text-xs text-muted-foreground">Wallet Credentials</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="border hover:border-primary/30 transition-colors">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl sm:text-3xl font-bold mb-1">{stats.pending}</p>
                        <p className="text-xs text-muted-foreground">Pending Offers</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            </div>
          </StaggerContainer>

          {/* Submit New Credential Section */}
          <Card className="border bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-indigo-500/5">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-sm sm:text-base">Submit New Credential</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Upload certifications and badges for verification
                    </p>
                  </div>
                </div>
                <Button
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white border-0"
                  onClick={() => setShowSubmitDialog(true)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pending Credentials */}
          {pendingCredentials.length > 0 && (
            <Card className="border">
              <CardHeader>
                <CardTitle>Pending Credential Offers</CardTitle>
                <CardDescription>Review and accept credentials offered by institutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingCredentials.map((credential) => (
                    <Card key={credential.id} className="border hover:border-yellow-500/30 transition-colors">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h4 className="font-semibold">{credential.type}</h4>
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {credential.institution}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Offered: {credential.offeredDate} • From: {credential.issuer}
                            </p>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPendingCredential(credential)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white border-0"
                              onClick={() => handleAcceptCredential(credential.id)}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-400 hover:text-red-300 border-red-500/30"
                              onClick={() => handleRejectCredential(credential.id)}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Wallet Credentials */}
          <Card className="border">
            <CardHeader>
              <CardTitle>My Wallet</CardTitle>
              <CardDescription>Your verified and accepted credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {walletCredentials.map((credential) => (
                  <Card key={credential.id} className="border hover:border-primary/30 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h4 className="font-semibold">{credential.type}</h4>
                            {getStatusBadge(credential.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {credential.institution}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Accepted: {credential.acceptedDate}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedWalletCredential(credential)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {credential.status === "unverified" && (
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          )}
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white border-0"
                          >
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Certification Dialog */}
        <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border">
            <DialogHeader className="pr-8">
              <DialogTitle className="text-2xl font-bold">
                Submit Certifications & Badges
              </DialogTitle>
              <DialogDescription>
                Upload your certifications and badges for verification
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 pt-2">
              {certifications.map((cert, index) => (
                <Card key={cert.id} className="border-2 border-dashed">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {cert.certificationType === "certification" ? "Certification" : "Badge"} #{index + 1}
                      </CardTitle>
                      {certifications.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCertification(cert.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`type-${cert.id}`}>
                          Type <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={cert.certificationType}
                          onValueChange={(value) =>
                            updateCertification(cert.id, "certificationType", value)
                          }
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="certification">Certification</SelectItem>
                            <SelectItem value="badge">Badge</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`title-${cert.id}`}>
                          Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`title-${cert.id}`}
                          placeholder="e.g., AWS Solutions Architect"
                          value={cert.certificationTitle}
                          onChange={(e) => updateCertification(cert.id, "certificationTitle", e.target.value)}
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`org-${cert.id}`}>
                          Issuing Organization <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`org-${cert.id}`}
                          placeholder="e.g., Amazon Web Services"
                          value={cert.issuingOrganization}
                          onChange={(e) => updateCertification(cert.id, "issuingOrganization", e.target.value)}
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`issueDate-${cert.id}`}>
                          Issue Date <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`issueDate-${cert.id}`}
                          type="date"
                          value={cert.issueDate}
                          onChange={(e) => updateCertification(cert.id, "issueDate", e.target.value)}
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`expirationDate-${cert.id}`}>
                          Expiration Date
                        </Label>
                        <Input
                          id={`expirationDate-${cert.id}`}
                          type="date"
                          value={cert.expirationDate}
                          onChange={(e) => updateCertification(cert.id, "expirationDate", e.target.value)}
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`credID-${cert.id}`}>
                          Credential ID
                        </Label>
                        <Input
                          id={`credID-${cert.id}`}
                          placeholder="e.g., ABC123XYZ"
                          value={cert.credentialID}
                          onChange={(e) => updateCertification(cert.id, "credentialID", e.target.value)}
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`credURL-${cert.id}`}>
                          Credential URL
                        </Label>
                        <Input
                          id={`credURL-${cert.id}`}
                          placeholder="https://verify.example.com/credential/123"
                          value={cert.credentialURL}
                          onChange={(e) => updateCertification(cert.id, "credentialURL", e.target.value)}
                          className="h-11"
                        />
                      </div>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <Label>Upload Certificate (PDF)</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 hover:border-primary/50 transition-colors">
                        {!cert.file ? (
                          <div className="flex flex-col items-center justify-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                              <Upload className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium mb-1">Upload Certificate</p>
                              <p className="text-xs text-muted-foreground">PDF only (Max 10MB)</p>
                            </div>
                            <label htmlFor={`fileUpload-${cert.id}`} className="cursor-pointer">
                              <Button type="button" variant="outline" size="sm" asChild>
                                <span>
                                  <FileText className="w-4 h-4 mr-2" />
                                  Browse Files
                                </span>
                              </Button>
                            </label>
                            <input
                              id={`fileUpload-${cert.id}`}
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleCertificationFileUpload(cert.id, e)}
                              className="hidden"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{cert.file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(cert.file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveCertificationFile(cert.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Add More Button */}
              <Button
                type="button"
                variant="outline"
                onClick={addCertification}
                className="w-full border-dashed border-2 h-12"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another {certifications[0]?.certificationType === "certification" ? "Certification" : "Badge"}
              </Button>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={handleSubmitCertifications}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white border-0 h-11"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
                <Button
                  variant="outline"
                  className="h-11"
                  onClick={() => setShowSubmitDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Wallet Credential Details Dialog */}
        <Dialog open={!!selectedWalletCredential} onOpenChange={() => setSelectedWalletCredential(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border">
            <DialogHeader className="pr-8">
              <DialogTitle className="text-2xl font-bold">
                {selectedWalletCredential?.type}
              </DialogTitle>
              <DialogDescription>
                Review credential details and status
              </DialogDescription>
            </DialogHeader>
            {selectedWalletCredential && (
              <div className="space-y-6 pt-2">
                {/* Status */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Status</h3>
                  <div className="p-4 bg-secondary/50 rounded-lg border">
                    {getStatusBadge(selectedWalletCredential.status)}
                  </div>
                </div>

                {/* Credential Information */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Credential Information</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-secondary/50 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-2">Credential ID</p>
                      <p className="text-sm font-mono">{selectedWalletCredential.id}</p>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-2">Type</p>
                      <p className="text-sm font-semibold">{selectedWalletCredential.type}</p>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-lg border col-span-2">
                      <p className="text-xs text-muted-foreground mb-2">Institution</p>
                      <p className="text-sm font-semibold">{selectedWalletCredential.institution}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Timeline</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-secondary/50 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-2">Accepted Date</p>
                      <p className="text-sm font-semibold">{selectedWalletCredential.acceptedDate}</p>
                    </div>
                  </div>
                </div>

                {/* Blockchain Information */}
                {selectedWalletCredential.status === "verified" && selectedWalletCredential.blockchainHash && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Blockchain Verification</h3>
                    <div className="p-4 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-indigo-500/5 border border-primary/30 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">On-Chain Verified</p>
                          <p className="text-xs text-muted-foreground">This credential is immutably recorded on the blockchain</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Transaction Hash:</span>
                          <span className="font-mono text-cyan-400">{selectedWalletCredential.blockchainHash}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">IPFS Hash:</span>
                          <span className="font-mono text-cyan-400">{selectedWalletCredential.ipfsHash}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white border-0 h-11">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Credential
                  </Button>
                  {selectedWalletCredential.status === "unverified" && (
                    <Button variant="outline" className="h-11">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                  <Button variant="outline" className="h-11" onClick={() => setSelectedWalletCredential(null)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Pending Credential Details Dialog */}
        <Dialog open={!!selectedPendingCredential} onOpenChange={() => setSelectedPendingCredential(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border">
            <DialogHeader className="pr-8">
              <DialogTitle className="text-2xl font-bold">
                {selectedPendingCredential?.type}
              </DialogTitle>
              <DialogDescription>
                Review credential offer details
              </DialogDescription>
            </DialogHeader>
            {selectedPendingCredential && (
              <div className="space-y-6 pt-2">
                {/* Status */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Status</h3>
                  <div className="p-4 bg-secondary/50 rounded-lg border">
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending Your Acceptance
                    </Badge>
                  </div>
                </div>

                {/* Credential Information */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Offer Information</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-secondary/50 rounded-lg border col-span-2">
                      <p className="text-xs text-muted-foreground mb-2">Credential Type</p>
                      <p className="text-sm font-semibold">{selectedPendingCredential.type}</p>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-2">Institution</p>
                      <p className="text-sm font-semibold">{selectedPendingCredential.institution}</p>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-2">Issuer</p>
                      <p className="text-sm font-semibold">{selectedPendingCredential.issuer}</p>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-lg border col-span-2">
                      <p className="text-xs text-muted-foreground mb-2">Offered Date</p>
                      <p className="text-sm font-semibold">{selectedPendingCredential.offeredDate}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white border-0 h-11"
                    onClick={() => {
                      handleAcceptCredential(selectedPendingCredential.id);
                      setSelectedPendingCredential(null);
                    }}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Accept Credential
                  </Button>
                  <Button
                    variant="outline"
                    className="h-11 text-red-400 hover:text-red-300 border-red-500/30"
                    onClick={() => {
                      handleRejectCredential(selectedPendingCredential.id);
                      setSelectedPendingCredential(null);
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button variant="outline" className="h-11" onClick={() => setSelectedPendingCredential(null)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}