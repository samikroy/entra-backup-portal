
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

// Mock tenants
const tenants: Tenant[] = [
  {
    id: '1',
    name: 'Contoso Ltd',
    domain: 'contoso.onmicrosoft.com',
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
  {
    id: '2',
    name: 'Fabrikam Inc',
    domain: 'fabrikam.onmicrosoft.com',
    status: 'active',
    lastBackupTime: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    objectCount: {
      users: 750,
      groups: 180,
      applications: 32,
      servicePrincipals: 45,
      policies: 28
    }
  },
  {
    id: '3',
    name: 'Northwind Traders',
    domain: 'northwind.onmicrosoft.com',
    status: 'pending',
    lastBackupTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    objectCount: {
      users: 425,
      groups: 95,
      applications: 18,
      servicePrincipals: 22,
      policies: 15
    }
  },
  {
    id: '4',
    name: 'Adventure Works',
    domain: 'adventure-works.onmicrosoft.com',
    status: 'inactive',
    lastBackupTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    objectCount: {
      users: 850,
      groups: 210,
      applications: 36,
      servicePrincipals: 54,
      policies: 29
    }
  }
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
export const formatDate = (date: Date) => {
  return date.toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};
