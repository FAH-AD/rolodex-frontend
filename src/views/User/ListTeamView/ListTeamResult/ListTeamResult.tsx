// Services
import { useGetUsersByRoleQuery } from "@services/userApi";

// UI Components
import { LoadingOverlay, Paper, Skeleton, Table } from "@mantine/core";

// Components
import { MemberRow } from "./MemberRow";

export const ListTeamResult = () => {
  // Queries
  const {
    data: team,
    isLoading,
    isFetching,
  } = useGetUsersByRoleQuery(["admin", "manager", "sales", "developer"]);

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
            <th>Role</th>
            <th>Last Online</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {team?.users.map((member, i) => (
            <MemberRow key={i} member={member} />
          ))}
        </tbody>
      </Table>
    </Paper>
  );
};
