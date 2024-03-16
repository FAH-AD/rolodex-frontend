import { useState } from "react";
import { Input, Button, Grid } from "@mantine/core";

const InputWithActiveButton = () => {
  const [isActive, setIsActive] = useState(false);

  const handleInputFocus = () => {
    setIsActive(true);
  };

  const handleInputBlur = () => {
    setIsActive(false);
  };

  return (
    <>
      <Grid>
        <Grid.Col span={10} >
          <Input
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Reply"
            radius="xl"
            style={{
              fontFamily: "Poppins, sans-serif",
            }}
          />
        </Grid.Col>

        <Grid.Col span={2}>
          <Button
          p="xs"
            color={isActive ? "blue" : "gray"}
            style={{
              borderRadius: "200px",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            ➜
          </Button>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default InputWithActiveButton;