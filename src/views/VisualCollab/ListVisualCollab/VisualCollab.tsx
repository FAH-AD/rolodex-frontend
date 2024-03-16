import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { IconCircleCheck, IconX } from "@tabler/icons";
import { AiOutlineSearch } from "react-icons/ai";
import { MdFiberManualRecord } from "react-icons/md";
import { SuggestionBox } from "@views/VisualCollab/ListVisualCollab/SuggestionBox";
import EditableText from "@views/VisualCollab/ListVisualCollab/EditableName";
import { IconUpload } from "@tabler/icons";
import { selectIsAuthenticated } from "@slices/authSlice";
import { useReduxSelector } from "@app/hook";
import useUploadFileToS3 from "@hooks/aws/useUploadFileToS3";
import { useRefreshVisualCollabMutation } from "@services/visualCollabApi";

import {
  Text,
  Paper,
  Grid,
  FileButton,
  ActionIcon,
  LoadingOverlay,
  Textarea,
  Menu,
  Button,
  Input,
  Divider,
  createStyles,
  Modal,
} from "@mantine/core";

import { useDisclosure } from '@mantine/hooks';

const useStyles = createStyles((theme) => ({
  font: {
    color: theme.colorScheme === "dark" ? theme.colors.gray[4] : theme.black,
  },
  rootTitle: {
    color: theme.colorScheme === "dark" ? theme.colors.gray[4] : theme.black,
  },
  search: {
    backgroundColor:
      theme.colorScheme === "light" ? theme.colors.white : theme.white,
  },
}));

import { showNotification } from "@mantine/notifications";
import {
  useGetVisualCollabQuery,
  useAddSuggestionMutation,
  useDeleteVisualCollabMutation
} from "@services/visualCollabApi";

const NumIcon = React.lazy(() =>
  import("@components/VisualCollab/NumIcon").then((module) => ({
    default: module.NumIcon,
  }))
);

const DateTimeformat = React.lazy(() =>
  import("@views/VisualCollab/ListVisualCollab/DateTimeformat").then(
    (module) => ({
      default: module.DateTimeformat,
    })
  )
);

