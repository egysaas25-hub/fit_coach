// lib/hooks/api/useTeam.ts
import { useState, useEffect, useCallback } from 'react';
import { TeamService } from '@/lib/api/services/team.service';
import { TeamMember, Role, Permission } from '@/types/domain/team';

const teamService = new TeamService();

export function useTeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await teamService.getTeamMembers();
      setMembers(data);
    } catch (err) {
      setError('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, loading, error, refetch: fetchMembers };
}

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await teamService.getRoles();
      setRoles(data);
    } catch (err) {
      setError('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return { roles, loading, error, refetch: fetchRoles };
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await teamService.getPermissions();
      setPermissions(data);
    } catch (err) {
      setError('Failed to fetch permissions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return { permissions, loading, error, refetch: fetchPermissions };
}

export function useCreateRole() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRole = useCallback(async (role: Partial<Role>) => {
    setLoading(true);
    try {
      const newRole = await teamService.createRole(role);
      return newRole;
    } catch (err) {
      setError('Failed to create role');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createRole, loading, error };
}