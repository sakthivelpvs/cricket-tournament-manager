import {
  LayoutDashboard,
  Trophy,
  Users,
  Target,
  BarChart3,
  MapPin,
  FileText,
  Eye,
  Layers,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    testId: "link-dashboard",
  },
  {
    title: "Tournaments",
    url: "/tournaments",
    icon: Trophy,
    testId: "link-tournaments",
  },
  {
    title: "Groups",
    url: "/groups",
    icon: Layers,
    testId: "link-groups",
  },
  {
    title: "Teams",
    url: "/teams",
    icon: Users,
    testId: "link-teams",
  },
  {
    title: "Matches",
    url: "/matches",
    icon: Target,
    testId: "link-matches",
  },
  {
    title: "Standings",
    url: "/standings",
    icon: BarChart3,
    testId: "link-standings",
  },
  {
    title: "Venues",
    url: "/venues",
    icon: MapPin,
    testId: "link-venues",
  },
  {
    title: "Stats",
    url: "/stats",
    icon: BarChart3,
    testId: "link-stats",
  },
  {
    title: "Rules",
    url: "/rules",
    icon: FileText,
    testId: "link-rules",
  },
  {
    title: "Visitors",
    url: "/visitors",
    icon: Eye,
    testId: "link-visitors",
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Cricket Manager</h1>
            <p className="text-xs text-muted-foreground">Tournament Admin</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={item.testId}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
