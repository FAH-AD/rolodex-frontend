import React, { useState } from "react";

import {
  Text,
  Paper,
  Grid,
  Menu,
  Button,
  Divider,
  createStyles,
  Card,
  Avatar,
} from "@mantine/core";

const DeleteSuggestion = React.lazy(() =>
  import("@components/VisualCollab/DeleteSuggestion").then((module) => ({
    default: module.DeleteSuggestion,
  }))
);

const Status = React.lazy(() =>
  import("@components/VisualCollab/Status").then((module) => ({
    default: module.Status,
  }))
);

const DateTimeformat = React.lazy(() =>
  import("@views/VisualCollab/ListVisualCollab/DateTimeformat").then(
    (module) => ({
      default: module.DateTimeformat,
    })
  )
);

const useStyles = createStyles((theme) => ({
  font: {
    color: theme.colorScheme === "dark" ? theme.colors.gray[4] : theme.black,
  },
  rootTitle: {
    color: theme.colorScheme === "dark" ? theme.colors.gray[4] : theme.black,
  },
  search: {
    backgroundColor:
      theme.colorScheme === "light" ? theme.colors.white : theme.white,
  },
}));

type props = {
  suggestion: any;
  visualCollabRefetch: () => void;
};

export const SuggestionBox: React.FC<props> = ({ suggestion, visualCollabRefetch }) => {
  const [hoveredIndex, setHoveredIndex] = useState(false);
  const { classes } = useStyles();
  return (
    <Card
      key={suggestion.index}
      style={{
        position: "relative",
        borderRadius: "10px",
        width: "100%",
        height: "200px",
      }}
    >
      <Grid>
        <Grid.Col span={12}>
          <Grid>
            <Grid.Col span={8} sm={3} md={8} lg={8}>
              <Avatar
                color="#D9D9D9"
                radius="xl"
                src={suggestion.user.image}
                onMouseEnter={() => setHoveredIndex(true)}
                onMouseLeave={() => setHoveredIndex(false)}
              ></Avatar>
              {hoveredIndex && (
                <Paper
                  style={{
                    position: "absolute",
                    margin: "20px 0px 0px 45px",
                    top: 0,
                    backgroundColor: "#F3F0FF",
                    padding: "5px 10px",
                    borderRadius: "4px",
                  }}
                >
                  <Text
                    weight={600}
                    style={{
                      color: "#333333",
                      fontSize: "14px",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {suggestion.user.name}
                  </Text>
                </Paper>
              )}
            </Grid.Col>
            <Grid.Col span={2} sm={6} md={2} lg={2}>
              <Menu
                shadow="lg"
                radius={6}
                width={100}
                position="left"
                offset={5}
                withArrow
              >
                <Menu.Target>
                  <Button
                    variant="subtle"
                    style={{
                      color: "#6F767E",
                      fontWeight: 700,
                      fontSize: "25px",
                      padding: "0px 0px 10px 0px",
                    }}
                  >
                    <Text className={classes.font}>...</Text>
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    className={classes.font}
                    style={{
                      fontSize: "12px",
                      width: "100px",
                      height: "0px",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      lineHeight: "0px",
                    }}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item>
                    <DeleteSuggestion
                      id={suggestion.id}
                      key={suggestion.id}
                      updateData={visualCollabRefetch}
                    />
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Grid.Col>
            <Grid.Col span={2} sm={6} md={2} lg={2}>
              <Status
                id={suggestion.id}
                status={suggestion.status}
                updateData={visualCollabRefetch}
              />
            </Grid.Col>
          </Grid>

          <Grid.Col span={12} sm={8} md={10} lg={12}>

          </Grid.Col>

          <Grid>
            <Grid.Col span={6}>
              <Text
                key={suggestion.id}
                style={{
                  fontSize: "12px",
                  width: "110.93px",
                  height: "11.86px",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  lineHeight: "15px",
                  margin: "5px 0px -5px 1px",
                }}
              >
                #<span className={classes.font}>{suggestion.suggestionId}.</span>
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text
                className={classes.font}
                style={{
                  fontSize: "12px",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                }}
              >
                <DateTimeformat dateTime={suggestion.updatedAt} />
              </Text>
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={12} sm={6} md={8} lg={12}>
              <Text
                className={classes.font}
                size="sm"
                color="dimmed"
                style={{
                  fontSize: "12px",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                }}
              >
                {suggestion.suggestion}
              </Text>
              <Divider mt="xl" />
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
    </Card>
  )
}
