// Routing
import { Link } from "react-router-dom";

// UI Components
import {
  Group,
  createStyles,
  Breadcrumbs,
  Anchor,
  Title,
  Button,
} from "@mantine/core";

// Styles
const useStyles = createStyles((theme) => ({
  root: {
    height: "100%",
  },
  rootTitle: {
    color: theme.colorScheme === "dark" ? theme.colors.gray[4] : theme.black,
  },
}));

// Props
type PageWrapperProps = {
  title: string;
  breadcrumbs: {
    label: string;
    link: string;
  }[];
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export const PageWrapper: React.FC<PageWrapperProps> = ({
  title,
  breadcrumbs,
  actions,
  children,
}) => {
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <Breadcrumbs mb={16}>
        <Anchor component={Link} to="/dashboard">
          Dashboard
        </Anchor>
        {breadcrumbs.map((breadcrumb, i) => (
          <Anchor component={Link} to={breadcrumb.link} key={i}>
            {breadcrumb.label}
          </Anchor>
        ))}
      </Breadcrumbs>
      <Group position="apart">
        <Title className={classes.rootTitle}>{title}</Title>
        {actions}
      </Group>
      {children}
    </div>
  );
};
