import { useMemo } from "react";

// Hooks
import { useVerifyRole } from "@hooks/auth/useVerifyRole";

// Icons
import {
  IconLayoutGrid,
  IconListDetails,
  IconListCheck,
  IconUsers,
  IconUser,
  IconFolders,
  IconChecklist,
  IconCirclePlus,
  IconMessages,
} from "@tabler/icons";

// Interfaces
import { NavLink } from "@interfaces/layout";

const defaultNavLinks: NavLink[] = [
  {
    label: "Chat",
    icon: IconMessages,
    match: /\/message-center/,
    link: "/dashboard/message-center",
    roles: ["admin", "manager", "sales", "developer", "client"],
  },
  {
    label: "Create a Request",
    icon: IconCirclePlus,
    match: /\/projects\/request/,
    link: "/dashboard/projects/request",
    roles: ["client"],
  },
  {
    label: "Clients",
    icon: IconUser,
    match: /\/users\/clients/,
    link: "/dashboard/users/clients",
    roles: ["admin"],
  },
  {
    label: "Team",
    icon: IconUsers,
    match: /\/users\/team/,
    link: "/dashboard/users/team",
    roles: ["admin"],
  },
  {
    label: "Daily Tasks",
    icon: IconListCheck,
    match: /\/daily-tasks/,
    link: "/dashboard/daily-tasks",
    roles: ["admin", "manager", "sales", "developer"],
  },
  {
    label: "Services",
    icon: IconLayoutGrid,
    match: /\/services/,
    link: "/dashboard/services",
    roles: ["admin", "manager", "sales", "developer", "client"],
  },
  {
    label: "My Projects",
    icon: IconListDetails,
    link: "/dashboard/projects",
    match: /\/projects$|\/projects\/[0-9]+|\/projects\/create/,
    roles: ["admin", "manager", "sales", "developer", "client"],
  },
  {
    label: "Resources",
    icon: IconFolders,
    match: /\/resources/,
    link: "/dashboard/resources",
    roles: ["admin", "manager", "sales", "developer", "client"],
  },
  {
    label: "Ecommerce Checklist",
    icon: IconChecklist,
    match: /\/ecommerce-checklists/,
    link: "/dashboard/ecommerce-checklists",
    roles: ["admin", "manager", "sales", "developer", "client"],
  },
];

export const useNavLinks = () => {
  const { verifyRole } = useVerifyRole();

  const navLinks = useMemo(() => {
    return defaultNavLinks.filter((link) => verifyRole(...link.roles));
  }, []);

  return { navLinks };
};
