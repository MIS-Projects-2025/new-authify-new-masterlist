import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

export default function Invalid() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Card className="w-full max-w-sm shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center text-red-500">
                        Invalid Access
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-slate-500">
                        No redirect URL was provided. Please access this page
                        from a valid system.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
