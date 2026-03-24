import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Search, XCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "../../lib/api-client";

export function IdentityLogs() {
  const [credentials, setCredentials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      const res = await apiClient.get("/credentials/search");
      if (res.success && Array.isArray(res.data)) {
        setCredentials(res.data);
      }
    };
    fetchAll();
  }, []);

  const filteredCredentials = credentials.filter(
    (cred) =>
      cred.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cred.recipientDID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cred.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRevoke = (credential) => {
    setSelectedCredential(credential);
    setRevokeDialogOpen(true);
  };

  const confirmRevoke = async () => {
    if (!selectedCredential) return;
    const res = await apiClient.post(`/credentials/${selectedCredential.id}/revoke`, { reason: "Revoked by issuer" });
    if (res.success) {
      setCredentials(credentials.map((cred) =>
        cred.id === selectedCredential.id ? { ...cred, status: "revoked" } : cred
      ));
      toast.success(`Credential ${selectedCredential.id} has been revoked`);
    } else {
      toast.error(res.error || "Failed to revoke credential");
    }
    setRevokeDialogOpen(false);
    setSelectedCredential(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case "revoked":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            Revoked
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">Identity Logs</CardTitle>
          <p className="text-sm text-muted-foreground">
            Revocation Registry - Comprehensive history of all issued credentials
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by recipient name, DID, or credential ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/50 rounded-lg">
            <div>
              <p className="text-2xl font-bold">
                {credentials.filter((c) => c.status === "active").length}
              </p>
              <p className="text-sm text-muted-foreground">Active Credentials</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">
                {credentials.filter((c) => c.status === "pending").length}
              </p>
              <p className="text-sm text-muted-foreground">Pending Signatures</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">
                {credentials.filter((c) => c.status === "revoked").length}
              </p>
              <p className="text-sm text-muted-foreground">Revoked</p>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Credential ID</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Issued Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCredentials.map((credential) => (
                  <TableRow key={credential.id}>
                    <TableCell className="font-mono text-sm">{credential.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{credential.recipient}</p>
                        <p className="text-xs text-muted-foreground font-mono">{credential.recipientDID}</p>
                      </div>
                    </TableCell>
                    <TableCell>{credential.claims.program}</TableCell>
                    <TableCell>{credential.issuedDate}</TableCell>
                    <TableCell>{getStatusBadge(credential.status)}</TableCell>
                    <TableCell>
                      {credential.status === "active" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRevoke(credential)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Revoke
                        </Button>
                      )}
                      {credential.status === "revoked" && (
                        <span className="text-xs text-muted-foreground">Revoked</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredCredentials.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No credentials found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revoke Dialog */}
      <AlertDialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <AlertDialogContent className="border">
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Credential</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke credential <span className="font-mono">{selectedCredential?.id}</span> for{" "}
              {selectedCredential?.recipient}? This action will update the on-chain revocation registry. The data will
              remain in the student's possession but its validity status will be marked as revoked.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRevoke}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revoke Credential
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}