import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, Inbox } from "lucide-react";

export function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bg-gradient-to-r from-primary to-accent border-b shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-primary-foreground">
              AudienceQuery – AI Inbox
            </h1>
            <div className="flex gap-2">
              <Button
                variant={location.pathname === "/" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => navigate("/")}
                className={location.pathname === "/" ? "" : "text-primary-foreground hover:text-primary-foreground hover:bg-white/10"}
              >
                <Inbox className="h-4 w-4 mr-2" />
                Inbox
              </Button>
              <Button
                variant={location.pathname === "/analytics" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => navigate("/analytics")}
                className={location.pathname === "/analytics" ? "" : "text-primary-foreground hover:text-primary-foreground hover:bg-white/10"}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-primary-foreground">
              Hrushikesh
            </span>
            <Avatar className="h-9 w-9 ring-2 ring-white/20">
              <AvatarFallback className="bg-white/90 text-primary font-semibold">
                H
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
}
