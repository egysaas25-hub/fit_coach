// lib/mappers/team.mapper.ts
import { TeamMember, Role, Permission, Team, TeamStats } from '@/types/domain/team';

interface RawTeamMember {
  member_id: string;
  name: string;
  role_id: string;
  email: string;
  status: string;
  avatar?: string;
  created_at: string;
}

interface RawRole {
  role_id: string;
  name: string;
  description: string;
  permissions: string[];
  user_count: number;
}

interface RawPermission {
  permission_id: string;
  name: string;
  category: string;
  roles: string[];
}

interface RawTeam {
  team_id: string;
  name: string;
  member_count: number;
  revenue: number;
  growth: string;
  status: string;
}

interface RawTeamStats {
  team_id: string;
  total_revenue: number;
  member_count: number;
  growth_rate: string;
}

export class TeamMapper {
  static toDomainTeamMember(raw: RawTeamMember): TeamMember {
    return {
      id: raw.member_id,
      name: raw.name,
      roleId: raw.role_id,
      email: raw.email,
      status: raw.status as TeamMember['status'],
      avatar: raw.avatar,
      createdAt: raw.created_at,
    };
  }

  static toDomainTeamMembers(rawMembers: RawTeamMember[]): TeamMember[] {
    return rawMembers.map(this.toDomainTeamMember);
  }

  static toDomainRole(raw: RawRole): Role {
    return {
      id: raw.role_id,
      name: raw.name,
      description: raw.description,
      permissions: raw.permissions,
      userCount: raw.user_count,
    };
  }

  static toDomainRoles(rawRoles: RawRole[]): Role[] {
    return rawRoles.map(this.toDomainRole);
  }

  static toDomainPermission(raw: RawPermission): Permission {
    return {
      id: raw.permission_id,
      name: raw.name,
      category: raw.category,
      roles: raw.roles,
    };
  }

  static toDomainPermissions(rawPermissions: RawPermission[]): Permission[] {
    return rawPermissions.map(this.toDomainPermission);
  }

  static toDomainTeam(raw: RawTeam): Team {
    return {
      id: raw.team_id,
      name: raw.name,
      memberCount: raw.member_count,
      revenue: raw.revenue,
      growth: raw.growth,
      status: raw.status as Team['status'],
    };
  }

  static toDomainTeams(rawTeams: RawTeam[]): Team[] {
    return rawTeams.map(this.toDomainTeam);
  }

  static toDomainTeamStats(raw: RawTeamStats): TeamStats {
    return {
      teamId: raw.team_id,
      totalRevenue: raw.total_revenue,
      memberCount: raw.member_count,
      growthRate: raw.growth_rate,
    };
  }
}