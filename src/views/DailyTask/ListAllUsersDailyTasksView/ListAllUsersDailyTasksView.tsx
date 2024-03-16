// Routing
import { Link } from "react-router-dom";

// Redux
import { useReduxDispatch } from "@app/hook";
import { setDates } from "@slices/dailyTaskSlice";

// Hooks
import { useVerifyRole } from "@hooks/auth/useVerifyRole";

// UI Components
import { DateRangePicker } from "@mantine/dates";

// Components
import { ListAllUsersDailyTasksResult } from "./ListAllUsersDailyTasksResult";
import { PageWrapper } from "@components/PageWrapper";
import { Button, Group } from "@mantine/core";

export const ListAllUsersDailyTasksView = () => {
  const dispatch = useReduxDispatch();
  const { verifyRole } = useVerifyRole();

  return (
    <PageWrapper
      title="Daily Tasks"
      breadcrumbs={[
        {
          label: "Daily Tasks",
          link: "/dashboard/daily-tasks",
        },
      ]}
      actions={
        <Group>
          <DateRangePicker
            placeholder="Pick a date range"
            onChange={(range) => {
              dispatch(
                setDates({
                  startDate: range[0]?.toISOString() || null,
                  endDate: range[1]?.toISOString() || null,
                })
              );
            }}
            style={{
              width: 280,
            }}
          />
          {verifyRole("admin") && (
            <Button component={Link} to="/dashboard/daily-tasks">
              My Tasks
            </Button>
          )}
        </Group>
      }
    >
      <ListAllUsersDailyTasksResult />
    </PageWrapper>
  );
};
