import ClientDetail from "@/components/ClientDetail";
import { database } from '@/lib/mock-db/database';
import { Client, Trainer } from '@/types/lib/mock-db/types';
import { notFound } from 'next/navigation';

// Function to fetch client data from the database
async function fetchClient(id: string) {
  // Ensure database is initialized
  const clients = database.getAll<Client>('clients');
  const client = clients.find((c) => c.id === id);
  
  if (!client) {
    return null;
  }
  
  // Get trainer information
  const trainers = database.getAll<Trainer>('trainers');
  const trainer = trainers.find((t) => t.id === client.trainerId);
  
  // Get workout logs for adherence calculation
  const workoutLogs = database.query<any>('workoutLogs', (log: any) => log.clientId === client.id);
  const nutritionLogs = database.query<any>('nutritionLogs', (log: any) => log.clientId === client.id);
  
  // Get progress entries
  const progressEntries = database.query<any>('progressEntries', (entry: any) => entry.clientId === client.id);
  
  // Calculate adherence percentages
  const totalWorkouts = workoutLogs.length;
  const completedWorkouts = workoutLogs.filter((log: any) => log.performanceMetrics?.completed).length;
  const workoutAdherence = totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;
  
  const totalNutritionLogs = nutritionLogs.length;
  const nutritionAdherence = totalNutritionLogs > 0 ? Math.round((totalNutritionLogs / 30) * 100) : 0; // Assuming 30 days in a month
  
  // Get weight data
  const weightEntries = progressEntries.filter((entry: any) => entry.metric === 'weight');
  const currentWeight = weightEntries.length > 0 ? weightEntries[weightEntries.length - 1].value : 0;
  const startWeight = weightEntries.length > 0 ? weightEntries[0].value : 0;
  const goalWeight = currentWeight > 0 ? currentWeight - 10 : 150; // Mock goal weight
  
  // Format client data to match the expected structure
  return {
    id: client.id,
    name: client.name,
    email: client.email,
    phone: "+1234567890", // Mock phone number
    avatar: "",
    status: "active",
    joinDate: client.createdAt.toLocaleDateString(),
    currentRound: 2, // Mock data
    totalRounds: 12, // Mock data
    goal: "Fat Loss", // Mock data
    trainer: trainer ? trainer.name : "No Trainer Assigned",
    trainerTag: trainer ? trainer.name.split(" ").map(n => n[0]).join("") : "NT",
    subscription: "Premium Monthly", // Mock data
    nextBilling: "2025-02-15", // Mock data
    adherence: { 
      workout: workoutAdherence, 
      nutrition: nutritionAdherence 
    },
    stats: {
      currentWeight: currentWeight || 165,
      startWeight: startWeight || 180,
      goalWeight: goalWeight,
      workoutsCompleted: completedWorkouts,
      mealsLogged: totalNutritionLogs,
    },
  };
}

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const client = await fetchClient(params.id);
  
  if (!client) {
    notFound();
  }

  return <ClientDetail client={client} />;
}