// Services
import { useGetUsersByRoleQuery } from "@services/userApi";

// UI Components
import { LoadingOverlay, Paper, Skeleton, Table } from "@mantine/core";

// Components
import { ClientRow } from "./ClientRow";

export const ListClientsResult = () => {
  // Queries
  const { data: clients, isLoading, isFetching } = useGetUsersByRoleQuery(["client"]);

  if (isLoading) {
    return <Skeleton mt="md" height={200} />;
  }

  return (
    <Paper p="md" mt="md" withBorder style={{ position: "relative" }}>
      <LoadingOverlay visible={isFetching} />
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>E-mail</th>
            <th>Register Date</th>
            <th>Last Project</th>
            <th>Projects</th>
            <th>Total Spent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients?.users.map((client, i) => (
            <ClientRow key={i} client={client} />
          ))}
        </tbody>
      </Table>
    </Paper>
  );
};
