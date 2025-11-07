"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { use } from "react"

const exerciseDetails = {
  1: {
    name: "Bench Press",
    category: "Chest",
    difficulty: "Intermediate",
    equipment: "Barbell",
    muscleGroup: "Chest, Triceps",
    description:
      "The bench press is a compound exercise that primarily targets the chest muscles, along with the triceps and shoulders. It's one of the most popular exercises for building upper body strength.",
    instructions: [
      "Lie flat on a bench with your feet firmly on the ground",
      "Grip the barbell slightly wider than shoulder-width",
      "Lower the bar to your chest in a controlled manner",
      "Press the bar back up to the starting position",
      "Keep your core engaged throughout the movement",
    ],
    sets: "3-4",
    reps: "8-12",
    rest: "90-120 seconds",
  },
}

export default function ExerciseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const exercise = exerciseDetails[1] // Default to bench press for demo

  const difficultyColors = {
    Beginner: "text-[#21ee43]",
    Intermediate: "text-yellow-500",
    Advanced: "text-red-500",
  }

  return (
    <div className="min-h-screen bg-[#1e1e1e] pb-24">
      {/* Header */}
      <header className="border-b border-[#2a2a2a] bg-[#1e1e1e] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/exercises">
              <Button variant="ghost" size="icon" className="text-white hover:bg-[#2a2a2a]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Exercise Details</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Exercise Image Placeholder */}
        <Card className="bg-[#2a2a2a] border-[#3a3a3a] p-0 overflow-hidden">
          <div className="aspect-video bg-[#1e1e1e] flex items-center justify-center">
            <svg className="w-24 h-24 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
        </Card>

        {/* Exercise Info */}
        <div className="space-y-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">{exercise.name}</h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-[#2a2a2a] text-sm">{exercise.category}</span>
              <span className={`px-3 py-1 rounded-full bg-[#2a2a2a] text-sm ${difficultyColors[exercise.difficulty]}`}>
                {exercise.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#2a2a2a] text-sm">{exercise.equipment}</span>
            </div>
          </div>

          {/* Description */}
          <Card className="bg-[#2a2a2a] border-[#3a3a3a] p-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{exercise.description}</p>
          </Card>

          {/* Target Muscles */}
          <Card className="bg-[#2a2a2a] border-[#3a3a3a] p-4">
            <h3 className="font-semibold mb-2">Target Muscles</h3>
            <p className="text-gray-400 text-sm">{exercise.muscleGroup}</p>
          </Card>

          {/* Instructions */}
          <Card className="bg-[#2a2a2a] border-[#3a3a3a] p-4">
            <h3 className="font-semibold mb-3">How to Perform</h3>
            <ol className="space-y-2">
              {exercise.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3 text-sm text-gray-400">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#21ee43]/20 text-[#21ee43] flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{instruction}</span>
                </li>
              ))}
            </ol>
          </Card>

          {/* Recommended Sets/Reps */}
          <Card className="bg-[#2a2a2a] border-[#3a3a3a] p-4">
            <h3 className="font-semibold mb-3">Recommended</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-400 text-xs mb-1">Sets</p>
                <p className="text-lg font-semibold">{exercise.sets}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Reps</p>
                <p className="text-lg font-semibold">{exercise.reps}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Rest</p>
                <p className="text-lg font-semibold">{exercise.rest}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1 bg-[#21ee43] text-black hover:bg-[#21ee43]/90 font-semibold">Add to Workout</Button>
          <Button variant="outline" className="bg-[#2a2a2a] border-[#3a3a3a] text-white hover:bg-[#3a3a3a]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}
