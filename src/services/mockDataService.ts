
// Types for our data models
export interface BackupMetrics {
  lastBackupTime: string;
  backupCount: number;
  objectsBackedUp: number;
  tenantsBackedUp: number;
  backupStatus: 'success' | 'warning' | 'error';
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  lastBackupTime: string;
  status: 'active' | 'pending' | 'error';
  objectCount: {
    users: number;
    groups: number;
    applications: number;
    policies: number;
    roles: number;
  };
}

export interface BackupConfig {
  id: string;
  tenantId: string;
  frequency: 'daily' | 'weekly' | 'custom';
  timeOfDay: string;
  daysOfWeek: string[];
  retentionDays: number;
  objectTypes: {
    users: boolean;
    groups: boolean;
    applications: boolean;
    policies: boolean;
    roles: boolean;
  };
  notifyOnSuccess: boolean;
  notifyOnFailure: boolean;
  notificationEmail: string;
}

export interface RestorePoint {
  id: string;
  tenantId: string;
  timestamp: string;
  status: 'completed' | 'incomplete';
  objectsCaptured: {
    users: number;
    groups: number;
    applications: number;
    policies: number;
    roles: number;
  };
}

// Mock data for dashboard
export const getDashboardMetrics = (): BackupMetrics => {
  return {
    lastBackupTime: new Date(Date.now() - 3600000).toISOString(),
    backupCount: 342,
    objectsBackedUp: 15728,
    tenantsBackedUp: 8,
    backupStatus: 'success',
  };
};

// Mock tenants data
export const getTenants = (): Tenant[] => {
  return [
    {
      id: '1a2b3c',
      name: 'Contoso Corporation',
      domain: 'contoso.onmicrosoft.com',
      lastBackupTime: new Date(Date.now() - 3600000).toISOString(),
      status: 'active',
      objectCount: {
        users: 2450,
        groups: 187,
        applications: 43,
        policies: 12,
        roles: 8
      }
    },
    {
      id: '4d5e6f',
      name: 'Fabrikam Inc',
      domain: 'fabrikam.onmicrosoft.com',
      lastBackupTime: new Date(Date.now() - 7200000).toISOString(),
      status: 'active',
      objectCount: {
        users: 1850,
        groups: 120,
        applications: 32,
        policies: 8,
        roles: 5
      }
    },
    {
      id: '7g8h9i',
      name: 'Northwind Traders',
      domain: 'northwind.onmicrosoft.com',
      lastBackupTime: new Date(Date.now() - 86400000).toISOString(),
      status: 'warning',
      objectCount: {
        users: 950,
        groups: 45,
        applications: 18,
        policies: 5,
        roles: 3
      }
    },
    {
      id: '0j1k2l',
      name: 'Adventure Works',
      domain: 'adventure-works.onmicrosoft.com',
      lastBackupTime: new Date(Date.now() - 43200000).toISOString(),
      status: 'active',
      objectCount: {
        users: 3200,
        groups: 210,
        applications: 67,
        policies: 15,
        roles: 9
      }
    },
  ];
};

// Mock backup config data
export const getBackupConfig = (tenantId: string): BackupConfig => {
  return {
    id: `config-${tenantId}`,
    tenantId,
    frequency: 'daily',
    timeOfDay: '02:00',
    daysOfWeek: ['Monday', 'Wednesday', 'Friday'],
    retentionDays: 30,
    objectTypes: {
      users: true,
      groups: true,
      applications: true,
      policies: true,
      roles: true
    },
    notifyOnSuccess: false,
    notifyOnFailure: true,
    notificationEmail: 'admin@example.com'
  };
};

// Mock restore points data
export const getRestorePoints = (tenantId: string): RestorePoint[] => {
  const now = Date.now();
  return [
    {
      id: `rp-${tenantId}-1`,
      tenantId,
      timestamp: new Date(now - 3600000).toISOString(),
      status: 'completed',
      objectsCaptured: {
        users: 2450,
        groups: 187,
        applications: 43,
        policies: 12,
        roles: 8
      }
    },
    {
      id: `rp-${tenantId}-2`,
      tenantId,
      timestamp: new Date(now - 86400000).toISOString(),
      status: 'completed',
      objectsCaptured: {
        users: 2448,
        groups: 187,
        applications: 43,
        policies: 12,
        roles: 8
      }
    },
    {
      id: `rp-${tenantId}-3`,
      tenantId,
      timestamp: new Date(now - 172800000).toISOString(),
      status: 'completed',
      objectsCaptured: {
        users: 2445,
        groups: 185,
        applications: 42,
        policies: 12,
        roles: 8
      }
    },
    {
      id: `rp-${tenantId}-4`,
      tenantId,
      timestamp: new Date(now - 259200000).toISOString(),
      status: 'completed',
      objectsCaptured: {
        users: 2442,
        groups: 183,
        applications: 42,
        policies: 11,
        roles: 8
      }
    },
    {
      id: `rp-${tenantId}-5`,
      tenantId,
      timestamp: new Date(now - 345600000).toISOString(),
      status: 'incomplete',
      objectsCaptured: {
        users: 2440,
        groups: 183,
        applications: 0,
        policies: 0,
        roles: 0
      }
    }
  ];
};

// Date formatting helper
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString();
};
