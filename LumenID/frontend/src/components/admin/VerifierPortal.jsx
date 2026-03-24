import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { apiClient } from "../../lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  Download,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

export function VerifierPortal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [verificationNotes, setVerificationNotes] = useState("");

  const [submissions, setSubmissions] = useState([]);

  // Load pending credential submissions from backend
  useEffect(() => {
    const fetchSubmissions = async () => {
      const res = await apiClient.get("/credentials/submissions/pending");
      if (res.success && Array.isArray(res.data)) {
        setSubmissions(
          res.data.map((c) => ({
            id: c.id,
            customerId: c.recipientUserId || c.recipientDID,
            customerName: c.recipient,
            customerEmail: c.claims?.email || "",
            credentialType: c.claims?.program || c.type,
            institution: c.issuer,
            submittedDate: c.issuedDate?.slice(0, 10),
            status: c.status,
            documents: [],
            priority: "normal",
            _raw: c,
          }))
        );
      }
    };
    fetchSubmissions();
  }, []);

  const filteredSubmissions = submissions.filter(
    (sub) =>
      sub.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.credentialType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingSubmissions = submissions.filter(s => s.status === "pending");

  const handleReview = (credential) => {
    setSelectedCredential(credential);
    setReviewDialogOpen(true);
    setRejectionReason("");
    setVerificationNotes("");
  };

  const handleApprove = async () => {
    if (!selectedCredential) return;
    // Issue the credential (marks it active)
    const res = await apiClient.post(`/credentials/${selectedCredential.id}/accept`, {});
    if (res.success) {
      setSubmissions(submissions.map((sub) =>
        sub.id === selectedCredential.id ? { ...sub, status: "verified" } : sub
      ));
      toast.success(`Credential ${selectedCredential.id} verified`);
    } else {
      toast.error(res.error || "Failed to approve credential");
    }
    setReviewDialogOpen(false);
    setSelectedCredential(null);
  };

  const handleReject = async () => {
    if (!selectedCredential) return;
    if (!rejectionReason) { toast.error("Please provide a rejection reason"); return; }
    const res = await apiClient.post(`/credentials/${selectedCredential.id}/revoke`, { reason: rejectionReason });
    if (res.success) {
      setSubmissions(submissions.map((sub) =>
        sub.id === selectedCredential.id ? { ...sub, status: "rejected" } : sub
      ));
      toast.error(`Credential ${selectedCredential.id} rejected`);
    } else {
      toast.error(res.error || "Failed to reject credential");
    }
    setReviewDialogOpen(false);
    setSelectedCredential(null);
    setRejectionReason("");
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
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30 text-xs">High</Badge>;
      case "normal":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs">Normal</Badge>;
      case "low":
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/30 text-xs">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="page-shell relative">
      <div className="page-container relative z-[2]" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-section-medium)' }}>
        {/* Page Header — matches Issuer Portal / Admin Dashboard title style */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-group-tight)' }}>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Verification Portal
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Review and process incoming credential submissions
          </p>
        </div>

        {/* Priority Alert */}
        {pendingSubmissions.some(s => s.priority === "high") && (
          <Card className="border-2 border-red-500/50 bg-red-500/5">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="font-semibold text-red-400">High Priority Items Pending</p>
                  <p className="text-sm text-muted-foreground">
                    {pendingSubmissions.filter(s => s.priority === "high").length} high-priority submissions require immediate attention
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Verification Queue */}
        <Card className="border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  Verification Queue
                </CardTitle>
                <CardDescription>Review and approve credential submissions</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-mono text-sm">{submission.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{submission.customerName}</p>
                          <p className="text-xs text-muted-foreground">{submission.customerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{submission.credentialType}</TableCell>
                      <TableCell className="text-sm">{submission.institution}</TableCell>
                      <TableCell className="text-sm">{submission.submittedDate}</TableCell>
                      <TableCell>{getPriorityBadge(submission.priority)}</TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReview(submission)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredSubmissions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No submissions found matching your search.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Review Dialog - Optimized */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto border">
            <DialogHeader>
              <DialogTitle>Review Credential Submission</DialogTitle>
              <DialogDescription>
                Review the details and documents, then approve or reject
              </DialogDescription>
            </DialogHeader>

            {selectedCredential && (
              <div className="space-y-4">
                {/* Customer Info - Compact */}
                <Card className="border bg-secondary/50">
                  <CardContent className="pt-4 pb-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Customer</p>
                        <p className="font-semibold text-sm">{selectedCredential.customerName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Email</p>
                        <p className="font-semibold text-sm">{selectedCredential.customerEmail}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Type</p>
                        <p className="font-semibold text-sm">{selectedCredential.credentialType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Institution</p>
                        <p className="font-semibold text-sm">{selectedCredential.institution}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Documents - Compact */}
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Submitted Documents</h4>
                  <div className="space-y-2">
                    {selectedCredential.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">{doc}</span>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes - Compact */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Verification Notes (Optional)</label>
                  <Textarea
                    placeholder="Add internal notes..."
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    rows={2}
                  />
                </div>

                {/* Rejection Reason - Compact */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rejection Reason (Required if rejecting)</label>
                  <Textarea
                    placeholder="Explain why this credential is being rejected..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setReviewDialogOpen(false)} size="sm">
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectionReason}
                size="sm"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={handleApprove}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white border-0"
                size="sm"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}