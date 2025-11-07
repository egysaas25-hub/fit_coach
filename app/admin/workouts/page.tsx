// app/admin/workouts/page.tsx
'use client';
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

// Mock data - replace with your actual data
const mockStats = {
  totalPrograms: 12,
  activeClients: 45,
  completionRate: 87,
  avgDuration: 8
};

const mockPrograms = [
  { id: 1, name: "Beginner Full Body", clients: 15, duration: "8 weeks", difficulty: "Beginner" },
  { id: 2, name: "Advanced Strength", clients: 12, duration: "12 weeks", difficulty: "Advanced" },
];

const mockTemplates = [
  { id: 1, name: "Upper Body Push", exercises: 8, category: "Strength" },
  { id: 2, name: "Lower Body Power", exercises: 10, category: "Strength" },
];

const mockExercises = [
  { id: 1, name: "Barbell Bench Press", category: "Chest", equipment: "Barbell" },
  { id: 2, name: "Squat", category: "Legs", equipment: "Barbell" },
];

export default function WorkoutPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"programs" | "templates" | "exercises" | "overview">("programs");

  const handleCreateProgram = () => {
    router.push("/admin/workouts/builder");
  };

  const handleEditProgram = (programId: number) => {
    toast.info(`Editing program ${programId}`);
    router.push(`/admin/workouts/edit/${programId}`);
  };

  const handleDuplicateProgram = (programName: string) => {
    toast.success(`Duplicated ${programName}`);
  };

  const handleDeleteProgram = (programName: string) => {
    toast.error(`Deleted ${programName}`);
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 space-y-6 p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-heading">Workout Management</h1>
            <p className="text-muted-foreground mt-2">Create and manage workout programs, templates, and exercises</p>
          </div>
          <Button onClick={handleCreateProgram}>
            <Plus className="h-4 w-4 mr-2" />
            Create Program
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <p className="text-sm font-medium text-muted-foreground">Total Programs</p>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalPrograms}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.activeClients}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.completionRate}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <p className="text-sm font-medium text-muted-foreground">Avg Duration</p>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.avgDuration} weeks</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search programs, templates, and exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="space-y-4">
              <TabsList>
                <TabsTrigger value="programs">Programs</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="exercises">Exercise Library</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
              </TabsList>

              <TabsContent value="programs">
                <div className="space-y-4">
                  {mockPrograms.map((program) => (
                    <div key={program.id} className="p-4 border rounded-lg">
                      <h3 className="font-semibold">{program.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {program.clients} clients • {program.duration} • {program.difficulty}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" onClick={() => handleEditProgram(program.id)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDuplicateProgram(program.name)}>
                          Duplicate
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteProgram(program.name)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="templates">
                <div className="grid gap-4 md:grid-cols-2">
                  {mockTemplates.map((template) => (
                    <div key={template.id} className="p-4 border rounded-lg">
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {template.exercises} exercises • {template.category}
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="exercises">
                <div className="space-y-4">
                  {mockExercises.map((exercise) => (
                    <div key={exercise.id} className="p-4 border rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{exercise.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {exercise.category} • {exercise.equipment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="overview">
                <div className="text-center py-8 text-muted-foreground">
                  Overview dashboard coming soon
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}