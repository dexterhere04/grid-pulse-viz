import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, BarChart3, Settings, Home } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-lg">
              <Sun className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">SmartGrid Solar</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" asChild>
              <NavLink to="/" className={({ isActive }) => 
                isActive ? "bg-primary/10 text-primary" : ""
              }>
                <Home className="h-4 w-4 mr-2" />
                Home
              </NavLink>
            </Button>
            
            <Button variant="ghost" size="sm" asChild>
              <NavLink to="/panels" className={({ isActive }) => 
                isActive ? "bg-primary/10 text-primary" : ""
              }>
                <Settings className="h-4 w-4 mr-2" />
                Panel Management
              </NavLink>
            </Button>
            
            <Button variant="ghost" size="sm" asChild>
              <NavLink to="/analytics" className={({ isActive }) => 
                isActive ? "bg-primary/10 text-primary" : ""
              }>
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </NavLink>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;