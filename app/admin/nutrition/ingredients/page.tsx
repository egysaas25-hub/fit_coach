"use client"

import { Plus, Search } from "lucide-react"
import { useState } from "react"

const ingredients = [
  {
    id: 1,
    name: "Chicken Breast",
    calories: 165,
    protein: 31,
    carbs: 0,
    fats: 3.6,
    category: "Protein",
    allergens: ["None"],
  },
  { id: 2, name: "Salmon", calories: 208, protein: 20, carbs: 0, fats: 13, category: "Protein", allergens: ["Fish"] },
  {
    id: 3,
    name: "Brown Rice",
    calories: 111,
    protein: 2.6,
    carbs: 23,
    fats: 0.9,
    category: "Carbs",
    allergens: ["None"],
  },
  { id: 4, name: "Olive Oil", calories: 884, protein: 0, carbs: 0, fats: 100, category: "Fats", allergens: ["None"] },
  {
    id: 5,
    name: "Broccoli",
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fats: 0.4,
    category: "Vegetables",
    allergens: ["None"],
  },
  { id: 6, name: "Eggs", calories: 155, protein: 13, carbs: 1.1, fats: 11, category: "Protein", allergens: ["Eggs"] },
]

export default function IngredientsLibrary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", "Protein", "Carbs", "Vegetables", "Fruits", "Fats"]

  const filtered = ingredients.filter((ing) => {
    const matchesSearch = ing.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || ing.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">Ingredients Library</h1>
          <p className="text-muted-foreground">Nutritional values, allergens, and categories</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Add Ingredient
        </button>
      </div>

      {/* Search & Filter */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Search</label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background text-foreground placeholder-muted-foreground px-4 py-2 pl-10 rounded-lg border border-border focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-background text-foreground px-4 py-2 rounded-lg border border-border focus:outline-none focus:border-primary"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ingredients Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">Category</th>
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">Calories/100g</th>
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">Protein (g)</th>
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">Carbs (g)</th>
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">Fats (g)</th>
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">Allergens</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ingredient) => (
                <tr key={ingredient.id} className="border-b border-border hover:bg-accent transition-colors">
                  <td className="px-6 py-3 text-foreground font-medium">{ingredient.name}</td>
                  <td className="px-6 py-3 text-muted-foreground">{ingredient.category}</td>
                  <td className="px-6 py-3 text-foreground">{ingredient.calories}</td>
                  <td className="px-6 py-3 text-foreground">{ingredient.protein}</td>
                  <td className="px-6 py-3 text-foreground">{ingredient.carbs}</td>
                  <td className="px-6 py-3 text-foreground">{ingredient.fats}</td>
                  <td className="px-6 py-3 text-muted-foreground text-xs">{ingredient.allergens.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
