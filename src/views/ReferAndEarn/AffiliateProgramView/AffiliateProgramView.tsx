import dayjs from "dayjs";

// Services
import { useGetAffiliatesQuery } from "@services/userApi";

// Redux
import { useReduxSelector } from "@app/hook";
import { selectUser } from "@slices/authSlice";

// Mantine
import {
  Alert,
  Button,
  Card,
  CopyButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";

// Components
import { PageWrapper } from "@components/PageWrapper";

// Icons
import { IconAlertCircle, IconInfoCircle } from "@tabler/icons";

export const AffiliateProgramView = () => {
  const user = useReduxSelector(selectUser);

  const { data, isLoading, isFetching } = useGetAffiliatesQuery();

  return (
    <PageWrapper
      title="Affiliate Program"
      breadcrumbs={[
        {
          label: "Refer & Earn",
          link: "/affiliate-program",
        },
      ]}
    >
      {user ? (
        <Card withBorder shadow="sm" mt="md">
          <TextInput
            label="Share this register URL to earn credits when your friends sign up"
            value={`https://dashboard.ecomrolodex.com/auth/register?ref=${user.referenceId}`}
            readOnly
            rightSection={
              <CopyButton
                value={`https://dashboard.ecomrolodex.com/auth/register?ref=${user.referenceId}`}
              >
                {({ copied, copy }) => (
                  <Button
                    color={copied ? "teal" : "blue"}
                    onClick={copy}
                    style={{ marginRight: 32 }}
                  >
                    {copied ? "Copied" : "Copy"}
                  </Button>
                )}
              </CopyButton>
            }
          />
        </Card>
      ) : (
        <Alert title="Error" color="red" icon={<IconAlertCircle />}>
          User data could not be retrieved
        </Alert>
      )}
      {isLoading && isFetching ? (
        <Skeleton mt="md" height={200} />
      ) : (
        <>
          <Text weight={700} size="lg" mt="lg">
            My Affiliates
          </Text>
          {data?.affiliates.length ? (
            <Paper withBorder p="md" mt="sm">
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>E-mail</th>
                    <th>Registered At</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.affiliates.map((affiliate) => (
                    <tr key={affiliate.id}>
                      <td>{affiliate.name}</td>
                      <td>{affiliate.email}</td>
                      <td>{dayjs(affiliate.createdAt).format("DD MMM YYYY | hh:mm a")}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Paper>
          ) : (
            <Alert mt="sm" color="blue" icon={<IconInfoCircle />}>
              You don't have any affiliates
            </Alert>
          )}
        </>
      )}
    </PageWrapper>
  );
};
