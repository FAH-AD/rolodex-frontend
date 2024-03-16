import React, { useState, useCallback } from "react";
import {
  Paper,
  Button,
  Text,
  FileButton,
  LoadingOverlay,
  Avatar,
  Input,
  Grid,
  Col,
  Card,
  Image,
  Group,
  Skeleton,
} from "@mantine/core";
import { IconUpload } from "@tabler/icons";
import { Checkbox, createStyles } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconX, IconCircleCheck } from "@tabler/icons";
import useUploadFileToS3 from "@hooks/aws/useUploadFileToS3";
import "./CreateVisualCollab.css";
import {
  useAddVisualCollabMutation,
  useGetAllCollabsQuery,
} from "@services/visualCollabApi";

// Styles
const useStyles = createStyles((theme) => ({
  rootTitle: {
    color: theme.colorScheme === "dark" ? theme.colors.gray[4] : theme.black,
  },
  button: {
    backgroundColor:
      theme.colorScheme === "light"
        ? theme.colors.gray[1]
        : theme.colors.gray[8],
  },
  paper: {
    backgroundColor:
      theme.colorScheme === "light" ? theme.colors.white : theme.colors.gray[9],
  },
}));

const UpdateInfo = React.lazy(() =>
  import("@components/VisualCollab/UpdateInfo").then((module) => ({
    default: module.UpdateInfo,
  }))
);

