import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Search, Filter, Plus, Video, Image as ImageIcon, 
  Dumbbell, Heart, Target, Activity, TrendingUp,
  Star, Eye, Copy, Edit, Trash2, PlayCircle
} from 'lucide-react';
import { useExercises } from '@/lib/hooks/api/useExercises';
import { Exercise } from '@/types/domain/exercise';

const CATEGORIES = ['All', 'Compound', 'Isolation', 'Cardio', 'Flexibility'];
const MUSCLE_GROUPS = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'];
const EQUIPMENT = ['All', 'Barbell', 'Dumbbell', 'Bodyweight', 'Machine', 'Cable'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function ExerciseLibrary() {
  const { data: exercises, isLoading, error } = useExercises();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Filter exercises
  const filteredExercises = exercises?.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || exercise.category === selectedCategory;
    const matchesMuscleGroup = selectedMuscleGroup === 'All' || 
                               exercise.muscleGroup.some(mg => mg.includes(selectedMuscleGroup));
    const matchesEquipment = selectedEquipment === 'All' || 
                            exercise.equipment.some(eq => eq.includes(selectedEquipment));
    const matchesDifficulty = selectedDifficulty === 'All' || 
                             exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1) === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesMuscleGroup && 
           matchesEquipment && matchesDifficulty;
  }) || [];

  const toggleFavorite = (id: string) => {
    // In a real app, this would call an API to update the favorite status
    console.log(`Toggling favorite for exercise ${id}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'advanced': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return '';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading exercises</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Exercise Library</h1>
            <p className="text-muted-foreground mt-2">
              Browse {isLoading ? '...' : exercises?.length || 0} exercises with detailed instructions and videos
            </p>
          </div>
          <Button className="bg-[#00C26A] hover:bg-[#00C26A]/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Exercise
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Exercises</p>
                  <p className="text-2xl font-bold">{isLoading ? '--' : exercises?.length || 0}</p>
                </div>
                <Dumbbell className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Equipment Types</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Favorites</p>
                  <p className="text-2xl font-bold">
                    {isLoading ? '--' : exercises?.filter(e => e.isFavorite).length || 0}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search exercises..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Muscle Group" />
                </SelectTrigger>
                <SelectContent>
                  {MUSCLE_GROUPS.map(group => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Equipment" />
                </SelectTrigger>
                <SelectContent>
                  {EQUIPMENT.map(eq => (
                    <SelectItem key={eq} value={eq}>{eq}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map(diff => (
                    <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading exercises...</p>
          </div>
        )}

        {/* Exercise Grid/List */}
        {!isLoading && (
          <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
            {filteredExercises.map((exercise) => (
              <Card 
                key={exercise.id} 
                className="hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => setSelectedExercise(exercise)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Dumbbell className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{exercise.name}</h3>
                        <p className="text-sm text-muted-foreground">{exercise.category}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(exercise.id);
                      }}
                    >
                      <Heart 
                        className={`h-4 w-4 ${exercise.isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
                      />
                    </Button>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                    </Badge>
                    {exercise.muscleGroup.slice(0, 2).map((muscle, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {muscle}
                      </Badge>
                    ))}
                    {exercise.muscleGroup.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{exercise.muscleGroup.length - 2}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <PlayCircle className="h-4 w-4" />
                      <span>{exercise.usageCount} uses</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {exercise.videoUrl && <Video className="h-4 w-4" />}
                      {exercise.imageUrl && <ImageIcon className="h-4 w-4" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredExercises.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No exercises found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button variant="outline">Clear Filters</Button>
          </div>
        )}

        {/* Exercise Detail Dialog */}
        <Dialog open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedExercise && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedExercise.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getDifficultyColor(selectedExercise.difficulty)}>
                      {selectedExercise.difficulty.charAt(0).toUpperCase() + selectedExercise.difficulty.slice(1)}
                    </Badge>
                    <Badge variant="secondary">{selectedExercise.category}</Badge>
                    {selectedExercise.equipment.map((eq, index) => (
                      <Badge key={index} variant="outline">{eq}</Badge>
                    ))}
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold mb-2">Muscle Groups</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedExercise.muscleGroup.map((muscle, index) => (
                          <Badge key={index} variant="outline">{muscle}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Statistics</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>Usage Count: {selectedExercise.usageCount}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground">{selectedExercise.description || 'No description available.'}</p>
                  </div>
                  
                  {selectedExercise.instructions && selectedExercise.instructions.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Instructions</h4>
                      <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                        {selectedExercise.instructions.map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  
                  {(selectedExercise.videoUrl || selectedExercise.imageUrl) && (
                    <div>
                      <h4 className="font-semibold mb-2">Media</h4>
                      <div className="flex gap-4">
                        {selectedExercise.videoUrl && (
                          <div className="flex-1">
                            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                              <Video className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <p className="text-center text-sm mt-2 text-muted-foreground">Video Demo</p>
                          </div>
                        )}
                        {selectedExercise.imageUrl && (
                          <div className="flex-1">
                            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                              <ImageIcon className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <p className="text-center text-sm mt-2 text-muted-foreground">Image Reference</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}