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
import { Exercise } from '@/types/domain/workout.model';

const EXERCISES: Exercise[] = [
  {
    id: '1',
    name: 'Barbell Back Squat',
    category: 'Compound',
    muscleGroup: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    equipment: ['Barbell', 'Squat Rack'],
    difficulty: 'intermediate',
    description: 'A fundamental lower body compound exercise that builds strength and mass.',
    instructions: [
      'Position barbell on upper back',
      'Stand with feet shoulder-width apart',
      'Lower by bending knees and hips',
      'Keep chest up and core tight',
      'Push through heels to return'
    ],
    videoUrl: '/videos/squat.mp4',
    imageUrl: '/exercises/squat.jpg',
    variations: ['Front Squat', 'Goblet Squat', 'Bulgarian Split Squat'],
    isFavorite: true,
    usageCount: 245
  },
  {
    id: '2',
    name: 'Bench Press',
    category: 'Compound',
    muscleGroup: ['Chest', 'Triceps', 'Shoulders'],
    equipment: ['Barbell', 'Bench'],
    difficulty: 'intermediate',
    description: 'Primary chest exercise for building upper body strength and size.',
    instructions: [
      'Lie flat on bench with feet on floor',
      'Grip bar slightly wider than shoulder-width',
      'Lower bar to mid-chest with control',
      'Press bar up explosively',
      'Lock out elbows at top'
    ],
    videoUrl: '/videos/bench.mp4',
    imageUrl: '/exercises/bench.jpg',
    variations: ['Incline Bench', 'Decline Bench', 'Dumbbell Press'],
    isFavorite: true,
    usageCount: 312
  },
  {
    id: '3',
    name: 'Deadlift',
    category: 'Compound',
    muscleGroup: ['Back', 'Glutes', 'Hamstrings', 'Core'],
    equipment: ['Barbell'],
    difficulty: 'advanced',
    description: 'King of exercises for overall strength and muscle development.',
    instructions: [
      'Stand with feet hip-width apart',
      'Bend and grip bar at shoulder-width',
      'Keep back straight and chest up',
      'Drive through legs to stand',
      'Lower bar with control'
    ],
    videoUrl: '/videos/deadlift.mp4',
    imageUrl: '/exercises/deadlift.jpg',
    variations: ['Romanian Deadlift', 'Sumo Deadlift', 'Trap Bar Deadlift'],
    isFavorite: false,
    usageCount: 189
  },
  {
    id: '4',
    name: 'Pull-ups',
    category: 'Compound',
    muscleGroup: ['Back', 'Biceps', 'Core'],
    equipment: ['Pull-up Bar'],
    difficulty: 'intermediate',
    description: 'Essential bodyweight exercise for back width and strength.',
    instructions: [
      'Hang from bar with palms facing away',
      'Engage lats and pull up',
      'Bring chin over bar',
      'Lower with control',
      'Maintain full range of motion'
    ],
    videoUrl: '/videos/pullup.mp4',
    imageUrl: '/exercises/pullup.jpg',
    variations: ['Chin-ups', 'Neutral Grip', 'Weighted Pull-ups'],
    isFavorite: true,
    usageCount: 276
  },
  {
    id: '5',
    name: 'Dumbbell Shoulder Press',
    category: 'Isolation',
    muscleGroup: ['Shoulders', 'Triceps'],
    equipment: ['Dumbbells', 'Bench'],
    difficulty: 'beginner',
    description: 'Build strong, defined shoulders with this fundamental pressing movement.',
    instructions: [
      'Sit with back supported',
      'Hold dumbbells at shoulder height',
      'Press weights overhead',
      'Lower with control',
      'Keep core engaged'
    ],
    isFavorite: false,
    usageCount: 198
  }
];

