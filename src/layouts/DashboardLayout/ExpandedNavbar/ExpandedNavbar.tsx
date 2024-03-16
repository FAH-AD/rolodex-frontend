// Mantine
import { createStyles, Navbar, ScrollArea } from "@mantine/core";

// Components
import { LinksGroup } from "./LinksGroup";

// Icons
import { IconCoin, IconSettings } from "@tabler/icons";

// Constants
import { useNavLinks } from "@hooks/layout/useNavLinks";

// Styles
const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },

  linksInner: {
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },
}));

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

export const ExpandedNavbar = () => {
  const { classes } = useStyles();
  const { navLinks } = useNavLinks();

  const links = navLinks.map((item) => <LinksGroup {...item} key={item.label} />);
  const footer = footerLinks.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <Navbar width={{ sm: 260 }} p="md" className={classes.navbar}>
      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>{links}</div>
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>{footer}</Navbar.Section>
    </Navbar>
  );
};
