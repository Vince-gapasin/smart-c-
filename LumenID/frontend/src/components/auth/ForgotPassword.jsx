import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { ROUTES } from "../../constants/routes";

export function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsEmailSent(true);
            toast.success("Password reset instructions sent to your email");
            setIsLoading(false);
        }, 1000);
    };

    if (isEmailSent) {
        return (
            <div className="min-h-screen flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full space-y-8">
                    <Card className="border-2">
                        <CardHeader className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg mx-auto mb-4">
                                <Mail className="w-8 h-8 text-white" />
                            </div>
                            <CardTitle>Check Your Email</CardTitle>
                            <CardDescription>
                                We've sent password reset instructions to <strong>{email}</strong>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                                <p className="text-sm text-muted-foreground">
                                    If you don't see the email, check your spam folder or try again with a different email address.
                                </p>
                            </div>
                            <Link to={ROUTES.AUTH.ROLE_SELECTION}>
                                <Button className="w-full" variant="outline">
                                    Back to Login
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
            <div className="max-w-md w-full space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl text-center">Reset Password</h1>
                    <p className="text-muted-foreground text-center mx-auto max-w-sm">
                        Enter your email address and we'll send you instructions to reset your password
                    </p>
                </div>

                <Card className="border-2">
                    <CardHeader>
                        <CardTitle>Password Recovery</CardTitle>
                        <CardDescription>
                            We'll send you a secure link to reset your password
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:opacity-90 text-white border-0"
                                disabled={isLoading}
                            >
                                {isLoading ? "Sending..." : "Send Reset Link"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <Link
                        to={ROUTES.AUTH.ROLE_SELECTION}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}