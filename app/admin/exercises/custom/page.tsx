"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/data-table/data-table"

const customExercises = [
  {
    id: 1,
    name: "Modified Push-Up",
    description: "Wall-assisted push-up",
    videoThumbnail: "🎥",
    sets: 3,
    reps: 10,
    created: "2025-01-15",
  },
  {
    id: 2,
    name: "Resistance Band Rows",
    description: "Using resistance band",
    videoThumbnail: "🎥",
    sets: 4,
    reps: 12,
    created: "2025-01-10",
  },
  {
    id: 3,
    name: "Knee Taps",
    description: "Core engagement exercise",
    videoThumbnail: "🎥",
    sets: 3,
    reps: 15,
    created: "2025-01-08",
  },
]

export default function CustomExercises() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">Custom Exercises</h1>
            <p className="text-muted-foreground">Manage user-created workouts with video uploads</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Exercise
          </Button>
        </div>

        {/* Custom Exercises Table */}
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Video</TableHead>
                  <TableHead>Sets x Reps</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customExercises.map((exercise) => (
                  <TableRow key={exercise.id}>
                    <TableCell className="font-medium">{exercise.name}</TableCell>
                    <TableCell className="text-muted-foreground">{exercise.description}</TableCell>
                    <TableCell className="text-2xl">{exercise.videoThumbnail}</TableCell>
                    <TableCell>
                      {exercise.sets} x {exercise.reps}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{exercise.created}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Custom Exercise</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium mb-2">Exercise Name</Label>
                <Input
                  type="text"
                  placeholder="Enter name..."
                />
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2">Description</Label>
                <Textarea
                  placeholder="Describe the exercise..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="block text-sm font-medium mb-2">Sets</Label>
                  <Input
                    type="number"
                    placeholder="3"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium mb-2">Reps</Label>
                  <Input
                    type="number"
                    placeholder="10"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium mb-2">Duration</Label>
                  <Input
                    type="text"
                    placeholder="30s"
                  />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2">Upload Video</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                  <p className="text-2xl mb-2">📹</p>
                  <p className="text-sm text-muted-foreground">Click or drag video here</p>
                </div>
              </div>
            </div>
            <DialogFooter className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}