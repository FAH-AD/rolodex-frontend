import { TablerIcon } from "@tabler/icons";
import { UserRole } from "./auth";

export interface NavLink {
  label: string;
  icon: TablerIcon;
  match: RegExp;
  link: string;
  roles: UserRole[];
}
