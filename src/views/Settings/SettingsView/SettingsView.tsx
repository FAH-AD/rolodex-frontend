import { lazy, Suspense } from "react";

// UI Components
import { LoadingOverlay, Tabs } from "@mantine/core";

// Hooks
import { useVerifyRole } from "@hooks/auth/useVerifyRole";

// Components
import { PageWrapper } from "@components/PageWrapper";
import ProfileTab from "./ProfileTab";

// Lazy Components
const SlackTab = lazy(() => import("./SlackTab"));

export const SettingsView = () => {
  const { verifyRole } = useVerifyRole();

  return (
    <PageWrapper
      title="Settings"
      breadcrumbs={[
        {
          label: "Settings",
          link: "/dashboard/settings",
        },
      ]}
    >
      <Tabs mt="md" defaultValue="profile">
        <Suspense fallback={<LoadingOverlay visible />}>
          {verifyRole("admin") && (
            <Tabs.List>
              <Tabs.Tab value="profile">Profile</Tabs.Tab>
              <Tabs.Tab value="slack">Slack Relations</Tabs.Tab>
            </Tabs.List>
          )}
          <Tabs.Panel value="profile">
            <ProfileTab />
          </Tabs.Panel>
          {verifyRole("admin") && (
            <Tabs.Panel mt="md" value="slack">
              <SlackTab />
            </Tabs.Panel>
          )}
        </Suspense>
      </Tabs>
    </PageWrapper>
  );
};
