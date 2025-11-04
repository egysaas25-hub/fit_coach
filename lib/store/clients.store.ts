// lib/store/clients.store.ts
import { create } from 'zustand';
import { Client } from '@/types/models/client.model';
import { clientService } from '@/lib/api/services/client.service';

interface ClientState {
  clients: Client[];
  selectedClient: Client | null;
  filters: { status?: string; search?: string };
  fetchClients: (tenantId?: number) => Promise<void>;
  setSelectedClient: (client: Client | null) => void;
  setFilters: (filters: { status?: string; search?: string }) => void;
}

export const useClientsStore = create<ClientState>((set) => ({
  clients: [],
  selectedClient: null,
  filters: {},
  fetchClients: async (tenantId?: number) => {
    const clients = await clientService.getAll(tenantId);
    set({ clients });
  },
  setSelectedClient: (selectedClient) => set({ selectedClient }),
  setFilters: (filters) => set({ filters }),
}));