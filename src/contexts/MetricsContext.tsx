import React, { createContext, useContext, useEffect, useState } from "react";
import type { BackupStatus } from "@/components/dashboard/BackupStatusBadge";
import { formatDate } from "@/services/mockDataService";

const MetricsContext = createContext(null);

export const MetricsProvider = ({ children }) => {
  const [metrics, setMetrics] = useState<{
    lastBackupTime: string;
    objectsBackedUp: number;
    tenantsBackedUp: number;
    totalBackups: number;
    totalUsers: number;
    totalApplications: number;
    totalRoles?: number;
    backupStatus: BackupStatus;
  }>({
    lastBackupTime: "",
    objectsBackedUp: 0,
    tenantsBackedUp: 0,
    totalBackups: 0,
    totalUsers: 0,
    totalApplications: 0,
    totalRoles: 0,
    backupStatus: "success",
  });
  const queries = {
    lastBackupTime: "AzureEntraBackup_CL | summarize LastBackupTime = max(TimeGenerated)",
    tenantsBackedUp: "AzureEntraBackup_CL | where TimeGenerated >ago(30d) | distinct TenantId | count",
    objectsBackedUp: "AzureEntraBackup_CL | distinct securityIdentifier_s | count",
    totalBackups: "AzureEntraBackup_CL | where TimeGenerated >ago(30d) | extend only_date = dayofyear(TimeGenerated) | distinct only_date | count",
    totalUsers: "AzureEntraBackup_CL | where TimeGenerated >ago(30d) | where isnotempty(userPrincipalName_s) | summarize UserCount = dcount(userPrincipalName_s)",
    totalGroups: "AzureEntraBackup_CL | where TimeGenerated >ago(30d) | where isnotempty(groupTypes_s) | summarize GroupCount = dcount(id_g)",
    totalApplications: "AzureEntraBackup_CL | where TimeGenerated >ago(30d) | where isnotempty(appId_g) and isempty(servicePrincipalType_s)| summarize ApplicationCount = dcount(appId_g)",
    totalRoles: "AzureEntraBackup_CL | where isnotempty(roleTemplateId_g) | summarize UniqueRoleCount = dcount(roleTemplateId_g)"
  }

  // write a fetch request with body should send data in json format
  useEffect(() => {
    console.log("Fetching metrics...");
    setMetrics((prev) => ({
      ...prev,
      backupStatus: "pending",
    }));
    const fetchMetrics = async (query) => {
      try {
        const response = await fetch('https://fn-entra-backup-srever-dev.azurewebsites.net/api/GetUserLogs?', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "workspaceId": "ad0ea146-ac18-46ac-bf5b-fd406e63e548",
            "query": query
          }),
        });
        if (!response.ok) {
          setMetrics((prev) => ({
            ...prev,
            backupStatus: "error",
          }));
          throw new Error('Network response was not ok');
        }
        const text = await response.text();
        if (!text) {
          return null;
        }
        const data = JSON.parse(text);
        return data;
      } catch (error) {
        setMetrics((prev) => ({
          ...prev,
          backupStatus: "error",
        }));
        console.error('Error fetching metrics:', error);
        return null;
      }
    };

    const fetchAllMetrics = async () => {
      const [
        lastBackUpDateData,
        tenantsBackedUpData,
        objectsBackedUpData,
        totalBackupsData,
        totalUsers,
        totalGroups,
        totalApplications,
        totalRoles
      ] = await Promise.all([
        fetchMetrics(queries.lastBackupTime),
        fetchMetrics(queries.tenantsBackedUp),
        fetchMetrics(queries.objectsBackedUp),
        fetchMetrics(queries.totalBackups),
        fetchMetrics(queries.totalUsers),
        fetchMetrics(queries.totalGroups),
        fetchMetrics(queries.totalApplications),
        fetchMetrics(queries.totalRoles)
      ]);

      setMetrics((prev) => ({
        ...prev,
        lastBackupTime: lastBackUpDateData ? formatDate(lastBackUpDateData.tables[0].rows[0][0]) : "",
        tenantsBackedUp: tenantsBackedUpData ? tenantsBackedUpData.tables[0].rows[0][0] : 0,
        objectsBackedUp: objectsBackedUpData ? objectsBackedUpData.tables[0].rows[0][0] : 0,
        totalBackups: totalBackupsData ? totalBackupsData.tables[0].rows[0][0] : 0,
        totalUsers: totalUsers ? totalUsers.tables[0].rows[0][0] : 0,
        totalGroups: totalGroups ? totalGroups.tables[0].rows[0][0] : 0,
        totalApplications: totalApplications ? totalApplications.tables[0].rows[0][0] : 0,
        totalRoles: totalRoles ? totalRoles.tables[0].rows[0][0] : 0,
        backupStatus: "success"
      }));
      console.log("Metrics fetched successfully");
    };

    fetchAllMetrics();
  }, []);

  return (
    <MetricsContext.Provider value={metrics}>
      {children}
    </MetricsContext.Provider>
  );
};

export const useMetrics = () => useContext(MetricsContext);