export const VisualCollab = () => {
  const { classes } = useStyles();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const pageUrl = window.location.href;

  const [image, setImage] = useState<File | null>(null);
  const [userWebUrl, setWebUrl] = useState<string | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const [inputValue, setInputValue] = useState("");
  const [inputVisible, setInputVisible] = useState(false);
  const [inputPer, setInputPer] = useState({ x: 0, y: 0 });
  const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 });

  const { uploadFileToS3, isLoading: isUploadingToS3 } = useUploadFileToS3();
  const [refreshVisualCollab] = useRefreshVisualCollabMutation();

  const onImageUpload = useCallback(async (image: File) => {
    const imageUrl = await uploadFileToS3(image, image.type, {
      maxSize: 10 * 1024 * 1024,
    });
    return imageUrl.s3URL;
  }, []);

  const isAuthenticated = useReduxSelector(selectIsAuthenticated);

  const queryParams = new URLSearchParams(location.search);
  let selectedBtn = queryParams.get("filter");
  let search = queryParams.get("search");
  if (!selectedBtn) {
    selectedBtn = "all";
  }

  if (!search) {
    search = "";
  }

  const id = Number(params.id);
  if (isNaN(id)) {
    return (
      <Paper px="sm" py="sm">
        <Text>Requested Visual Collab does not exist</Text>
      </Paper>
    );
  }

  type buttonVariants =
    | "default"
    | "outline"
    | "gradient"
    | "filled"
    | "light"
    | "white"
    | "subtle";

  let btnVariants: { [key: string]: buttonVariants } = {
    all: "filled",
    in_review: "outline",
    to_do: "outline",
    done: "outline",
  };

  for (const key in btnVariants) {
    btnVariants[key] = "outline";
  }
  btnVariants[selectedBtn] = "filled";

  const {
    data: visualCollab,
    isLoading,
    isFetching,
    refetch: visualCollabRefetch,
  } = useGetVisualCollabQuery({ id, selectedBtn, search });

  const [deleteCollab, { isLoading: isDeleting }] =
    useDeleteVisualCollabMutation();

  const [addSuggestion] = useAddSuggestionMutation();

  // ----------------InputActiveButton------------------
  const [activeButton, setActiveButton] = useState("");
  const handleClick = (buttonVal: string) => {
    setActiveButton(buttonVal);
    queryParams.set("filter", buttonVal);
    navigate({ search: queryParams.toString() });
    return visualCollabRefetch();
  };

  // ------------------SEARCH BUTTON---------------------
  const [searchValue, setSearchValue] = useState("");
  const [editTitle, setEditStatus] = useState(false);
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const searchParam = queryParams.get("search");
    if (searchParam) {
      setSearchValue(searchParam);
    }
  }, []);
  const handleInputChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.currentTarget.value);
  };

  const handleClick2 = () => {
    if (searchValue.trim() !== "") {
      queryParams.set("search", searchValue);
      navigate({ search: queryParams.toString() });
      return visualCollabRefetch();
    }
  };

  // ---------------------------------------------------
  const handleImageClick = (event: any) => {
    setInputVisible(true);
    const rect = event.target.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const imageWidth = event.target.offsetWidth;
    const imageHeight = event.target.offsetHeight;

    const xPer = ((event.clientX - rect.left) / imageWidth) * 100;
    const yPer = ((event.clientY - rect.top) / imageHeight) * 100;

    setInputPosition({ x, y });
    setInputPer({ x: xPer, y: yPer });
  };

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const updateWebUrl = (event: any) => {
    setWebUrl(event.currentTarget.value);
  };

  const processRefreshCollab = async () => {
    const isWebLink = visualCollab?.visualCollab?.webLink ? true : false;

    let imageLink: string = "";
    var collabParams: {
      imageLink?: string | null;
      isWebLink?: Boolean;
      webUrl?: string | null;
      collabId?: number;
    } = {};

    collabParams.isWebLink = isWebLink;
    collabParams.collabId = id;

    if (isWebLink) {
      collabParams.webUrl = userWebUrl;
      collabParams.imageLink = null;
    } else {
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

    refreshVisualCollab(collabParams)
      .then((collabData) => {
        window.location.reload();
      })
      .catch((error) => {
        showNotification({
          title: "Error",
          message: "Could not update collab",
          color: "red",
          icon: <IconX />,
        });
      });
  }

  const postSuggestion = () => {
    if (inputValue.length < 1) {
      showNotification({
        title: "Note",
        message: "Suggestion can't be empty",
        color: "yellow",
        icon: <IconCircleCheck />,
      });
      return;
    }

    addSuggestion({
      collabId: id,
      suggestion: inputValue,
      horizontalPos: Math.round(inputPer.x),
      verticalPos: Math.round(inputPer.y),
    })
      .then(() => {
        showNotification({
          title: "Success",
          message: "Suggestion added successfully",
          color: "green",
          icon: <IconCircleCheck />,
        });
        setInputVisible(false);
        setInputValue("");
        return visualCollabRefetch();
      })
      .catch(() => {
        showNotification({
          title: "Error",
          message: "Failed to add suggestion",
          color: "red",
          icon: <IconX />,
        });
        return;
      });
  };

  const handleKeyDown = (event: any) => {
    if (event.ctrlKey && event.keyCode == 13) {
      postSuggestion();
    }
  };

  if (isLoading || isFetching) {
    return <LoadingOverlay visible={isLoading || isFetching} />;
  }

  if (visualCollab?.visualCollab === null) {
    return (
      <Paper px="sm" py="sm">
        <Text>Requested Visual Collab does not exist</Text>
      </Paper>
    );
  }

  const imageLink = visualCollab?.visualCollab?.imageLink;
  const suggestions: any = visualCollab?.visualCollab?.suggestions;

  const themeColor = {
    backgroundColor: "#1BEDCD",
    color: "#000000",
  };

  // ------------------------COPY URL---------------------------

  const handleCopyClick = () => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      showNotification({
        title: "Success",
        message: "Link copied to clip board",
        color: "green",
        icon: <IconCircleCheck />,
      });
    });
  };

  const handleDeleteClick = () => {
    deleteCollab({ id }).then(() => {
      showNotification({
        title: "Note",
        message: "Collab deleted",
        color: "green",
        icon: <IconCircleCheck />,
      });
      window.location.href = "/dashboard/projects/" + visualCollab?.visualCollab?.projectId;
    });
  }

  const handleEditTitle = () => {
    setEditStatus(!editTitle);
  };

  const collabUrl = window.location.href;
  // ------------------------------------------------------------------------------------------------------------------
  return (
    <Paper p="md">
      {/* ----------------- PROJECT TITLE PART----------------- */}
      <a
        href={"/dashboard/projects/" + visualCollab?.visualCollab?.projectId}
        style={{
          color: "#5963C1",
          width: "482px",
          height: "30px",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 300,
          fontSize: "1.25rem",
          lineHeight: 1.875,
          marginTop: "30px",
        }}
      >
        {`Dashboard/ Projects / #ECOM${visualCollab?.visualCollab?.projectId}/ VisualCollab`}
      </a>
      <Grid mt="md">
        <Grid.Col sm={8} md={6} lg={5} className={classes.rootTitle}>
          <EditableText initialValue={visualCollab?.visualCollab?.title ? visualCollab?.visualCollab?.title : "Collab Title"} id={visualCollab?.visualCollab?.id} editStatus={editTitle} setEditStatus={setEditStatus}></EditableText>
        </Grid.Col>

        {/* -------------------------REFRESH COLLAB BUTTON------------------------- */}

        <Grid.Col sm={8} md={6} lg={3}>
          <Button
            variant="filled"
            size="sm"
            onClick={open}
            style={{
              height: "50px",
              borderRadius: "5px",
              lineHeight: 2.344,
              backgroundColor: "#2371BD",
            }}
          >
            <Text
              style={{
                height: "15px",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "1rem",
                lineHeight: 0.938,
                padding: "0px 8px 0px 0px",
              }}
            >
              Refresh Collab
            </Text>

            <img
              src="https://img.icons8.com/ios-filled/50/FFFFFF/update-left-rotation.png"
              alt="update-left-rotation"
              style={{ width: "22.49px", height: "24.38px" }}
            />
          </Button>

          <Modal opened={opened} onClose={close} title="Refresh Collab">
            <Paper>
              {!visualCollab?.visualCollab?.webLink ? (
                <>
                  <FileButton onChange={setImage} accept="image/*">
                    {(props) => (
                      <Button
                        {...props}
                        leftIcon={
                          <IconUpload
                            size={18}
                          />
                        }
                        variant="subtle"
                        style={{
                          borderRadius: "5px",
                        }}
                      >
                        Upload Image
                      </Button>
                    )}
                  </FileButton>
                  {image && (
                    <Text size="sm" align="center">
                      {image.name}
                    </Text>
                  )}
                  <Button
                    variant="light"
                    onClick={processRefreshCollab}
                    size="sm"
                    m="md"
                    style={{
                      backgroundColor: "#2371BD",
                      color: "white",
                      borderRadius: "5px",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Update Collab
                  </Button>
                </>
              ) :
                (
                  <>
                    <Input
                      placeholder="Enter URL"
                      size="sm"
                      onChange={updateWebUrl}
                      style={{
                        borderRadius: "5px",
                        fontSize: "12px",
                      }}
                    />
                    <Button
                      variant="light"
                      onClick={processRefreshCollab}
                      size="sm"
                      mt="sm"
                      style={{
                        backgroundColor: "#2371BD",
                        color: "white",
                        borderRadius: "5px",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      Update Collab
                    </Button>
                  </>
                )}
            </Paper>
          </Modal>

          <Menu
            shadow="lg"
            radius={6}
            width={111}
            position="top"
            offset={10}
            withArrow
          >
            <Menu.Target>
              <Button
                variant="subtle"
                size="xl"
                compact
                style={{
                  color: "#6F767E",
                  fontWeight: 1000,
                  fontSize: "30px",
                  padding: "0px 7px 16px 8px",
                }}
              >
                <Text className={classes.rootTitle}>...</Text>
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                className={classes.rootTitle}
                onClick={handleEditTitle}
                style={{
                  fontSize: "12px",
                  width: "110.93px",
                  height: "11.86px",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  lineHeight: "15px",
                }}
              >
                Edit Title
              </Menu.Item>

              <Menu.Divider />
              <Menu.Item
                className={classes.rootTitle}
                onClick={handleCopyClick}
                style={{
                  fontSize: "12px",
                  width: "110.93px",
                  height: "11.86px",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  lineHeight: "15px",
                }}
              >
                Share
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                className={classes.rootTitle}
                onClick={handleDeleteClick}
                style={{
                  fontSize: "12px",
                  width: "110.93px",
                  height: "11.86px",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  lineHeight: "15px",
                }}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Grid.Col>

        {/* ----------------------Comments Title---------------------- */}
        <Grid.Col sm={8} md={6} lg={4} className={classes.rootTitle}>
          <Text
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontSize: "1.563rem",
            }}
          >
            Comments
          </Text>
          <Text
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontSize: "0.75rem",
              display: "flex",
            }}
          >
            Last Update:&nbsp;
            <DateTimeformat dateTime={visualCollab.visualCollab.updatedAt} />
          </Text>
        </Grid.Col>
      </Grid>

      {/* ---------------------------------------IMAGE-------------------------------------------------------------- */}
      <Divider my="sm"></Divider>
      <LoadingOverlay visible={isLoading || isFetching} />
      <Grid p="md">
        <Grid.Col xs={12} sm={12} md={12} lg={8}>
          <div style={{ position: "relative" }}>
            <img
              src={imageLink}
              alt="Image to evaluate"
              onClick={handleImageClick}
              style={{ width: "100%" }}
            />

            {/* ------------------------------------Add new Comment----------------------------------------- */}

            {suggestions.map((suggestion: any, index: number) => {
              return (
                <div
                  style={{
                    position: "absolute",
                    top: `${suggestion.verticalPos}%`,
                    left: `${suggestion.horizontalPos}%`,
                  }}
                  key={suggestion.id}
                >
                  <ActionIcon
                    variant="subtle"
                    title={suggestion.suggestion}
                    color="red"
                  >
                    <NumIcon number={suggestion.suggestionId} />
                  </ActionIcon>
                </div>
              );
            })}

            {inputVisible && (
              <div
                style={{
                  position: "absolute",
                  left: `${inputPosition.x}px`,
                  top: `${inputPosition.y}px`,
                  zIndex: 1,
                }}
              >
                <div style={{ display: "flex" }}>
                  <Textarea
                    placeholder="Start typing a comment or suggestion"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    style={{ width: "300px" }}
                    autosize
                    minRows={2}
                  />
                  <Button onClick={postSuggestion} style={themeColor}>
                    Add
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Grid.Col>
        <LoadingOverlay visible={isLoading || isFetching} />
        <Grid.Col xs={12} sm={12} md={12} lg={4} p="xs">
          {suggestions.length <= 0 && selectedBtn == "all" ? (
            <Paper>
              <Paper px="md" py="md" my="md" style={themeColor}>
                Click anywhere on left side to give comments and suggestions.
              </Paper>
              <Paper px="md" py="md" style={themeColor}>
                You can also use Ctrl+Enter to post suggestion
              </Paper>
            </Paper>
          ) : (
            <Grid.Col span={12}>
              <Paper>
                {/* --------------------SEARCH------------------- */}
                <Paper
                  className={classes.search}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    borderRadius: "10px",
                  }}
                  mb="md"
                  p="sm"
                >
                  <Grid>
                    <Grid.Col span={8} sm={10} md={9} lg={8}>
                      <Input
                        value={searchValue}
                        onChange={handleInputChange2}
                        placeholder="Search"
                        variant="unstyled"
                        style={{
                          border: "0px solid #d9d9d9",
                          borderRadius: "4px",
                          fontFamily: "Poppins, sans-serif",
                          color: "#6F767E",
                          width: "100px",
                        }}
                      />
                    </Grid.Col>

                    <Grid.Col span={2} sm={6} md={4} lg={2}>
                      <Button
                        onClick={handleClick2}
                        variant="subtle"
                        size="sm"
                        style={{
                          backgroundColor: "transparent",
                          padding: 0,
                          width: "30px",
                          height: "30px",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <AiOutlineSearch
                            style={{
                              width: "100%",
                              height: "100%",
                              fontFamily: "Poppins, sans-serif",
                              color: "#6F767E",
                            }}
                          />
                        </div>
                      </Button>
                    </Grid.Col>
                    <div
                      style={{
                        display: "flex",
                        margin: "10px 2px 0px 5px",
                        height: "30px",
                      }}
                    >
                      <Divider size="xs" orientation="vertical" />
                    </div>
                    <Grid.Col span={1} sm={5} md={3} lg={1}>
                      <Menu
                        shadow="lg"
                        radius={6}
                        width={111}
                        offset={10}
                        withArrow
                        position="top"
                        arrowPosition="center"
                      >
                        <Menu.Target>
                          <Button
                            variant="default"
                            color="gray"
                            mr="xl"
                            p="xs"
                            style={{
                              height: "32px",
                              width: "32px",
                              borderRadius: "200px",
                              fontSize: "14px",
                              fontWeight: 1000,
                              position: "relative",
                            }}
                          >
                            {["to_do", "done", "in_review"].includes(
                              activeButton
                            ) && (
                                <ActionIcon
                                  style={{
                                    position: "absolute",
                                    backgroundColor: "transparent",
                                    transform: "translate(15%, -40%)",
                                  }}
                                >
                                  <MdFiberManualRecord
                                    style={{ fontSize: "16px", color: "red" }}
                                  />
                                </ActionIcon>
                              )}
                            ☰
                          </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            className={classes.rootTitle}
                            onClick={() => {
                              handleClick("all");
                            }}
                            key="all"
                            style={{
                              fontSize: "12px",
                              width: "110.93px",
                              height: "11.86px",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 500,
                              lineHeight: "15px",
                            }}
                          >
                            Date modified
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            className={classes.rootTitle}
                            onClick={() => {
                              handleClick("done");
                            }}
                            key="resolved"
                            style={{
                              fontSize: "12px",
                              width: "110.93px",
                              height: "11.86px",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 400,
                              lineHeight: "15px",
                            }}
                          >
                            Resolved
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            className={classes.rootTitle}
                            onClick={() => {
                              handleClick("to_do");
                            }}
                            key="to_do"
                            style={{
                              fontSize: "12px",
                              width: "110.93px",
                              height: "11.86px",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 400,
                              lineHeight: "15px",
                            }}
                          >
                            Unresolved
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            className={classes.rootTitle}
                            onClick={() => {
                              handleClick("in_review");
                            }}
                            key="in_review"
                            style={{
                              fontSize: "12px",
                              width: "110.93px",
                              height: "11.86px",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 400,
                              lineHeight: "15px",
                            }}
                          >
                            In Review
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Grid.Col>
                  </Grid>
                </Paper>

                {isAuthenticated &&
                  (suggestions.map((suggestion: any, index: number) => (
                    <SuggestionBox suggestion={suggestion} visualCollabRefetch={visualCollabRefetch} />
                  )))
                }

                {!isAuthenticated &&
                  <Paper>
                    {suggestions[0] && <SuggestionBox suggestion={suggestions[0]} visualCollabRefetch={visualCollabRefetch} key={0} />}
                    {suggestions[1] && <SuggestionBox suggestion={suggestions[1]} visualCollabRefetch={visualCollabRefetch} key={1} />}

                    <Paper style={{ position: "relative" }}>
                      {suggestions[1] && <div style={{ filter: "blur(5px)" }}><SuggestionBox suggestion={suggestions[2]} visualCollabRefetch={visualCollabRefetch} key={2} /></div>}

                      <Paper
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          zIndex: 20,
                        }}
                      >
                        <a href={`/?callback=${collabUrl}`}>
                          <Button m="md" style={{ backgroundColor: "#2371BD" }}>
                            Sign in to View
                          </Button>
                        </a>
                        <Text
                          mt="md"
                          mr="sm"
                          mb="md"
                          style={{
                            fontSize: "14px",
                          }}
                        >
                          Schedule a consultation with a shopify expert
                        </Text>
                        <a href="https://ecomrolodex.com/demo">
                          <Button ml="xl" variant="subtle" color="indigo">
                            Book now ➔
                          </Button>
                        </a>
                      </Paper>
                    </Paper>

                    {suggestions.slice(3).map((suggestion: any, index: number) => (
                      <Paper key={index} style={{ position: "relative", filter: "blur(5px)" }} >

                        <SuggestionBox suggestion={suggestion} visualCollabRefetch={visualCollabRefetch} />
                      </Paper>
                    ))}
                  </Paper>
                }
              </Paper>
            </Grid.Col>
          )}
        </Grid.Col>
      </Grid>
    </Paper>
  );
};
