import { useState } from "react";
import { Link } from "react-router";
import { Mail, Building2, User, ArrowLeft, Briefcase } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { ROUTES } from "../../constants/routes";

export function RequestAccess() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        organization: "",
        position: "",
        reason: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.email || !formData.organization) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitted(true);
            toast.success("Access request submitted successfully");
            setIsLoading(false);
        }, 1000);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full space-y-8">
                    <Card className="border-2">
                        <CardHeader className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg mx-auto mb-4">
                                <Building2 className="w-8 h-8 text-white" />
                            </div>
                            <CardTitle>Request Received</CardTitle>
                            <CardDescription>
                                Thank you for your interest in LumenID's verifier portal
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    We've received your access request for <strong>{formData.organization}</strong>.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Our team will review your application and contact you at <strong>{formData.email}</strong> within 3-5 business days.
                                </p>
                            </div>
                            <Link to={ROUTES.HOME}>
                                <Button className="w-full" variant="outline">
                                    Back to Home
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-2xl w-full space-y-8">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-lg mb-4">
                        <Building2 className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl text-center">Request Verifier Access</h1>
                    <p className="text-muted-foreground text-center mx-auto max-w-2xl">
                        Apply for institutional access to issue and verify blockchain-backed credentials
                    </p>
                </div>

                <Card className="border-2">
                    <CardHeader>
                        <CardTitle>Organization Information</CardTitle>
                        <CardDescription>
                            Please provide details about your institution or organization
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name *</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="fullName"
                                            type="text"
                                            placeholder="John Doe"
                                            value={formData.fullName}
                                            onChange={(e) =>
                                                setFormData({ ...formData, fullName: e.target.value })
                                            }
                                            className="pl-10"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="john@institution.edu"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({ ...formData, email: e.target.value })
                                            }
                                            className="pl-10"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="organization">Organization Name *</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="organization"
                                            type="text"
                                            placeholder="University of Example"
                                            value={formData.organization}
                                            onChange={(e) =>
                                                setFormData({ ...formData, organization: e.target.value })
                                            }
                                            className="pl-10"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="position">Position/Title</Label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="position"
                                            type="text"
                                            placeholder="Registrar"
                                            value={formData.position}
                                            onChange={(e) =>
                                                setFormData({ ...formData, position: e.target.value })
                                            }
                                            className="pl-10"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reason">Reason for Access Request</Label>
                                <Textarea
                                    id="reason"
                                    placeholder="Tell us why your organization needs verifier access..."
                                    value={formData.reason}
                                    onChange={(e) =>
                                        setFormData({ ...formData, reason: e.target.value })
                                    }
                                    rows={4}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                                <p className="text-xs text-muted-foreground">
                                    * Required fields. By submitting this form, you acknowledge that your information will be reviewed by our team. We typically respond within 3-5 business days.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-90 text-white border-0 shadow-lg"
                                size="lg"
                                disabled={isLoading}
                            >
                                {isLoading ? "Submitting Request..." : "Submit Access Request"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <Link
                        to={ROUTES.AUTH.VERIFIER_LOGIN}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to verifier login
                    </Link>
                </div>
            </div>
        </div>
    );
}