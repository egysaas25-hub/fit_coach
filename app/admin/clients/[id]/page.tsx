"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, Phone, Mail, Calendar, TrendingUp, Activity, 
  Dumbbell, Apple, Camera, MessageSquare, FileText,
  Edit, MoreVertical, AlertCircle, CheckCircle
} from 'lucide-react';

import ClientDetail from "@/components/ClientDetail";

// Mock data fetch (replace with API/database in production)
async function fetchClient(id: string) {
  const mockClients = [
    {
      id: "C001",
      name: "Anna Carter",
      email: "anna.carter@example.com",
      phone: "+20123456789",
      avatar: "",
      status: "active",
      joinDate: "2024-01-15",
      currentRound: 2,
      totalRounds: 12,
      goal: "Fat Loss",
      trainer: "Mike Johnson",
      trainerTag: "JT",
      subscription: "Premium Monthly",
      nextBilling: "2025-02-15",
      adherence: { workout: 85, nutrition: 78 },
      stats: {
        currentWeight: 165,
        startWeight: 180,
        goalWeight: 150,
        workoutsCompleted: 24,
        mealsLogged: 156,
      },
    },
    // Add more mock clients as needed
  ];
  const client = mockClients.find((c) => c.id === id);
  if (!client) throw new Error("Client not found");
  return client;
}

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const client = await fetchClient(params.id);

  return <ClientDetail client={client} />;
}
