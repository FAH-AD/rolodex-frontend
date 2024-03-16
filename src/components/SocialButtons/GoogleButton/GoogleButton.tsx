import { Button, ButtonProps } from "@mantine/core";

// Icons
import { GoogleIcon } from "./GoogleIcon";
import { HTMLProps } from "react";

export const GoogleButton = (props: ButtonProps & Omit<HTMLProps<HTMLButtonElement>, "ref">) => {
  return <Button leftIcon={<GoogleIcon />} variant="default" color="gray" {...props} />;
};
