import { type Icon, IconDashboard, IconDatabase, IconPlus } from "@tabler/icons-react"

export interface SidebarItem {
  title: string
  url: string
  icon?: Icon
  active?: boolean
}

export interface SidebarGroup {
  title: string
  items: SidebarItem[]
}

export const sidebarData: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "New Schema",
    url: "/new-schema",
    icon: IconPlus,
  },
  {
    title: "Saved Schemas",
    url: "/schemas",
    icon: IconDatabase,
  }
]