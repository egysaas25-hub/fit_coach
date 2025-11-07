import { Card } from "@/components/ui/card"

interface ExerciseCardProps {
  name: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  equipment: string
  muscleGroup: string
}

export function ExerciseCard({ name, category, difficulty, equipment, muscleGroup }: ExerciseCardProps) {
  const difficultyColors = {
    Beginner: "text-[#21ee43] bg-[#21ee43]/20",
    Intermediate: "text-yellow-500 bg-yellow-500/20",
    Advanced: "text-red-500 bg-red-500/20",
  }

  return (
    <Card className="bg-[#2a2a2a] border-[#3a3a3a] p-4 hover:bg-[#2f2f2f] transition-colors cursor-pointer">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-lg bg-[#21ee43]/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-[#21ee43]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-white">{name}</h3>
            <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${difficultyColors[difficulty]}`}>
              {difficulty}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">{muscleGroup}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                {category}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                {equipment}
              </span>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Card>
  )
}
