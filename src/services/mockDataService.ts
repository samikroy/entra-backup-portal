
// This is a mock service that provides fake data for development purposes
// In a real application, this would be replaced with actual API calls

// Mock tenant data
interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'pending' | 'inactive';
  lastBackupTime: Date;
  objectCount: {
    users: number;
    groups: number;
    applications: number;
    servicePrincipals: number;
    policies: number;
  };
}

// Mock backup data
interface BackupHistory {
  id: string;
  tenantId: string;
  timestamp: Date;
  objectsCount: number;
  status: 'completed' | 'failed' | 'in-progress';
  duration: number; // in seconds
}

// Mock metrics data
interface MetricsData {
  totalTenants: number;
  totalBackups: number;
  objectsProtected: number;
  successRate: number;
}

// Dashboard metrics
interface DashboardMetrics {
  backupCount: number;
  tenantsBackedUp: number;
  objectsBackedUp: number;
  lastBackupTime: Date;
  backupStatus: 'success' | 'warning' | 'error' | 'pending';
}

// Restore point data
interface RestorePoint {
  id: string;
  tenantId: string;
  timestamp: Date;
  status: 'completed' | 'failed' | 'in-progress';
  objectsCaptured: {
    users: number;
    groups: number;
    applications: number;
    policies?: number;
    roles: number;
  }
}

// Backup configuration
interface BackupConfig {
  tenantId: string;
  frequency: 'daily' | 'weekly' | 'custom';
  timeOfDay: string;
  retentionDays: number;
  objectTypes: {
    users: boolean;
    groups: boolean;
    applications: boolean;
    policies: boolean;
    roles: boolean;
  };
  notifyOnFailure: boolean;
  notifyOnSuccess: boolean;
  notificationEmail: string;
}

// Mock tenants
const tenants: Tenant[] = [
  {
    id: '1',
    name: 'Samik',
    domain: 'mctsamiktrng01.onmicrosoft.com',
    status: 'active',
    lastBackupTime: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    objectCount: {
      users: 1250,
      groups: 320,
      applications: 48,
      servicePrincipals: 72,
      policies: 35
    }
  },
  // {
  //   id: '2',
  //   name: 'Fabrikam Inc',
  //   domain: 'fabrikam.onmicrosoft.com',
  //   status: 'active',
  //   lastBackupTime: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
  //   objectCount: {
  //     users: 750,
  //     groups: 180,
  //     applications: 32,
  //     servicePrincipals: 45,
  //     policies: 28
  //   }
  // },
  // {
  //   id: '3',
  //   name: 'Northwind Traders',
  //   domain: 'northwind.onmicrosoft.com',
  //   status: 'pending',
  //   lastBackupTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  //   objectCount: {
  //     users: 425,
  //     groups: 95,
  //     applications: 18,
  //     servicePrincipals: 22,
  //     policies: 15
  //   }
  // },
  // {
  //   id: '4',
  //   name: 'Adventure Works',
  //   domain: 'adventure-works.onmicrosoft.com',
  //   status: 'inactive',
  //   lastBackupTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
  //   objectCount: {
  //     users: 850,
  //     groups: 210,
  //     applications: 36,
  //     servicePrincipals: 54,
  //     policies: 29
  //   }
  // }
];

// Mock backup history
const backupHistory: BackupHistory[] = [
  {
    id: '101',
    tenantId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    objectsCount: 1725,
    status: 'completed',
    duration: 187
  },
  {
    id: '102',
    tenantId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 27), // 27 hours ago
    objectsCount: 1720,
    status: 'completed',
    duration: 195
  },
  {
    id: '103',
    tenantId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 51), // 51 hours ago
    objectsCount: 1718,
    status: 'completed',
    duration: 182
  },
  {
    id: '201',
    tenantId: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    objectsCount: 1035,
    status: 'completed',
    duration: 145
  },
  {
    id: '202',
    tenantId: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 36 hours ago
    objectsCount: 1032,
    status: 'completed',
    duration: 142
  },
  {
    id: '301',
    tenantId: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    objectsCount: 575,
    status: 'failed',
    duration: 87
  },
  {
    id: '401',
    tenantId: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    objectsCount: 1179,
    status: 'completed',
    duration: 156
  }
];

