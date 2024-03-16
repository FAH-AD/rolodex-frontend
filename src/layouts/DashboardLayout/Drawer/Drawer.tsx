// Redux
import { useReduxDispatch, useReduxSelector } from "@app/hook";
import { toggleDrawer, selectIsDrawerOpen } from "@slices/layoutSlice";

// Mantine
import { Drawer as MantineDrawer, Stack } from "@mantine/core";

// Icons
import { IconCoin, IconSettings } from "@tabler/icons";

// Components
import { LinksGroup } from "../ExpandedNavbar/LinksGroup";

// Hooks
import { useNavLinks } from "@hooks/layout/useNavLinks";

const footerLinks = [
  {
    label: "Refer & Earn",
    icon: IconCoin,
    match: /\/affiliate-program/,
    link: "/dashboard/affiliate-program",
    roles: ["admin", "manager", "sales", "developer", "client"],
  },
  {
    label: "Settings",
    icon: IconSettings,
    match: /\/dashboard\/settings/,
    link: "/dashboard/settings",
  },
];

export const Drawer = () => {
  const dispatch = useReduxDispatch();
  const isDrawerOpen = useReduxSelector(selectIsDrawerOpen);
  const { navLinks } = useNavLinks();

  const handleDrawerClose = () => {
    dispatch(toggleDrawer());
  };

  const links = navLinks.map((item) => (
    <LinksGroup {...item} key={item.label} onClick={handleDrawerClose} />
  ));
  const footer = footerLinks.map((item) => (
    <LinksGroup {...item} key={item.label} onClick={handleDrawerClose} />
  ));

  return (
    <MantineDrawer
      opened={isDrawerOpen}
      onClose={handleDrawerClose}
      styles={{ drawer: { height: "100%" } }}
    >
      <Stack justify="space-between" style={{ height: "100%" }}>
        <div>{links}</div>
        <div style={{ marginBottom: 64 }}>{footer}</div>
      </Stack>
    </MantineDrawer>
  );
};
