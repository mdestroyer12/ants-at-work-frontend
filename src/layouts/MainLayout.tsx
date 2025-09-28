import AppSidebar from "@components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@components/shadcn-ui/Sidebar";
import { Outlet } from "react-router";
import { getCookie } from "@/lib/utils";

export default function MainLayout() {
  const defaultOpen = getCookie("sidebar_state") === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <main>
          <SidebarTrigger />
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
