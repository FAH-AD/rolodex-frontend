import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

// UI Components
import { LoadingScreen } from "@components/LoadingScreen";

// Redux
import { useReduxSelector } from "@app/hook";
import { selectIsAuthenticated, selectIsAdmin, selectIsClient } from "@slices/authSlice";

// Layouts
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const CheckoutLayout = lazy(() => import("./layouts/CheckoutLayout"));

// Auth Views
const LoginView = lazy(() => import("./views/Auth/LoginView"));
const RegisterView = lazy(() => import("./views/Auth/RegisterView"));
const MagicLinkView = lazy(() => import("./views/Auth/MagicLinkView"));

// Service Views
const ListServicesView = lazy(() => import("./views/Service/ListServicesView"));
const ServiceDetailsView = lazy(() => import("./views/Service/ServiceDetailsView"));
const CreateServiceView = lazy(() => import("./views/Service/CreateServiceView"));

// Project Views
const ListProjectsView = lazy(() => import("./views/Project/ListProjectsView"));
const ProjectDetailsView = lazy(() => import("./views/Project/ProjectDetailsView"));
const CreateProjectView = lazy(() => import("./views/Project/CreateProjectView"));
const CreateRequestView = lazy(() => import("./views/Project/CreateRequestView"));
const NewProjectRequestView = lazy(() => import("./views/Project/NewProjectRequestView"));

// Daily Tasks Views
const ListMyDailyTasksView = lazy(() => import("./views/DailyTask/ListMyDailyTasksView"));
const ListAllUsersDailyTasksView = lazy(
  () => import("./views/DailyTask/ListAllUsersDailyTasksView")
);

// User Views
const ListTeamView = lazy(() => import("./views/User/ListTeamView"));
const ListClientsView = lazy(() => import("./views/User/ListClientsView"));

// Resource Views
const ListResourcesView = lazy(() => import("./views/Resource/ListResourcesView"));
const ResourceDetailsView = lazy(() => import("./views/Resource/ResourceDetailsView"));
const CreateResourceView = lazy(() => import("./views/Resource/CreateResourceView"));

// Ecommerce Checklist Views
const ListEcommerceChecklistsView = lazy(
  () => import("./views/EcommerceChecklist/ListEcommerceChecklistsView")
);
const CreateEcommerceChecklistView = lazy(
  () => import("./views/EcommerceChecklist/CreateEcommerceChecklistView")
);

// Settings Views
const SettingsView = lazy(() => import("./views/Settings/SettingsView"));

// Checkout Views
const CheckoutView = lazy(() => import("./views/Checkout/CheckoutView"));

const UnknownView = lazy(() => import("./views/VisualCollab/UnknownView"));

// Message Views
const MessageCenterView = lazy(() => import("./views/Message/MessageCenterView"));

// Refer & Earn Views
const AffiliateProgramView = lazy(() => import("./views/ReferAndEarn/AffiliateProgramView"));

/**
 * Visual collab
 */
const ListVisualCollab = lazy(() => import("./views/VisualCollab/ListVisualCollab"));

export const AppRoutes = () => {
  const isAuthenticated = useReduxSelector(selectIsAuthenticated);
  const isAdmin = useReduxSelector(selectIsAdmin);
  const isClient = useReduxSelector(selectIsClient);

  return (
    <Suspense fallback={<LoadingScreen />}>
      {isAuthenticated ? (
        <Routes>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="/dashboard" element={<MessageCenterView />} />
            <Route path="/dashboard/message-center" element={<MessageCenterView />} />
            {isAdmin && <Route path="/dashboard/users/team" element={<ListTeamView />} />}
            {isAdmin && <Route path="/dashboard/users/clients" element={<ListClientsView />} />}
            {isAdmin && (
              <Route path="/dashboard/daily-tasks/all" element={<ListAllUsersDailyTasksView />} />
            )}
            {!isClient && (
              <Route path="/dashboard/daily-tasks" element={<ListMyDailyTasksView />} />
            )}
            <Route path="/dashboard/services" element={<ListServicesView />} />
            <Route path="/dashboard/services/create" element={<CreateServiceView />} />
            <Route path="/dashboard/services/:id" element={<ServiceDetailsView />} />
            <Route path="/dashboard/projects" element={<ListProjectsView />} />
            <Route path="/dashboard/projects/create" element={<CreateProjectView />} />
            {isClient && (
              <Route path="/dashboard/projects/request" element={<CreateRequestView />} />
            )}
            <Route path="/dashboard/projects/:id" element={<ProjectDetailsView />} />
            <Route path="/dashboard/visualcollab/:id" element={<ListVisualCollab />} />
            <Route path="/dashboard/resources" element={<ListResourcesView />} />
            {isAdmin && (
              <Route path="/dashboard/resources/create" element={<CreateResourceView />} />
            )}
            <Route path="/dashboard/resources/:id" element={<ResourceDetailsView />} />
            <Route
              path="/dashboard/ecommerce-checklists"
              element={<ListEcommerceChecklistsView />}
            />
            {isAdmin && (
              <Route
                path="/dashboard/ecommerce-checklists/create"
                element={<CreateEcommerceChecklistView />}
              />
            )}
            <Route path="/dashboard/affiliate-program" element={<AffiliateProgramView />} />
            <Route path="/dashboard/settings" element={<SettingsView />} />
          </Route>
          <Route path="/checkout" element={<CheckoutLayout />}>
            <Route path="/checkout/:id" element={<CheckoutView />} />
          </Route>
          <Route path="*" element={<UnknownView />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/magic-link" element={<MagicLinkView />} />
          <Route path="/new-request" element={<NewProjectRequestView />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/checkout" element={<CheckoutLayout />}>
            <Route path="/checkout/:id" element={<CheckoutView />} />
          </Route>
          <Route path="/dashboard/visualcollab/:id" element={<ListVisualCollab />} />
        </Routes>
      )}
    </Suspense>
  );
};
