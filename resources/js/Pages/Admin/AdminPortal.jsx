import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/Components/ui/tabs";
import { Building2, LayoutGrid, Server } from "lucide-react";
import DepartmentsTab from "@/Components/admin/DepartmentsTab";
import CardsTab from "@/Components/admin/CardsTab";
import SystemsTab from "@/Components/admin/SystemsTab";

export default function AdminPortal() {
    return (
        <AuthenticatedLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">
                        Portal Management
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Manage departments, categories, and systems
                    </p>
                </div>

                <Tabs defaultValue="departments">
                    <TabsList className="mb-4">
                        <TabsTrigger
                            value="departments"
                            className="flex items-center gap-2"
                        >
                            <Building2 className="w-3.5 h-3.5" /> Departments
                        </TabsTrigger>
                        <TabsTrigger
                            value="cards"
                            className="flex items-center gap-2"
                        >
                            <LayoutGrid className="w-3.5 h-3.5" /> Cards
                        </TabsTrigger>
                        <TabsTrigger
                            value="systems"
                            className="flex items-center gap-2"
                        >
                            <Server className="w-3.5 h-3.5" /> Systems
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="departments">
                        <DepartmentsTab />
                    </TabsContent>
                    <TabsContent value="cards">
                        <CardsTab />
                    </TabsContent>
                    <TabsContent value="systems">
                        <SystemsTab />
                    </TabsContent>
                </Tabs>
            </div>
        </AuthenticatedLayout>
    );
}
