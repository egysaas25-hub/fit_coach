// lib/store/clients.store.ts
import { create } from 'zustand';
import { Client, ClientState } from '@/types/domain/client.model';

export const useClientsStore = create<ClientState>(set => ({
  selectedClient: null,
  filters: {},
  setSelectedClient: selectedClient => set({ selectedClient }),
  setFilters: filters =>
    set(state => ({ filters: { ...state.filters, ...filters } })),
  clearFilters: () => set({ filters: {} }),
}));
