// lib/api/services/team.service.ts
import { TeamMember, Role, Permission, Team } from '@/types/domain/team';

export class TeamService {
  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      const response = await fetch('/api/team/members');
      const data = await response.json();
      return data as TeamMember[];
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw new Error('Failed to fetch team members');
    }
  }

  async getRoles(): Promise<Role[]> {
    try {
      const response = await fetch('/api/team/roles');
      const data = await response.json();
      return data as Role[];
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw new Error('Failed to fetch roles');
    }
  }

  async getPermissions(): Promise<Permission[]> {
    try {
      const response = await fetch('/api/team/permissions');
      const data = await response.json();
      return data as Permission[];
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw new Error('Failed to fetch permissions');
    }
  }

  async createRole(role: Partial<Role>): Promise<Role> {
    try {
      const response = await fetch('/api/team/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(role),
      });
      const data = await response.json();
      return data as Role;
    } catch (error) {
      console.error('Error creating role:', error);
      throw new Error('Failed to create role');
    }
  }
}