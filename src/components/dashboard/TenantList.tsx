
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTenants, formatDate } from "@/services/mockDataService";
import BackupStatusBadge from "./BackupStatusBadge";
import { useMetrics } from "@/contexts/MetricsContext";
import { Building, Globe, Clock, Database } from "lucide-react";

const TenantList = () => {
  const tenants = getTenants();
  const { lastBackupTime, objectsBackedUp, backupStatus } = useMetrics();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
          <Building className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold">Active Tenants</h3>
      </div>
      
      <div className="grid gap-4">
        {tenants.map((tenant, index) => {
          const totalObjects = Object.values(tenant.objectCount).reduce((acc, curr) => acc + curr, 0);
          
          return (
            <div 
              key={tenant.id}
              className="glassmorphism p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-all duration-500 hover:scale-[1.02] group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:scale-110 transition-transform duration-300">
                    <Building className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">{tenant.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="w-4 h-4" />
                      <span>{tenant.domain}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <Clock className="w-4 h-4" />
                      <span>Last Backup</span>
                    </div>
                    <div className="text-lg font-semibold">{lastBackupTime}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <Database className="w-4 h-4" />
                      <span>Objects</span>
                    </div>
                    <div className="text-lg font-semibold">{objectsBackedUp.toLocaleString()}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Status</div>
                    <BackupStatusBadge status={backupStatus} />
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-2">
                  {Object.entries(tenant.objectCount).map(([type, count]) => (
                    <div key={type} className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium">
                      {type}: {count}
                    </div>
                  ))}
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TenantList;
