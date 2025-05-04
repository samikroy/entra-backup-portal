
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BackupStatus = 'success' | 'warning' | 'error' | 'pending';

interface BackupStatusBadgeProps {
  status: BackupStatus;
}

const BackupStatusBadge: React.FC<BackupStatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    success: {
      label: 'Success',
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    },
    warning: {
      label: 'Warning',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    },
    error: {
      label: 'Error',
      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    },
    pending: {
      label: 'Pending',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    }
  };

  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn('font-medium', config.className)}>
      {config.label}
    </Badge>
  );
};

export default BackupStatusBadge;