const CATEGORIES = ['All', 'Compound', 'Isolation', 'Cardio', 'Flexibility'];
const MUSCLE_GROUPS = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'];
const EQUIPMENT = ['All', 'Barbell', 'Dumbbell', 'Bodyweight', 'Machine', 'Cable'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function ExerciseLibrary() {
  const [exercises, setExercises] = useState(EXERCISES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Filter exercises
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || exercise.category === selectedCategory;
    const matchesMuscleGroup = selectedMuscleGroup === 'All' || 
                               exercise.muscleGroup.includes(selectedMuscleGroup);
    const matchesEquipment = selectedEquipment === 'All' || 
                            exercise.equipment.includes(selectedEquipment);
    const matchesDifficulty = selectedDifficulty === 'All' || 
                             exercise.difficulty === selectedDifficulty.toLowerCase();

    return matchesSearch && matchesCategory && matchesMuscleGroup && 
           matchesEquipment && matchesDifficulty;
  });

  const toggleFavorite = (id: string) => {
    setExercises(prev => prev.map(ex => 
      ex.id === id ? { ...ex, isFavorite: !ex.isFavorite } : ex
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'advanced': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Exercise Library</h1>
            <p className="text-muted-foreground mt-2">
              Browse {exercises.length} exercises with detailed instructions and videos
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
                  <p className="text-sm text-muted-foreground">Total Exercises</p>
                  <p className="text-2xl font-bold mt-1">{exercises.length}</p>
                </div>
                <Dumbbell className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Favorites</p>
                  <p className="text-2xl font-bold mt-1">
                    {exercises.filter(e => e.isFavorite).length}
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold mt-1">{CATEGORIES.length - 1}</p>
                </div>
                <Target className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Most Used</p>
                  <p className="text-2xl font-bold mt-1">
                    {Math.max(...exercises.map(e => e.usageCount))}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-[#00C26A]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search exercises by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="grid gap-3 md:grid-cols-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Muscle Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {MUSCLE_GROUPS.map(mg => (
                      <SelectItem key={mg} value={mg}>{mg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {EQUIPMENT.map(eq => (
                      <SelectItem key={eq} value={eq}>{eq}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTIES.map(diff => (
                      <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredExercises.length} of {exercises.length} exercises
                </p>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    List
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Grid */}
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredExercises.map((exercise) => (
            <Card key={exercise.id} className="overflow-hidden hover:border-[#00C26A]/50 transition-colors">
              <div className="relative h-48 bg-muted">
                {exercise.imageUrl ? (
                  <img 
                    src={exercise.imageUrl} 
                    alt={exercise.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Dumbbell className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
                
                {/* Overlay Buttons */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 bg-background/80 hover:bg-background"
                    onClick={() => toggleFavorite(exercise.id)}
                  >
                    <Star 
                      className={`w-4 h-4 ${exercise.isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`} 
                    />
                  </Button>
                  {exercise.videoUrl && (
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 bg-background/80 hover:bg-background"
                    >
                      <PlayCircle className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Difficulty Badge */}
                <div className="absolute bottom-2 left-2">
                  <Badge className={getDifficultyColor(exercise.difficulty)}>
                    {exercise.difficulty}
                  </Badge>
                </div>
              </div>

              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg mb-2">{exercise.name}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {exercise.description}
                </p>

                {/* Muscle Groups */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {exercise.muscleGroup.map(mg => (
                    <Badge key={mg} variant="outline" className="text-xs">
                      {mg}
                    </Badge>
                  ))}
                </div>

                {/* Equipment */}
                <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                  <Activity className="w-3 h-3" />
                  <span>{exercise.equipment.join(', ')}</span>
                </div>

                {/* Usage Count */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>Used in {exercise.usageCount} programs</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedExercise(exercise)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      {selectedExercise && (
                        <>
                          <DialogHeader>
                            <DialogTitle>{selectedExercise.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {/* Video/Image */}
                            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                              <PlayCircle className="w-16 h-16 text-muted-foreground" />
                            </div>

                            {/* Details */}
                            <div>
                              <h4 className="font-semibold mb-2">Description</h4>
                              <p className="text-sm text-muted-foreground">
                                {selectedExercise.description}
                              </p>
                            </div>

                            {/* Instructions */}
                            <div>
                              <h4 className="font-semibold mb-2">Instructions</h4>
                              <ol className="space-y-2">
                                {selectedExercise.instructions.map((instruction, i) => (
                                  <li key={i} className="text-sm flex gap-2">
                                    <span className="font-semibold">{i + 1}.</span>
                                    <span>{instruction}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>

                            {/* Variations */}
                            {selectedExercise.variations && (
                              <div>
                                <h4 className="font-semibold mb-2">Variations</h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedExercise.variations.map(variation => (
                                    <Badge key={variation} variant="secondary">
                                      {variation}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" size="sm">
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredExercises.length === 0 && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Dumbbell className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No exercises found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search query
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}