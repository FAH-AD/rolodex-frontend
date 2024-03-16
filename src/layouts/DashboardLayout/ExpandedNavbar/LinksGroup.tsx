import { useState } from "react";

// Routing
import { Link, NavLink, useMatch } from "react-router-dom";

// UI Components
import { Group, Box, Collapse, ThemeIcon, UnstyledButton, createStyles } from "@mantine/core";

// Icons
import { TablerIcon, IconChevronRight } from "@tabler/icons";

// Styles
const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: "block",
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  link: {
    fontWeight: 500,
    display: "block",
    textDecoration: "none",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    paddingLeft: 31,
    marginLeft: 30,
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
    borderLeft: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.fn.rgba(theme.colors[theme.primaryColor][8], 0.25)
          : theme.colors[theme.primaryColor][0],
      color: theme.colorScheme === "dark" ? theme.white : theme.colors[theme.primaryColor][7],
    },
  },

  chevron: {
    transition: "transform 200ms ease",
  },
}));

interface LinksGroupProps {
  icon: TablerIcon;
  label: string;
  link?: string;
  match: RegExp;
  initiallyOpened?: boolean;
  subLinks?: { label: string; link: string; match: RegExp }[];
  onClick?: () => void;
}

export const LinksGroup = ({
  icon: Icon,
  label,
  link,
  match,
  initiallyOpened,
  subLinks,
  onClick,
}: LinksGroupProps) => {
  const { classes, cx } = useStyles();
  const hasLinks = Array.isArray(subLinks);
  const routeMatch = useMatch(window.location.pathname);
  const [opened, setOpened] = useState(initiallyOpened || false);

  const items = (hasLinks ? subLinks : []).map((link) => (
    <NavLink
      className={cx(classes.link, {
        [classes.linkActive]: link.match
          ? link.match.test(routeMatch?.pathname || "/dashboard")
          : false,
      })}
      onClick={onClick}
      to={link.link}
      key={link.label}
    >
      {link.label}
    </NavLink>
  ));

  if (items.length) {
    return (
      <>
        <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
          <Group position="apart" spacing={0}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ThemeIcon variant="light" size={30}>
                <Icon size={18} />
              </ThemeIcon>
              <Box ml="md">{label}</Box>
            </Box>
            <IconChevronRight
              className={classes.chevron}
              size={14}
              stroke={1.5}
              style={{
                transform: opened ? `rotate(-90deg)` : "none",
              }}
            />
          </Group>
        </UnstyledButton>
        <Collapse in={opened}>{items}</Collapse>
      </>
    );
  }

  return (
    <UnstyledButton
      component={Link}
      to={link || "#"}
      onClick={onClick}
      className={cx(classes.control, {
        [classes.linkActive]: link ? match.test(routeMatch?.pathname || "/dashboard") : false,
      })}
    >
      <Group position="apart" spacing={0}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ThemeIcon variant="light" size={30}>
            <Icon size={18} />
          </ThemeIcon>
          <Box ml="md">{label}</Box>
        </Box>
      </Group>
    </UnstyledButton>
  );
};
