// scripts/generate-mock-data.js
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const OUTPUT_DIR = path.join(process.cwd(), 'mock');
const TENANT_ID = 1;

// Parse nutrition.csv
function parseNutritionFacts() {
  const nutritionData = [];
  fs.createReadStream(path.join(DATA_DIR, 'nutrition.csv'))
    .pipe(csv())
    .on('data', (row) => {
      nutritionData.push({
        id: nutritionData.length + 1,
        tenant_id: TENANT_ID,
        food_name: { en: row.food_name },
        portion_size: row.portion_size,
        calories: parseFloat(row.calories),
        protein_g: parseFloat(row.protein_g),
        carbs_g: parseFloat(row.carbs_g),
        fat_g: parseFloat(row.fat_g),
        fiber_g: parseFloat(row.fiber_g),
        category: row.category,
      });
    })
    .on('end', () => {
      console.log(`Parsed ${nutritionData.length} nutrition facts.`);
      return nutritionData;
    });
  return new Promise((resolve) => setTimeout(() => resolve(nutritionData), 100)); // Wait for async
}

// Parse fitness.json
function parseExercises() {
  const fitnessData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'fitness.json'), 'utf8'));
  return fitnessData.map((item, i) => ({
    id: i + 1,
    tenant_id: TENANT_ID,
    name: { en: item.name },
    training_type_id: 1,
    muscle_group_id: 1,
    description: { en: item.description },
    equipment_needed: item.equipment_needed,
    calories_burned_per_min: parseFloat(item.calories_burned_per_min),
  }));
}

// Generate synthetic data
function generateSyntheticData() {
  return {
    customers: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      tenant_id: TENANT_ID,
      email: `user${i + 1}@fitcoach.com`,
      name: `User ${i + 1}`,
      role: i === 0 ? 'admin' : 'client',
    })),
    subscriptions: Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      tenant_id: TENANT_ID,
      customer_id: i + 1,
      plan_name: `Plan ${i + 1}`,
      status: 'active',
    })),
    training_plans: Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      tenant_id: TENANT_ID,
      customer_id: 1,
      version: 1,
      split: `Split ${i + 1}`,
      notes: `Plan for week ${i + 1}`,
    })),
    nutrition_plans: Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      tenant_id: TENANT_ID,
      customer_id: 1,
      version: 1,
      calories_target: 2000 + i * 500,
      notes: `Diet plan ${i + 1}`,
    })),
    progress_tracking: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      tenant_id: TENANT_ID,
      customer_id: 1,
      weight_kg: 80 - i * 0.5,
      waist_cm: 85 - i * 0.2,
      recorded_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    })),
  };
}

async function main() {
  const nutritionFacts = await parseNutritionFacts();
  const exercises = parseExercises();
  const syntheticData = generateSyntheticData();

  const mockData = {
    nutrition_facts: nutritionFacts,
    exercises,
    ...syntheticData,
  };

  fs.writeFileSync(path.join(OUTPUT_DIR, 'mock-data.json'), JSON.stringify(mockData, null, 2));
  console.log('Mock data generated at mock/mock-data.json');
}

main().catch(console.error);