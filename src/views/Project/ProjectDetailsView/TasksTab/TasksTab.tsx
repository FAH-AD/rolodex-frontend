import { Suspense, lazy, useState } from "react";

// Services
import { useGetProjectTasksQuery } from "@services/projectTaskApi";

// UI Components
import {
  Alert,
  Box,
  Button,
  Grid,
  Avatar,
  Group,
  LoadingOverlay,
  Paper,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";

import { Calendar } from "@mantine/dates";

// UI Utils
import { openModal } from "@mantine/modals";

// Icons
import { IconInfoCircle, IconArrowsUpDown } from "@tabler/icons";
import { IoDocumentText, IoNotifications } from "react-icons/io5";
import { BiSolidImage } from "react-icons/bi";
import { FaPlus, FaPlusCircle } from "react-icons/fa";
import { RxCalendar } from "react-icons/rx";

// Components
import { Actions } from "./Actions";

// Props
type Props = {
  projectId: number;
};

// Lazy Components
const CreateProjectTask = lazy(() => import("@components/Project/CreateTask"));

export const TasksTab = ({ projectId }: Props) => {
  const { data: tasks, isLoading } = useGetProjectTasksQuery(projectId);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleIconClick = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleCreateTask = () => {
    openModal({
      key: "createProjectTask",
      title: "Create Project Task",
      children: (
        <Suspense fallback={<LoadingOverlay visible />}>
          <CreateProjectTask projectId={projectId} />
        </Suspense>
      ),
    });
  };

  if (isLoading) {
    return <Skeleton mt="sm" height={100} />;
  }

  const getTime = (createdAt: string) => {
    const givenTimestamp = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;

    const currentTime = new Date();
    const timeDifferenceInMilliseconds = currentTime.getTime() - givenTimestamp.getTime();

    const hours = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifferenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}H ${minutes}M`;
  }

  return (
    <>
      <Grid>
        <Grid.Col span={12}>
          <Paper
            pl="md"
            p="xs"
            shadow="xs"
            mt="md"
            mb="1.5rem"
            radius="md"
            style={{ display: "flex" }}
          >
            <Text
              size="sm"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                width: "30%",
              }}
            >
              Task
            </Text>

            <Text
              size="sm"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                width: "14%",
              }}
            >
              Priority
              <IconArrowsUpDown
                size={16}
                strokeWidth={2}
                color="black"
                style={{ marginLeft: "0.5rem" }}
              />
            </Text>

            <Text
              size="sm"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                width: "15%",
              }}
            >
              Assignee
            </Text>

            <Text
              size="sm"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                width: "16%",
              }}
            >
              Due Date
            </Text>

            <Text
              size="sm"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
              }}
            >
              Progress
            </Text>
          </Paper>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={12}>
          <Box>
            {tasks?.length === 0 && (
              <Alert icon={<IconInfoCircle />} color="cyan">
                There are no tasks for this project.
              </Alert>
            )}
            {tasks && tasks.length > 0 && (
              <Stack>
                {tasks.map((task, i) => (
                  <Paper key={i} withBorder shadow="xs" pr="xl">
                    <Group position="apart">
                      <Grid.Col
                        span={3}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Grid.Col
                          lg={11}
                          style={{
                            display: "flex",
                          }}
                        >
                          <Text pr="xs" size="sm" weight={500}>
                            #1
                          </Text>
                          <Text
                            size="sm"
                            weight={700}
                            color={
                              task.visibility === "hidden"
                                ? "dimmed"
                                : undefined
                            }
                            style={{
                              width: "90%",
                              wordWrap: "break-word",
                              textDecoration:
                                task.status === "done"
                                  ? "line-through"
                                  : "none",
                            }}
                          >
                            {task.title}
                          </Text>
                        </Grid.Col>
                        <Grid.Col
                          pt="xs"
                          pr="md"
                          lg={6}
                          style={{
                            display: "flex",
                            justifyContent: "right",
                            width: "100%",
                          }}
                        >
                          <IoDocumentText color="#D9D9D9" size={18} />
                          <BiSolidImage color="#D9D9D9" size={18} />
                          <Paper
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <IoNotifications color="#5963C1" size={18} />
                            <Paper
                              style={{
                                position: "absolute",
                                top: 0,
                                right: 2,
                                width: 5,
                                height: 5,
                                backgroundColor: "red",
                                borderRadius: "50%",
                              }}
                            />
                          </Paper>
                        </Grid.Col>
                      </Grid.Col>
                      <Grid.Col span={1} style={{ display: "flex" }}>
                        <Text
                          pl="4px"
                          size="xs"
                          color="red"
                          style={{ width: "100%" }}
                        >
                          Urgent
                        </Text>
                      </Grid.Col>
                      <Grid.Col
                        pl="md"
                        span={1}
                        style={{
                          display: "flex",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        <Avatar size="md" />
                      </Grid.Col>
                      <Grid.Col span={1} style={{ display: "flex" }}>
                        <Text size="sm" color="#5963C1">
                          Today
                        </Text>
                      </Grid.Col>

                      <Grid.Col span={3} style={{ display: "flex" }}>
                        <Grid.Col span={6}>
                          <Text
                            size="xs"
                            color="#5963C1"
                            style={{
                              display: "flex",
                              width: "100%",
                              textAlign: "center",
                            }}
                          >
                            {getTime(task.createdAt)}
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Actions task={task} projectId={projectId} />
                        </Grid.Col>
                      </Grid.Col>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
        </Grid.Col>
        <Grid.Col span={12}>
          <Paper withBorder shadow="xs">
            <Group position="apart">
              <Grid.Col
                span={6}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  onClick={handleCreateTask}
                  style={{
                    color: "#D9D9D9",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <FaPlus style={{ paddingRight: "8px" }} />
                  Add New Task
                </Button>
              </Grid.Col>

              <Paper
                pb="sm"
                style={{
                  position: "relative",
                  display: "inline-block",
                }}
              >
                <Avatar radius="xl" />

                <div
                  style={{
                    position: "absolute",
                    top: 20,
                    right: -6,
                    zIndex: 1,
                  }}
                >
                  <FaPlusCircle color="#868E96" size={12} />
                </div>
              </Paper>

              <div style={{ position: "relative" }}>
                <Group position="center">
                  <div
                    onClick={handleIconClick}
                    style={{
                      display: "inline-block",
                      cursor: "pointer",
                      fontSize: "18px",
                    }}
                  >
                    <span role="img" aria-label="Calendar">
                      <RxCalendar color="#B2B2B2" />
                    </span>
                  </div>
                </Group>

                {isCalendarOpen && (
                  <Calendar
                    style={{
                      position: "absolute",
                      bottom: "-300px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 100,
                      width: "140px",
                    }}
                  />
                )}

                {/* Rest of your component */}
              </div>

              <Grid.Col span={3}>
                <Button
                  size="xs"
                  radius={10}
                  style={{
                    width: "97px",
                    background:
                      "linear-gradient(341.15deg, #3E50FF -62.06%, #AAB2FD 141.02%)",
                  }}
                >
                  Save
                </Button>
              </Grid.Col>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>
    </>
  );
};
