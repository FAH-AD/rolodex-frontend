import { Link } from "react-router-dom";

// Mantine
import { Grid, Container, Flex, Stack, Text, createStyles } from "@mantine/core";

// Components
import Reviews from "./Reviews";
import ProjectForm from "./ProjectForm";

// Assets
import Logo from "@assets/images/ecomrolodex_dashboard_logo.png";
import AgencyQualityFreelanceRatesIcon from "@assets/images/ageny-quality-freelance-rates.svg";
import ChatGetUpdatesIcon from "@assets/images/chat-get-updates.svg";
import GetCROAdviceIcon from "@assets/images/get-cro-advice.svg";
import GetFreeQuote from "@assets/images/get-a-free-quote.svg";

// Showcases
const showcases = [
  {
    id: 1,
    title: (
      <>
        Agency quality <br /> Freelance rates
      </>
    ),
    image: AgencyQualityFreelanceRatesIcon,
  },
  {
    id: 2,
    title: (
      <>
        Chat, get updates <br /> & track progress
      </>
    ),
    image: ChatGetUpdatesIcon,
  },
  {
    id: 3,
    title: (
      <>
        Get CRO advice <br /> from our team
      </>
    ),
    image: GetCROAdviceIcon,
  },
  {
    id: 4,
    title: (
      <>
        Get a free Quote. <br /> Tasks starting from $45!
      </>
    ),
    image: GetFreeQuote,
  },
];

// Styles
const useStyles = createStyles((theme) => ({
  gridCol: {
    height: "100%",
    padding: "0 16px",
    [theme.fn.smallerThan("lg")]: {
      padding: 8,
    },
  },
}));

export const NewProjectRequestView = () => {
  const { classes } = useStyles();

  return (
    <Container size="xl">
      <Link to="/dashboard">
        <img src={Logo} alt="EcomRolodex Logo" height={30} style={{ marginTop: 16 }} />
      </Link>
      <Grid justify="space-between" mt="md">
        <Grid.Col lg={6} order={2} orderLg={1} className={classes.gridCol}>
          <Reviews />
        </Grid.Col>
        <Grid.Col lg={6} order={1} orderLg={2} className={classes.gridCol}>
          <ProjectForm />
          <Flex px="lg" mt="xl" justify="space-between" align="center">
            {showcases.map((showcase) => (
              <Stack align="center" spacing="xs" key={showcase.id}>
                <img src={showcase.image} alt={`${showcase.title} icon`} height={60} width={50} />
                <Text align="center" size="sm">
                  {showcase.title}
                </Text>
              </Stack>
            ))}
          </Flex>
        </Grid.Col>
      </Grid>
    </Container>
  );
};
