import React from 'react';
import {
    Text,
} from "@mantine/core";

export const UpdateInfo: React.FC<{ updatedAt: string, updatedBy: string }> = ({ updatedAt, updatedBy }) => {
    const targetDateTime = new Date(updatedAt);
    const currentTime = new Date();
    const timeDifferenceMs = currentTime.getTime() - targetDateTime.getTime();
    const hoursDifference = Math.floor(timeDifferenceMs / (1000 * 60 * 60));
    
    return (
        <>
            <Text size="sm" color="dimmed" style={{
                 fontFamily: "Poppins, sans-serif",
                 fontSize: "9px",
                 fontWeight: 400,
                 margin: "23px 0px 0px 8px",
                 lineHeight: "0px",
            }}>
                Last Update {hoursDifference <= 0 ? " less than hour" : hoursDifference + " hours"} ago by
                <p>@{updatedBy}</p>
            </Text>
        </>
    );
};
