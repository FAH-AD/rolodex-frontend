import React from "react";
import { Paper } from "@mantine/core";

interface BulletPointProps {
  color: string;
}

function BulletPoint({ color }: BulletPointProps) {
  return (
    <Paper
      style={{
        margin: 5,
        backgroundColor: color, // Use color directly, don't wrap in curly braces
        borderRadius: "50%", // Makes the div round
        width: 10, // Adjust width as needed
        height: 10, // Adjust height as needed
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white", // Text color
        fontWeight: "bold",
        fontSize: 20,
      }}
    />
  );
}

export default BulletPoint;
