import { lazy, Suspense, useState } from "react";

// Redux
import { useReduxSelector } from "@app/hook";
import { selectUser } from "@slices/authSlice";

// UI Components
import { ActionIcon, Button, FileButton, LoadingOverlay, Menu } from "@mantine/core";

// UI Utils
import { openModal } from "@mantine/modals";

// Icons
import { IconCurrencyDollar, IconPlus, IconUpload } from "@tabler/icons";

// Websocket
import { Socket } from "socket.io-client";

// Interfaces
import { Project } from "@interfaces/project";

// Lazy Imports
const CreateOffer = lazy(() => import("@components/Project/CreateOffer"));

// Props
type Props = {
  project: Project;
  socket: Socket;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  fileResetRef: React.RefObject<() => void>;
  showSendOffer?: boolean;
};

export const AttachmentButton = ({
  project,
  socket,
  setFile,
  fileResetRef,
  showSendOffer,
}: Props) => {
  // State
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Redux
  const user = useReduxSelector(selectUser);

  const handleSendOffer = () => {
    openModal({
      key: "sendOffer",
      title: "Send Offer",
      children: (
        <Suspense fallback={<LoadingOverlay visible />}>
          <CreateOffer
            project={project}
            onSuccess={(offer) => {
              socket.emit("sendProjectChatMessage", {
                userId: user?.id,
                projectId: project.id,
                projectTitle: project.title,
                message: `${user?.name} proposed a new offer with a total of $${offer.amount} and a delivery time of ${offer.deliveryInDays} days.`,
                user,
                type: "offer",
              });
            }}
          />
        </Suspense>
      ),
    });
  };

  return (
    <Menu opened={isMenuOpen} onChange={setIsMenuOpen} withArrow shadow="sm" position="right">
      <Menu.Target>
        <ActionIcon variant="filled" color="gray" radius="xl" size="lg">
          <IconPlus size={18} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {showSendOffer && (
          <Menu.Item
            icon={<IconCurrencyDollar size={18} />}
            color="green"
            onClick={handleSendOffer}
          >
            Send Offer
          </Menu.Item>
        )}
        <FileButton
          resetRef={fileResetRef}
          onChange={(file) => {
            setFile(file);
            setIsMenuOpen(false);
          }}
        >
          {(props) => (
            <Button leftIcon={<IconUpload size={18} />} variant="subtle" {...props}>
              Upload File
            </Button>
          )}
        </FileButton>
      </Menu.Dropdown>
    </Menu>
  );
};
