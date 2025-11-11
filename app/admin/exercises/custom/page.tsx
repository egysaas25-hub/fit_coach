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
import { useExercises, useCreateExercise, useUpdateExercise, useDeleteExercise } from '@/lib/hooks/api/useExercises'
import { Exercise } from '@/types/domain/exercise'

export default function CustomExercises() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  const { data: exercises, isLoading, error } = useExercises()
  const createExerciseMutation = useCreateExercise()
  const updateExerciseMutation = useUpdateExercise()
  const deleteExerciseMutation = useDeleteExercise()

  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('General')
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')
  const [equipment, setEquipment] = useState('')
  const [instructions, setInstructions] = useState('')

  const handleCreateExercise = () => {
    createExerciseMutation.mutate({
      name,
      description,
      category,
      difficulty,
      equipment: equipment ? [equipment] : [],
      muscleGroup: [],
      instructions: instructions ? [instructions] : [],
      isFavorite: false,
      usageCount: 0,
    }, {
      onSuccess: () => {
        setShowCreateModal(false)
        // Reset form
        setName('')
        setDescription('')
        setCategory('General')
        setDifficulty('intermediate')
        setEquipment('')
        setInstructions('')
      }
    })
  }

  const handleUpdateExercise = () => {
    if (!editingExercise) return
    
    updateExerciseMutation.mutate({
      id: editingExercise.id,
      exercise: {
        name,
        description,
        category,
        difficulty,
        equipment: equipment ? [equipment] : [],
        instructions: instructions ? [instructions] : [],
      }
    }, {
      onSuccess: () => {
        setEditingExercise(null)
        // Reset form
        setName('')
        setDescription('')
        setCategory('General')
        setDifficulty('intermediate')
        setEquipment('')
        setInstructions('')
      }
    })
  }

  const handleDeleteExercise = (id: string) => {
    if (confirm('Are you sure you want to delete this exercise?')) {
      deleteExerciseMutation.mutate(id)
    }
  }

  const openEditModal = (exercise: Exercise) => {
    setEditingExercise(exercise)
    setName(exercise.name)
    setDescription(exercise.description || '')
    setCategory(exercise.category)
    setDifficulty(exercise.difficulty)
    setEquipment(exercise.equipment.join(', ') || '')
    setInstructions(exercise.instructions.join('\n') || '')
  }

  const closeModal = () => {
    setShowCreateModal(false)
    setEditingExercise(null)
    // Reset form
    setName('')
    setDescription('')
    setCategory('General')
    setDifficulty('intermediate')
    setEquipment('')
    setInstructions('')
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading exercises</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

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
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading exercises...</p>
              </div>
            ) : exercises && exercises.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exercises.map((exercise) => (
                    <TableRow key={exercise.id}>
                      <TableCell className="font-medium">{exercise.name}</TableCell>
                      <TableCell className="text-muted-foreground">{exercise.description}</TableCell>
                      <TableCell>{exercise.category}</TableCell>
                      <TableCell>{exercise.difficulty}</TableCell>
                      <TableCell>{exercise.equipment.join(', ')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Edit"
                            onClick={() => openEditModal(exercise)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Delete"
                            onClick={() => handleDeleteExercise(exercise.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No custom exercises found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Modal */}
        <Dialog open={showCreateModal || !!editingExercise} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingExercise ? 'Edit Exercise' : 'Create Custom Exercise'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium mb-2">Exercise Name</Label>
                <Input
                  type="text"
                  placeholder="Enter name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2">Description</Label>
                <Textarea
                  placeholder="Describe the exercise..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2">Category</Label>
                <Input
                  type="text"
                  placeholder="General"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2">Difficulty</Label>
                <select
                  className="w-full p-2 border border-border rounded bg-background text-foreground"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2">Equipment</Label>
                <Input
                  type="text"
                  placeholder="Dumbbells, Barbell, etc."
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                />
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2">Instructions</Label>
                <Textarea
                  placeholder="Step-by-step instructions..."
                  rows={4}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
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
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button 
                onClick={editingExercise ? handleUpdateExercise : handleCreateExercise}
                disabled={createExerciseMutation.isPending || updateExerciseMutation.isPending}
              >
                {createExerciseMutation.isPending || updateExerciseMutation.isPending ? 'Saving...' : editingExercise ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}