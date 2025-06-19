
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
