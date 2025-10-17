import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import Dashboard from "@/pages/dashboard";
import Tournaments from "@/pages/tournaments";
import Groups from "@/pages/groups";
import Teams from "@/pages/teams";
import Matches from "@/pages/matches";
import MatchCreate from "@/pages/match-create";
import MatchScore from "@/pages/match-score";
import Standings from "@/pages/standings";
import Stats from "@/pages/stats";
import Venues from "@/pages/venues";
import Rules from "@/pages/rules";
import Visitors from "@/pages/visitors";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/tournaments" component={Tournaments} />
      <Route path="/groups" component={Groups} />
      <Route path="/teams" component={Teams} />
      <Route path="/matches" component={Matches} />
      <Route path="/matches/create" component={MatchCreate} />
      <Route path="/matches/:id/score" component={MatchScore} />
      <Route path="/standings" component={Standings} />
      <Route path="/stats" component={Stats} />
      <Route path="/venues" component={Venues} />
      <Route path="/rules" component={Rules} />
      <Route path="/visitors" component={Visitors} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between px-6 py-4 border-b bg-background">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <ThemeToggle />
                </header>
                <main className="flex-1 overflow-auto p-6">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
