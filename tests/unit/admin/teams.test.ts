import { TeamService } from '@/lib/api/services/team.service';
import { useTeamMembers, useRoles, usePermissions, useCreateRole } from '@/lib/hooks/api/useTeam';
import { TeamMember, Role, Permission } from '@/types/domain/team';

// Mock fetch globally
global.fetch = jest.fn();

describe('Team Service', () => {
  let teamService: TeamService;
  
  beforeEach(() => {
    teamService = new TeamService();
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('getTeamMembers', () => {
    it('should fetch team members', async () => {
      const mockMembers: TeamMember[] = [
        { 
          id: '1', 
          name: 'John Trainer', 
          roleId: 'trainer', 
          email: 'john@example.com',
          status: 'Active',
          createdAt: '2023-11-01T00:00:00Z'
        },
        { 
          id: '2', 
          name: 'Jane Admin', 
          roleId: 'admin', 
          email: 'jane@example.com',
          status: 'Active',
          createdAt: '2023-11-01T00:00:00Z'
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockMembers),
      });

      const result = await teamService.getTeamMembers();

      expect(global.fetch).toHaveBeenCalledWith('/api/team/members');
      expect(result).toEqual(mockMembers);
    });

    it('should handle fetch errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(teamService.getTeamMembers()).rejects.toThrow('Failed to fetch team members');
    });
  });

  describe('getRoles', () => {
    it('should fetch roles', async () => {
      const mockRoles: Role[] = [
        { 
          id: '1', 
          name: 'Admin', 
          description: 'Administrator',
          permissions: ['1', '2'],
          userCount: 1
        },
        { 
          id: '2', 
          name: 'Trainer', 
          description: 'Fitness Trainer',
          permissions: ['2'],
          userCount: 1
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockRoles),
      });

      const result = await teamService.getRoles();

      expect(global.fetch).toHaveBeenCalledWith('/api/team/roles');
      expect(result).toEqual(mockRoles);
    });
  });

  describe('getPermissions', () => {
    it('should fetch permissions', async () => {
      const mockPermissions: Permission[] = [
        { 
          id: '1', 
          name: 'View Clients', 
          category: 'Clients',
          roles: ['1']
        },
        { 
          id: '2', 
          name: 'Edit Workouts', 
          category: 'Workouts',
          roles: ['1', '2']
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockPermissions),
      });

      const result = await teamService.getPermissions();

      expect(global.fetch).toHaveBeenCalledWith('/api/team/permissions');
      expect(result).toEqual(mockPermissions);
    });
  });

  describe('createRole', () => {
    it('should create a new role', async () => {
      const newRole: Partial<Role> = {
        name: 'New Role',
      };

      const mockCreatedRole: Role = {
        id: '3',
        name: 'New Role',
        description: 'A new role',
        permissions: [],
        userCount: 0
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockCreatedRole),
      });

      const result = await teamService.createRole(newRole);

      expect(global.fetch).toHaveBeenCalledWith('/api/team/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRole),
      });
      expect(result).toEqual(mockCreatedRole);
    });
  });
});

describe('useTeamMembers Hook', () => {
  it('should fetch team members', () => {
    const mockMembers: TeamMember[] = [
      { 
        id: '1', 
        name: 'John Trainer', 
        roleId: 'trainer', 
        email: 'john@example.com',
        status: 'Active',
        createdAt: '2023-11-01T00:00:00Z'
      },
    ];

    const mockUseState = jest.fn()
      .mockReturnValueOnce([mockMembers, jest.fn()]) // members
      .mockReturnValueOnce([false, jest.fn()]) // loading
      .mockReturnValueOnce([null, jest.fn()]); // error

    const mockUseEffect = jest.fn().mockImplementation((fn) => fn());

    jest.mock('react', () => ({
      ...jest.requireActual('react'),
      useState: mockUseState,
      useEffect: mockUseEffect,
      useCallback: (fn: any) => fn,
    }));

    // Re-import after mocking
    const { useTeamMembers } = require('@/lib/hooks/api/useTeam');
    
    const { members, loading, error } = useTeamMembers();
    
    expect(members).toEqual(mockMembers);
    expect(loading).toBe(false);
    expect(error).toBeNull();
  });
});

describe('useRoles Hook', () => {
  it('should fetch roles', () => {
    const mockRoles: Role[] = [
      { 
        id: '1', 
        name: 'Admin', 
        description: 'Administrator',
        permissions: ['1', '2'],
        userCount: 1
      },
    ];

    const mockUseState = jest.fn()
      .mockReturnValueOnce([mockRoles, jest.fn()]) // roles
      .mockReturnValueOnce([false, jest.fn()]) // loading
      .mockReturnValueOnce([null, jest.fn()]); // error

    const mockUseEffect = jest.fn().mockImplementation((fn) => fn());

    jest.mock('react', () => ({
      ...jest.requireActual('react'),
      useState: mockUseState,
      useEffect: mockUseEffect,
      useCallback: (fn: any) => fn,
    }));

    // Re-import after mocking
    const { useRoles } = require('@/lib/hooks/api/useTeam');
    
    const { roles, loading, error } = useRoles();
    
    expect(roles).toEqual(mockRoles);
    expect(loading).toBe(false);
    expect(error).toBeNull();
  });
});

describe('usePermissions Hook', () => {
  it('should fetch permissions', () => {
    const mockPermissions: Permission[] = [
      { 
        id: '1', 
        name: 'View Clients', 
        category: 'Clients',
        roles: ['1']
      },
    ];

    const mockUseState = jest.fn()
      .mockReturnValueOnce([mockPermissions, jest.fn()]) // permissions
      .mockReturnValueOnce([false, jest.fn()]) // loading
      .mockReturnValueOnce([null, jest.fn()]); // error

    const mockUseEffect = jest.fn().mockImplementation((fn) => fn());

    jest.mock('react', () => ({
      ...jest.requireActual('react'),
      useState: mockUseState,
      useEffect: mockUseEffect,
      useCallback: (fn: any) => fn,
    }));

    // Re-import after mocking
    const { usePermissions } = require('@/lib/hooks/api/useTeam');
    
    const { permissions, loading, error } = usePermissions();
    
    expect(permissions).toEqual(mockPermissions);
    expect(loading).toBe(false);
    expect(error).toBeNull();
  });
});

describe('useCreateRole Hook', () => {
  it('should create a role', async () => {
    const mockRole: Role = {
      id: '1',
      name: 'New Role',
      description: 'A new role',
      permissions: [],
      userCount: 0
    };

    const mockUseState = jest.fn()
      .mockReturnValueOnce([false, jest.fn()]) // loading
      .mockReturnValueOnce([null, jest.fn()]); // error

    jest.mock('react', () => ({
      ...jest.requireActual('react'),
      useState: mockUseState,
      useCallback: (fn: any) => fn,
    }));

    // Mock the TeamService
    const mockTeamService = {
      createRole: jest.fn().mockResolvedValue(mockRole),
    };

    jest.mock('@/lib/api/services/team.service', () => {
      return {
        TeamService: jest.fn().mockImplementation(() => mockTeamService),
      };
    });

    // Re-import after mocking
    const { useCreateRole } = require('@/lib/hooks/api/useTeam');
    
    const { createRole } = useCreateRole();
    const result = await createRole({ name: 'New Role', description: 'A new role' });
    
    expect(mockTeamService.createRole).toHaveBeenCalledWith({
      name: 'New Role',
      description: 'A new role',
    });
    expect(result).toEqual(mockRole);
  });
});