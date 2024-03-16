// Routing
import { Link } from "react-router-dom";

// Services
import { useGetServicesQuery } from "@services/serviceApi";

// UI Components
import {
  SimpleGrid,
  Button,
  Card,
  Image,
  Text,
  createStyles,
  Badge,
  Group,
  Alert,
  Skeleton,
} from "@mantine/core";

// Icons
import { IconInfoCircle } from "@tabler/icons";

// Styles
const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },
  section: {
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    padding: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSizes.sm,
    fontWeight: 700,
  },
}));

// Props
type Props = {
  tag: string;
};

export const ListServicesResult = ({ tag }: Props) => {
  const { classes } = useStyles();

  // Queries
  const { isLoading, services } = useGetServicesQuery(
    { tag },
    {
      selectFromResult: ({ data, ...rest }) => ({
        services: data?.services || [],
        ...rest,
      }),
    }
  );

  if (isLoading) {
    return (
      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: "md", cols: 3, spacing: "md" },
          { maxWidth: "sm", cols: 2, spacing: "sm" },
          { maxWidth: "xs", cols: 1, spacing: "sm" },
        ]}
      >
        <Skeleton height={300} />
        <Skeleton height={300} />
        <Skeleton height={300} />
        <Skeleton height={300} />
      </SimpleGrid>
    );
  }

  if (!services?.length) {
    return (
      <Alert color="blue" icon={<IconInfoCircle />}>
        No services found
      </Alert>
    );
  }

  return (
    <SimpleGrid
      cols={4}
      breakpoints={[
        { maxWidth: "md", cols: 3, spacing: "md" },
        { maxWidth: "sm", cols: 2, spacing: "sm" },
        { maxWidth: "xs", cols: 1, spacing: "sm" },
      ]}
    >
      {services?.map((service, i) => (
        <Card withBorder radius="md" p="md" style={{ width: "100%" }} key={i}>
          <Card.Section>
            <Image src={service.image} alt={service.title} height={180} withPlaceholder />
          </Card.Section>
          <Card.Section className={classes.section} mt="md">
            <Text size="lg" weight={500} lineClamp={1}>
              {service.title}
            </Text>
          </Card.Section>
          <Card.Section className={classes.section}>
            <Group>
              <Badge variant="outline" color="green">
                ${service.cost}
              </Badge>
              <Badge variant="outline" color="cyan">
                {service.deliveryInDays} day delivery
              </Badge>
            </Group>
          </Card.Section>
          <Button
            radius="md"
            mt="xs"
            fullWidth
            component={Link}
            to={`/dashboard/services/${service.id}`}
          >
            Show Details
          </Button>
        </Card>
      ))}
    </SimpleGrid>
  );
};