// Mock restore points
const restorePoints: RestorePoint[] = [
  {
    id: '1001',
    tenantId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    status: 'completed',
    objectsCaptured: {
      users: 23,
      groups: 2,
      applications: 27,
      roles: 7
    }
  },
  // {
  //   id: '1002',
  //   tenantId: '1',
  //   timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  //   status: 'completed',
  //   objectsCaptured: {
  //     users: 1248,
  //     groups: 318,
  //     applications: 48,
  //     policies: 35,
  //     roles: 15
  //   }
  // },
  // {
  //   id: '1003',
  //   tenantId: '1',
  //   timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  //   status: 'completed',
  //   objectsCaptured: {
  //     users: 1240,
  //     groups: 315,
  //     applications: 47,
  //     policies: 35,
  //     roles: 15
  //   }
  // },
  // {
  //   id: '2001',
  //   tenantId: '2',
  //   timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
  //   status: 'completed',
  //   objectsCaptured: {
  //     users: 750,
  //     groups: 180,
  //     applications: 32,
  //     policies: 28,
  //     roles: 12
  //   }
  // }
];

// Default backup config
const backupConfigs: Record<string, BackupConfig> = {
  '1': {
    tenantId: '1',
    frequency: 'daily',
    timeOfDay: '02:00',
    retentionDays: 30,
    objectTypes: {
      users: true,
      groups: true,
      applications: true,
      policies: true,
      roles: true,
    },
    notifyOnFailure: true,
    notifyOnSuccess: false,
    notificationEmail: 'admin@contoso.com'
  },
  '2': {
    tenantId: '2',
    frequency: 'weekly',
    timeOfDay: '03:00',
    retentionDays: 60,
    objectTypes: {
      users: true,
      groups: true,
      applications: true,
      policies: false,
      roles: true,
    },
    notifyOnFailure: true,
    notifyOnSuccess: true,
    notificationEmail: 'it@fabrikam.com'
  }
};

// Mock metrics data
const metrics: MetricsData = {
  totalTenants: tenants.length,
  totalBackups: backupHistory.length,
  objectsProtected: tenants.reduce((sum, tenant) => {
    return sum + Object.values(tenant.objectCount).reduce((a, b) => a + b, 0);
  }, 0),
  successRate: (backupHistory.filter(b => b.status === 'completed').length / backupHistory.length) * 100
};

// Utility functions to get the mock data
export const getTenants = () => tenants;
export const getBackupHistory = () => backupHistory;
export const getMetrics = () => metrics;

// Added functions for the dashboard, restore, and backups
export const getDashboardMetrics = (): DashboardMetrics => {
  const totalBackups = backupHistory.length;
  const activeTenantsCount = tenants.filter(t => t.status === 'active').length;
  const totalObjects = tenants.reduce((sum, tenant) => {
    return sum + Object.values(tenant.objectCount).reduce((a, b) => a + b, 0);
  }, 0);
  const latestBackup = [...backupHistory].sort((a, b) =>
    b.timestamp.getTime() - a.timestamp.getTime()
  )[0];

  return {
    backupCount: totalBackups,
    tenantsBackedUp: activeTenantsCount,
    objectsBackedUp: totalObjects,
    lastBackupTime: latestBackup?.timestamp || new Date(),
    backupStatus: latestBackup?.status === 'completed' ? 'success' : 'warning'
  };
};