type Props = {
  projectId: number;
};
export const CreateVisualCollab = ({ projectId }: Props) => {
  const { classes } = useStyles();
  const [image, setImage] = useState<File | null>(null);

  const { uploadFileToS3, isLoading: isUploadingToS3 } = useUploadFileToS3();
  const [addVisualCollab] = useAddVisualCollabMutation();

  const [isLoading, setLoading] = useState(false);
  const [collabType, setCollabType] = useState<boolean>(true);
  const [userWebUrl, setWebUrl] = useState<string | null>(null);
  const { data: visualCollab, isLoading: isLoadingCollabs } =
    useGetAllCollabsQuery({ projectId });

  const updateWebUrl = (event: any) => {
    setWebUrl(event.currentTarget.value);
  };

  const onImageUpload = useCallback(async (image: File) => {
    const imageUrl = await uploadFileToS3(image, image.type, {
      maxSize: 10 * 1024 * 1024,
    });
    return imageUrl.s3URL;
  }, []);

  const createCollab = async () => {
    setLoading(true);
    let imageLink: string = "";
    var collabParams: {
      imageLink?: string | null;
      isUrl?: Boolean;
      webUrl?: string | null;
      projectId?: number;
    } = {};
    collabParams.isUrl = true;

    if (userWebUrl && userWebUrl.length > 5) {
      collabParams.isUrl = true;
      collabParams.webUrl = userWebUrl;
      collabParams.imageLink = null;
    } else {
      collabParams.isUrl = false;
      collabParams.webUrl = null;

      if (!image) {
        showNotification({
          title: "Error",
          message: "No URL entered",
          color: "red",
          icon: <IconX />,
        });
        return;
      }
      imageLink = await onImageUpload(image);
      collabParams.imageLink = imageLink;
    }

    if (collabType === true) {
      collabParams.projectId = projectId;
      if (!projectId) {
        showNotification({
          title: "Warning",
          message: "This collab will not be associated with any project",
          color: "yellow",
          icon: <IconCircleCheck />,
        });
      }
    }
    addVisualCollab(collabParams)
      .then((collabData) => {
        if ("data" in collabData) {
          const collabId = collabData.data.collab.id;
          window.location.href = `/dashboard/visualcollab/${collabId}`;
        } else {
          showNotification({
            title: "Error",
            message: "Could not create new collab",
            color: "red",
            icon: <IconX />,
          });
        }
      })
      .catch((error) => {
        showNotification({
          title: "Error",
          message: "Could not create new collab",
          color: "red",
          icon: <IconX />,
        });
      });
  };

  if (isLoadingCollabs) {
    return <Skeleton mt="sm" height={100} />;
  }

  return (
    <>
      <div>
        <Paper p="sm" className={classes.paper}>
          <LoadingOverlay visible={isLoading || isUploadingToS3} />
          <Grid>
            <Col sm={8} md={6} lg={3}>
              <FileButton onChange={setImage} accept="image/*">
                {(props) => (
                  <Button
                    className={classes.button}
                    {...props}
                    leftIcon={<IconUpload size={18} />}
                    variant="subtle"
                    style={{
                      borderRadius: "5px",
                    }}
                  >
                    Upload an Image
                  </Button>
                )}
              </FileButton>
              {image && (
                <Text size="sm" align="center">
                  {image.name}
                </Text>
              )}
            </Col>

            <Col sm={8} md={6} lg={3}>
              <Input
                placeholder="Enter Project URL"
                size="sm"
                onChange={updateWebUrl}
                style={{
                  borderRadius: "5px",
                  fontSize: "12px",
                }}
              />
            </Col>

            <Col sm={8} md={6} lg={3}>
              <Checkbox
                label="Link Collab with project"
                checked={collabType}
                onChange={() => setCollabType(!collabType)}
                style={{
                  fontFamily: "Poppins, sans-serif",
                }}
              ></Checkbox>
            </Col>

            <Col sm={8} md={6} lg={3}>
              <Button
                variant="light"
                onClick={createCollab}
                size="lg"
                style={{
                  backgroundColor: "#2371BD",
                  color: "white",
                  borderRadius: "5px",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Start VisualCollab
              </Button>
            </Col>
          </Grid>
        </Paper>
      </div>

      {/* -----------------product-------------------- */}

      <div className={classes.rootTitle}>
        <h3
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "25px",
            fontWeight: "bold",
            width: "241px",
            height: "39px",
            marginLeft: "1rem",
          }}
        >
          Recent Projects
        </h3>
      </div>

      {/* ---------------------------CARD--------------------------- */}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "30px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {visualCollab.recentCollabs.map((collab: any, index: number) => {
          let website = null;
          if (collab.webLink) {
            website = collab.webLink.replace(/^(https?:\/\/)?/, "");
            website = website.split("/")[0];
            website = website.split(":")[0];
          }

          return (
            <a
              href={"/dashboard/visualcollab/" + collab.id}
              style={{ textDecoration: "none" }}
            >
              <Card
                shadow="sm"
                radius="md"
                withBorder
                style={{
                  padding: "28px",
                  boxShadow: "0 3px 3px 3px rgba(0, 0, 0, 0.1)",
                }}
                key={index}
              >
                <Card.Section>
                  <Image
                    src="https://plus.unsplash.com/premium_photo-1670760617807-4117317a33fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80"
                    style={{
                      borderRadius: "15px",
                    }}
                    alt="Norway"
                  />
                </Card.Section>

                <Group position="apart" mt="md" mb="xs">
                  <Text>{website}</Text>
                </Group>

                <Text
                  size="sm"
                  color="dimmed"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "12px",
                    lineHeight: "20px",
                    fontWeight: 400,
                  }}
                >
                  {collab.title}
                </Text>

                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <Avatar
                    color="#D9D9D9"
                    src={collab.createdByUser.image}
                    radius="xl"
                    style={{
                      width: "35px",
                      height: "35px",
                      marginTop: "12px",
                    }}
                  ></Avatar>
                  <UpdateInfo
                    updatedAt={collab.updatedAt}
                    updatedBy={collab.updatedByUser.name}
                  />
                  <div
                    style={{
                      display: "flex",
                      marginLeft: "15px",
                    }}
                  >
                    <img
                      src="https://rolodex-dashboard.s3.amazonaws.com/Vector.png"
                      style={{
                        height: "13px",
                        width: "16.95px",
                        marginTop: "25px",
                        marginRight: "5px",
                      }}
                      alt="Description of the image"
                    />
                    <Text
                      style={{
                        marginTop: "20px",
                        marginLeft: "2px",
                        height: "20px",
                        width: "31px",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "13px",
                        fontWeight: "400",
                      }}
                    >
                      {collab.doneSuggestions + "/" + collab.totalSuggestions}
                    </Text>
                  </div>
                </div>
              </Card>
            </a>
          );
        })}
      </div>
    </>
  );
};
