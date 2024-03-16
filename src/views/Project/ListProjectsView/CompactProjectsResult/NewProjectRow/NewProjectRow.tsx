import { Suspense, lazy, useMemo } from "react";

// Routing
import { Link } from "react-router-dom";

// Redux
import { useReduxSelector } from "@app/hook";
import { selectIsClient } from "@slices/authSlice";

// Mantine
import {
  Accordion,
  ActionIcon,
  Affix,
  Anchor,
  Avatar,
  Badge,
  Center,
  Flex,
  Group,
  LoadingOverlay,
  Notification,
  Paper,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { openModal } from "@mantine/modals";

// Icons
import {
  IconPlus,
  IconBuildingStore,
  IconFileDescription,
  IconPhoto,
  IconBell,
} from "@tabler/icons";

// Components
import { StatusBadge } from "@components/Project/StatusBadge/StatusBadge";
import { ProjectLinks } from "@components/Project/ProjectLinks/ProjectLinks";
import { PriorityBadge } from "@components/Project/PriorityBadge/PriorityBadge";

// Date utils
import dayjs from "dayjs";

// Interfaces
import { Project } from "@interfaces/project";

// Lazy Components
const CreateProjectTask = lazy(() => import("@components/Project/CreateTask"));

// Props
type Props = {
  project: Project;
};

export const NewProjectRow = ({ project }: Props) => {
  const isClient = useReduxSelector(selectIsClient);

  const handleCreateTask = () => {
    openModal({
      title: `Create Task for #${project.id}`,
      children: (
        <Suspense fallback={<LoadingOverlay visible />}>
          <CreateProjectTask projectId={project.id} />
        </Suspense>
      ),
    });
  };

  const getProgressLabel = () => {
    return project.progresses[project.progresses.length - 1].name.toUpperCase();
  };

  const projectProgress = useMemo(() => {
    const allTasks = project.tasks.length;
    const doneTasks = project.tasks.filter((t) => t.status === "done").length;
    const percentage = allTasks
      ? Number((doneTasks / allTasks) * 100).toFixed(0)
      : 100;

    return {
      percentage,
      count: `${doneTasks} / ${allTasks}`,
    };
  }, [project.tasks]);

  function extractText(html: string) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || "";
  }

  return (
    <>
      <Accordion
        chevronPosition="left"
        my={"xs"}
        style={{ backgroundColor: "#fff", borderRadius: 10 }}
      >
        <Accordion.Item value={project.title} style={{ borderBottom: "none" }}>
          <Accordion.Control py={"xs"}>
            <Flex direction="row" align="center" wrap="wrap" gap={"xs"}>
              <section
                style={{
                  width: "calc(100% / 25)",
                }}
              >
                <Anchor
                  component={Link}
                  to={`/dashboard/projects/${project.id}`}
                >
                  <Text size={"xs"}>#{project.id}</Text>
                </Anchor>
              </section>

              <section
                style={{
                  width: "calc(100% / 8.5)",
                  display: "flex",
                }}
              >
                <Anchor
                  component={Link}
                  to={`/dashboard/projects/${project.id}`}
                >
                  <Text size={"sm"}>{project.title}</Text>
                </Anchor>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="18"
                  height="18"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#7cb342"
                    d="M37.216,11.78c-0.023-0.211-0.211-0.305-0.351-0.305s-3.21-0.234-3.21-0.234s-2.132-2.132-2.39-2.343	c-0.234-0.234-0.68-0.164-0.867-0.117c-0.023,0-0.469,0.141-1.195,0.375c-0.726-2.086-1.968-3.984-4.194-3.984h-0.211	C24.187,4.375,23.391,4,22.735,4c-5.155,0-7.639,6.444-8.412,9.725c-2.015,0.633-3.445,1.054-3.609,1.125	c-1.125,0.351-1.148,0.375-1.289,1.429c-0.117,0.797-3.046,23.456-3.046,23.456L29.179,44l12.373-2.671	C41.575,41.282,37.24,11.991,37.216,11.78z M27.937,9.483c-0.562,0.164-1.242,0.375-1.921,0.609V9.671	c0-1.265-0.164-2.296-0.469-3.117C26.718,6.695,27.445,7.984,27.937,9.483L27.937,9.483z M24.117,6.812	c0.305,0.797,0.516,1.922,0.516,3.468v0.234c-1.265,0.398-2.601,0.797-3.984,1.242C21.422,8.804,22.899,7.351,24.117,6.812	L24.117,6.812z M22.617,5.359c0.234,0,0.469,0.094,0.656,0.234c-1.664,0.773-3.421,2.718-4.148,6.655	c-1.101,0.351-2.156,0.656-3.163,0.984C16.806,10.233,18.915,5.359,22.617,5.359z"
                  ></path>
                  <path
                    fill="#558b2f"
                    d="M36.865,11.428c-0.141,0-3.21-0.234-3.21-0.234s-2.132-2.132-2.39-2.343	C31.17,8.757,31.053,8.71,30.96,8.71L29.249,44l12.373-2.671c0,0-4.335-29.338-4.359-29.549	C37.169,11.569,37.005,11.475,36.865,11.428z"
                  ></path>
                  <path
                    fill="#fff"
                    d="M24.792,18.593l-1.475,4.449c0,0-1.337-0.715-2.927-0.715c-2.374,0-2.489,1.498-2.489,1.867	c0,2.028,5.301,2.812,5.301,7.583c0,3.757-2.374,6.177-5.578,6.177c-3.872,0-5.808-2.397-5.808-2.397l1.037-3.411	c0,0,2.028,1.752,3.734,1.752c1.129,0,1.59-0.876,1.59-1.521c0-2.651-4.333-2.766-4.333-7.145c0-3.665,2.628-7.214,7.952-7.214	C23.777,17.994,24.792,18.593,24.792,18.593z"
                  ></path>
                </svg>
              </section>

              <section
                style={{
                  width: "calc(100% / 10)",
                }}
              >
                {project.managers.length ? (
                  <Group spacing="xs">
                    {project.managers.map((manager) => (
                      <Tooltip
                        withArrow
                        withinPortal
                        color="dark"
                        position="bottom"
                        label={manager.user.name}
                        key={manager.user.id}
                      >
                        <Avatar src={manager.user.image} radius="xl" size="sm">
                          {`${manager.user.name.charAt(
                            0
                          )}${manager.user.name.charAt(1)}`.toUpperCase()}
                        </Avatar>
                      </Tooltip>
                    ))}
                  </Group>
                ) : (
                  <Text color="dimmed" size="sm">
                    No managers found
                  </Text>
                )}
              </section>

              <section
                style={{
                  width: "calc(100% / 9.3)",
                }}
              >
                <Group spacing="xs">
                  <Text size={"sm"}>{projectProgress.count} Tasks</Text>
                  <ActionIcon
                    size={12}
                    radius="xl"
                    color="violet"
                    variant="filled"
                    onClick={handleCreateTask}
                  >
                    <IconPlus />
                  </ActionIcon>
                </Group>
                <Text color="violet" weight={600} size={9}>
                  {projectProgress.percentage}% Completed
                </Text>
              </section>

              <section
                style={{
                  width: "calc(100% / 7.2)",
                }}
              >
                {project.estimatedDeliveryDate ? (
                  dayjs(project.estimatedDeliveryDate).from(dayjs())
                ) : (
                  <Text color="dimmed" size="sm">
                    Project is not started yet
                  </Text>
                )}
              </section>

              <section
                style={{
                  width: "calc(100% / 16)",
                }}
              >
                <Text color="green">{project.priority}</Text>
              </section>

              <section
                style={{
                  width: "calc(100% / 10)",
                }}
              >
                <Badge color="green" variant="filled">
                  <Text weight={500} color="#000">
                    {project.status ? project.status.name : "-"}
                  </Text>
                </Badge>
              </section>

              <section
                style={{
                  width: "calc(100% / 10.5)",
                }}
              >
                <Text size={"sm"}>
                  {dayjs(project.updatedAt).from(dayjs())}
                </Text>
              </section>

              <section
                style={{
                  width: "calc(100% / 14)",
                }}
              >
                {project.budget ? (
                  <Badge color="green">${project.budget}</Badge>
                ) : (
                  <Text>-</Text>
                )}
              </section>

              <section
                style={{
                  width: "calc(100% / 12)",
                }}
              >
                <ProjectLinks project={project} />
              </section>
            </Flex>
          </Accordion.Control>
          <Accordion.Panel>
            {project.tasks.length > 0 ? (
              <Paper mt="sm" style={{ overflowX: "auto" }}>
                {/* <Affix position={{ right: 20, bottom: 20 }}>
                <Notification loading title="Refreshing" disallowClose>
                  Table is being refreshed, please wait...
                </Notification>
              </Affix> */}
                <Table highlightOnHover verticalSpacing="sm">
                  <thead>
                    <tr>
                      <th style={{ fontSize: 12 }}>Task</th>
                      <th style={{ fontSize: 12 }}>Status</th>
                      <th style={{ fontSize: 12 }}>Priority</th>
                      <th style={{ fontSize: 12 }}>Assigned</th>
                      <th style={{ fontSize: 12 }}>Date Modified</th>
                      <th style={{ fontSize: 12 }}>Duration</th>
                      <th style={{ fontSize: 12 }}>Attachments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.tasks.map((task) => (
                      <tr>
                        <td>
                          <Paper
                            style={{
                              display: "flex",
                              alignItems: "center",
                              backgroundColor: "inherit",
                            }}
                          >
                            <div
                              style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "20%",
                                backgroundColor: "red",
                              }}
                            />
                            <Text mx={"md"} size={"sm"}>
                              {task.id}
                            </Text>
                            <Text mr={4} size={"sm"}>
                              {task.title}:
                            </Text>
                            {task?.description && (
                              <IconFileDescription color="gray" size={16} />
                            )}
                            {project.links.length > 0 && (
                              <IconPhoto color="gray" size={16} />
                            )}
                            {task.createdAt != task.updatedAt && (
                              <IconBell color="gray" size={16} />
                            )}
                          </Paper>
                        </td>
                        <td>
                          <Badge
                            py={"xs"}
                            px={"lg"}
                            style={{
                              backgroundColor: "green",
                              color: "#fff",
                              fontWeight: 500,
                            }}
                          >
                            {task.status}
                          </Badge>
                        </td>
                        <td>
                          <Text color="green">Normal</Text>
                        </td>
                        <td>
                          <Group spacing="xs">
                            <Avatar
                              src={project.managers[0].user.image}
                              radius="xl"
                              size="sm"
                            >
                              {`${project.managers[0].user.name.charAt(
                                0
                              )}${project.managers[0].user.name.charAt(
                                1
                              )}`.toUpperCase()}
                            </Avatar>
                            <Text color="blue">
                              {project.managers[0].user.name}
                            </Text>
                          </Group>
                        </td>
                        <td>
                          <Text color="blue">
                            {dayjs(task.updatedAt).format("DD MMM YYYY")}
                          </Text>
                        </td>
                        <td>
                          <Text color="blue" style={{ cursor: "pointer" }}>
                            Add Button
                          </Text>
                        </td>
                        <td>
                          {project.links.length > 0 ? (
                            project.links.map((link, index: number) => (
                              <Text key={index} color="blue">
                                {link.url}
                              </Text>
                            ))
                          ) : (
                            <Text color="blue">No Attachments provided</Text>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Paper>
            ) : (
              <Center py={"xs"}>
                <Text size={"sm"}>No tasks added</Text>
              </Center>
            )}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
};