export const getRestorePoints = (tenantId: string): RestorePoint[] => {
  return restorePoints.filter(point => point.tenantId === tenantId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const getBackupConfig = (tenantId: string): BackupConfig => {
  return backupConfigs[tenantId] || {
    tenantId: tenantId,
    frequency: 'daily',
    timeOfDay: '01:00',
    retentionDays: 30,
    objectTypes: {
      users: true,
      groups: true,
      applications: true,
      policies: true,
      roles: true,
    },
    notifyOnFailure: true,
    notifyOnSuccess: false,
    notificationEmail: 'admin@example.com'
  };
};

// Extended object data for detailed views
interface ObjectDetail {
  id: string;
  name: string;
  displayName?: string;
  email?: string;
  objectType: string;
  isActive: boolean;
  department?: string;
  createdDate: Date;
  lastModified: Date;
  roles?: string[];
  groups?: string[];
}

// Mock object lists by type
const mockObjects = {
  users: [
    {
      id: 'user_1',
      name: 'John Doe',
      email: 'john.doe@contoso.com',
      objectType: 'User',
      isActive: true,
      department: 'Engineering',
      createdDate: new Date('2023-01-15'),
      lastModified: new Date('2024-01-10'),
      roles: ['Global Administrator', 'User Administrator'],
      groups: ['IT Admins', 'Engineering Team']
    },
    {
      id: 'user_2',
      name: 'Jane Smith',
      email: 'jane.smith@contoso.com',
      objectType: 'User',
      isActive: true,
      department: 'Marketing',
      createdDate: new Date('2023-02-20'),
      lastModified: new Date('2024-01-08'),
      roles: ['User'],
      groups: ['Marketing Team', 'Content Creators']
    },
    {
      id: 'user_3',
      name: 'Bob Johnson',
      email: 'bob.johnson@contoso.com',
      objectType: 'User',
      isActive: false,
      department: 'Sales',
      createdDate: new Date('2023-03-10'),
      lastModified: new Date('2023-12-15'),
      roles: ['Sales Manager'],
      groups: ['Sales Team']
    }
  ],
  groups: [
    {
      id: 'group_1',
      name: 'IT Admins',
      displayName: 'IT Administrators',
      objectType: 'Security Group',
      isActive: true,
      createdDate: new Date('2023-01-01'),
      lastModified: new Date('2024-01-05'),
      roles: ['Group Admin'],
      groups: []
    },
    {
      id: 'group_2',
      name: 'Engineering Team',
      displayName: 'Engineering Team',
      objectType: 'Office 365 Group',
      isActive: true,
      createdDate: new Date('2023-01-10'),
      lastModified: new Date('2024-01-07'),
      roles: [],
      groups: []
    }
  ],
  applications: [
    {
      id: 'app_1',
      name: 'Contoso CRM',
      displayName: 'Contoso Customer Relationship Management',
      objectType: 'Application',
      isActive: true,
      createdDate: new Date('2023-02-01'),
      lastModified: new Date('2024-01-12'),
      roles: ['Application Developer'],
      groups: []
    },
    {
      id: 'app_2',
      name: 'HR Portal',
      displayName: 'Human Resources Portal',
      objectType: 'Application',
      isActive: true,
      createdDate: new Date('2023-03-15'),
      lastModified: new Date('2024-01-09'),
      roles: [],
      groups: []
    }
  ],
  policies: [
    {
      id: 'policy_1',
      name: 'MFA Policy',
      displayName: 'Multi-Factor Authentication Policy',
      objectType: 'Conditional Access Policy',
      isActive: true,
      createdDate: new Date('2023-01-05'),
      lastModified: new Date('2024-01-11'),
      roles: [],
      groups: []
    }
  ],
  servicePrincipals: [
    {
      id: 'sp_1',
      name: 'Azure AD Connect',
      displayName: 'Azure AD Connect Service Principal',
      objectType: 'Service Principal',
      isActive: true,
      createdDate: new Date('2023-01-01'),
      lastModified: new Date('2024-01-06'),
      roles: ['Directory Synchronization Accounts'],
      groups: []
    }
  ]
};

// Backup differences data
interface BackupDifference {
  summary: {
    added: number;
    modified: number;
    removed: number;
  };
  changes: Array<{
    field: string;
    type: 'added' | 'modified' | 'removed';
    oldValue?: string;
    newValue?: string;
    timestamp: string;
  }>;
}

// Graph data for visualization
interface GraphNode {
  id: string;
  position: { x: number; y: number };
  data: {
    label: string;
    type: string;
    isActive: boolean;
  };
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
}

export const getObjectsList = (tenantId: string) => {
  return mockObjects;
};

export const getObjectDetails = (objectId: string, objectType: string): ObjectDetail | null => {
  const objects = mockObjects[objectType as keyof typeof mockObjects] || [];
  return objects.find((obj: any) => obj.id === objectId) || null;
};

export const getBackupDifferences = (objectId: string, fromBackup: string, toBackup: string): BackupDifference | null => {
  if (!fromBackup || !toBackup) return null;
  
  return {
    summary: {
      added: 2,
      modified: 3,
      removed: 1
    },
    changes: [
      {
        field: 'email',
        type: 'modified',
        oldValue: 'old.email@contoso.com',
        newValue: 'new.email@contoso.com',
        timestamp: '2024-01-15T14:30:00Z'
      },
      {
        field: 'department',
        type: 'modified',
        oldValue: 'Engineering',
        newValue: 'DevOps',
        timestamp: '2024-01-15T14:30:00Z'
      },
      {
        field: 'phoneNumber',
        type: 'added',
        newValue: '+1-555-0123',
        timestamp: '2024-01-15T14:30:00Z'
      },
      {
        field: 'jobTitle',
        type: 'added',
        newValue: 'Senior Developer',
        timestamp: '2024-01-15T14:30:00Z'
      },
      {
        field: 'manager',
        type: 'removed',
        oldValue: 'john.manager@contoso.com',
        timestamp: '2024-01-15T14:30:00Z'
      },
      {
        field: 'lastSignIn',
        type: 'modified',
        oldValue: '2024-01-14T10:30:00Z',
        newValue: '2024-01-15T09:15:00Z',
        timestamp: '2024-01-15T14:30:00Z'
      }
    ]
  };
};

export const getGraphData = (tenantId: string) => {
  const nodes: GraphNode[] = [
    {
      id: 'user_1',
      position: { x: 100, y: 100 },
      data: { label: 'John Doe', type: 'user', isActive: true }
    },
    {
      id: 'user_2',
      position: { x: 300, y: 100 },
      data: { label: 'Jane Smith', type: 'user', isActive: true }
    },
    {
      id: 'group_1',
      position: { x: 200, y: 200 },
      data: { label: 'IT Admins', type: 'group', isActive: true }
    },
    {
      id: 'group_2',
      position: { x: 400, y: 200 },
      data: { label: 'Engineering', type: 'group', isActive: true }
    },
    {
      id: 'app_1',
      position: { x: 100, y: 300 },
      data: { label: 'Contoso CRM', type: 'application', isActive: true }
    },
    {
      id: 'app_2',
      position: { x: 300, y: 300 },
      data: { label: 'HR Portal', type: 'application', isActive: true }
    },
    {
      id: 'policy_1',
      position: { x: 500, y: 100 },
      data: { label: 'MFA Policy', type: 'policy', isActive: true }
    },
    {
      id: 'sp_1',
      position: { x: 200, y: 400 },
      data: { label: 'Azure AD Connect', type: 'servicePrincipal', isActive: true }
    }
  ];

  const edges: GraphEdge[] = [
    { id: 'e1', source: 'user_1', target: 'group_1' },
    { id: 'e2', source: 'user_2', target: 'group_2' },
    { id: 'e3', source: 'user_1', target: 'group_2' },
    { id: 'e4', source: 'group_1', target: 'app_1' },
    { id: 'e5', source: 'group_2', target: 'app_2' },
    { id: 'e6', source: 'policy_1', target: 'user_1', animated: true },
    { id: 'e7', source: 'policy_1', target: 'user_2', animated: true },
    { id: 'e8', source: 'sp_1', target: 'app_1' },
    { id: 'e9', source: 'sp_1', target: 'app_2' },
  ];

  return { nodes, edges };
};

export const formatDate = (date: Date) => {
  return new Date(date).toLocaleString("en-US", {
    timeZone: "UTC",
    month: "long",      // May
    day: "2-digit",     // 15
    year: "numeric",    // 2025
    hour: "2-digit",    // 07
    minute: "2-digit",  // 46
    hour12: true        // PM
  });
};
