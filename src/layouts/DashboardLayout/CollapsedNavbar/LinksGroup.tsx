// Routing
import { Link, useMatch } from "react-router-dom";

// UI Components
import { createStyles, UnstyledButton, Menu, Tooltip } from "@mantine/core";

// Icons
import { TablerIcon } from "@tabler/icons";

// Styles
const useStyles = createStyles((theme) => ({
  link: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
    opacity: 0.85,

    "&:hover": {
      opacity: 1,
      color: theme.white,
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor }).background!,
        0.1
      ),
    },
  },

  linkActive: {
    opacity: 1,
    color: theme.white,
    backgroundColor: theme.fn.lighten(
      theme.fn.variant({ variant: "filled", color: theme.primaryColor }).background!,
      0.1
    ),
  },

  subLinkActive: {
    opacity: 1,
    fontWeight: 600,
    color: theme.colors.blue[5],
  },

  active: {
    opacity: 1,
    "&, &:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor }).background!,
        0.15
      ),
    },
  },
}));

interface LinksGroupProps {
  icon: TablerIcon;
  label: string;
  link: string;
  match: RegExp;
  subLinks?: { label: string; link: string; match: RegExp }[];
}

export const LinksGroup = ({ icon: Icon, label, link, match, subLinks }: LinksGroupProps) => {
  const { classes, cx, theme } = useStyles();
  const hasLinks = Array.isArray(subLinks);
  const routeMatch = useMatch(window.location.pathname);

  if (hasLinks) {
    return (
      <Menu position="right-start" withinPortal withArrow trigger="hover" shadow="sm" width={150}>
        <Menu.Target>
          <UnstyledButton
            component={Link}
            to={link}
            className={cx(classes.link, {
              [classes.linkActive]: match
                ? match.test(routeMatch?.pathname || "/dashboard")
                : false,
            })}
          >
            <Icon size={20} />
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>{label}</Menu.Label>
          {subLinks.map((link) => (
            <Menu.Item
              key={link.link}
              component={Link}
              to={link.link}
              className={cx({
                [classes.subLinkActive]: link.match
                  ? link.match.test(routeMatch?.pathname || "/dashboard")
                  : false,
              })}
            >
              {link.label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    );
  }

  return (
    <Tooltip label={label} position="right" color={theme.primaryColor} withArrow withinPortal>
      <UnstyledButton
        component={Link}
        to={link}
        className={cx(classes.link, {
          [classes.linkActive]: link ? match.test(routeMatch?.pathname || "/dashboard") : false,
        })}
      >
        <Icon size={20} />
      </UnstyledButton>
    </Tooltip>
  );
};
