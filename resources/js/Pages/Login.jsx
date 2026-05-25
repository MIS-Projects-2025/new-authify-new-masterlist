import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Eye,
    EyeOff,
    Building2,
    ArrowRight,
    Fingerprint,
    ShieldCheck,
    Zap,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

function MeshBackground() {
    return (
        <>
            <div className="absolute inset-0 dark:hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[80px]" />
            </div>
            <div className="absolute inset-0 hidden dark:block">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/30 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-slate-800/60 blur-[80px]" />
            </div>

            <svg className="absolute inset-0 w-full h-full opacity-[0.035] dark:opacity-[0.06]">
                <defs>
                    <pattern
                        id="dots"
                        width="24"
                        height="24"
                        patternUnits="userSpaceOnUse"
                    >
                        <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
        </>
    );
}

function Pill({ icon: Icon, label }) {
    return (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 backdrop-blur-sm text-slate-700 dark:text-slate-300 text-xs font-medium shadow-sm">
            <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
            {label}
        </div>
    );
}

export default function Login({ redirectUrl }) {
    const [showPassword, setShowPassword] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [mounted, setMounted] = useState(false);

    const [data, setData] = useState({
        employeeID: "",
        password: "",
        redirect: redirectUrl,
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    function handleChange(field, value) {
        setData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await axios.post(route("sso.login.post"), data, {
                validateStatus: (status) => status < 500,
            });

            if (response.data?.success && response.data?.redirect_url) {
                window.location.href = response.data.redirect_url;
                return;
            }

            if (response.status === 422) {
                const validationErrors = response.data?.errors ?? {};
                setErrors(validationErrors);
                const firstError = Object.values(validationErrors)[0];
                if (firstError)
                    toast.error(
                        Array.isArray(firstError) ? firstError[0] : firstError,
                    );
            } else {
                toast.error("Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setProcessing(false);
        }
    }

    return (
        <div className="relative min-h-screen flex bg-background text-foreground overflow-hidden">
            <MeshBackground />

            {/* LEFT */}
            <div
                className="hidden lg:flex lg:w-[52%] flex-col justify-between p-14"
                style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateX(0)" : "translateX(-20px)",
                    transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
            >
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg">
                        <Building2 className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="font-semibold text-sm">
                        Telford Portal
                    </span>
                </div>

                <div className="rounded-3xl p-10 bg-card border shadow-xl backdrop-blur-xl">
                    <div className="mb-8 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground border">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Single Sign-On Active
                    </div>

                    <h1 className="text-4xl font-bold mb-3">
                        One identity,
                        <br />
                        <span className="text-primary">every system.</span>
                    </h1>

                    <p className="text-muted-foreground text-sm mb-8 max-w-xs">
                        Telford Portal SSO lets you securely access all systems
                        with one account.
                    </p>

                    <div className="flex flex-wrap gap-2">
                        <Pill icon={ShieldCheck} label="End-to-end encrypted" />
                        <Pill icon={Fingerprint} label="Identity verified" />
                        <Pill icon={Zap} label="Instant access" />
                    </div>
                </div>

                <p className="text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Telford Portal
                </p>
            </div>

            {/* RIGHT */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-[380px]">
                    {/* Mobile Logo */}
                    <div className="flex lg:hidden justify-center gap-2 mb-8">
                        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                            <Building2 className="w-3.5 h-3.5 text-primary-foreground" />
                        </div>
                        <span className="font-semibold text-sm">
                            Telford Portal
                        </span>
                    </div>

                    <Card className="bg-card border shadow-xl backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle>Welcome back</CardTitle>
                            <CardDescription>
                                Sign in with your employee credentials
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label>Employee ID</Label>
                                    <Input
                                        value={data.employeeID}
                                        onChange={(e) =>
                                            handleChange(
                                                "employeeID",
                                                e.target.value,
                                            )
                                        }
                                        disabled={processing}
                                        className="focus-visible:ring-primary focus-visible:border-primary"
                                    />
                                </div>

                                <div>
                                    <Label>Password</Label>
                                    <div className="relative">
                                        <Input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={data.password}
                                            onChange={(e) =>
                                                handleChange(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                            disabled={processing}
                                            className="pr-10 focus-visible:ring-primary focus-visible:border-primary"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    {processing ? "Signing in..." : "Sign in"}
                                    {!processing && (
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    )}
                                </Button>
                            </form>

                            <p className="text-center text-xs text-muted-foreground mt-6">
                                Need help?{" "}
                                <a
                                    href="#"
                                    className="hover:text-primary underline"
                                >
                                    Contact IT Support
                                </a>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
