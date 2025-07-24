
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface MainNavProps {
  className?: string;
}

const MainNav: React.FC<MainNavProps> = ({ className }) => {
  const { user, isDevelopmentMode } = useAuth();

  // Check if user is admin (for demo purposes)
  const isAdmin = user?.name?.toLowerCase().includes('admin') || isDevelopmentMode;

  const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "Tenants", href: "/tenants" },
    { name: "Objects", href: "/objects?tenant=1&type=users" },
    { name: "Graph", href: "/graph" },
    { name: "Settings", href: "/settings" },
    { name: "Restore", href: "/restore" },
  ];

  // Add admin link for admins only
  if (isAdmin) {
    navItems.push({ name: "Admin", href: "/admin" });
  }

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive
                ? "text-primary"
                : "text-muted-foreground"
            )
          }
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
};

export default MainNav;
