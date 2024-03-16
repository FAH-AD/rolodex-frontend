import React from "react";
export const DateTimeformat: React.FC<{ dateTime: string }> = ({
  dateTime,
}) => {

  const getElapsedTime = (dateTime: string) => {
    const currentTime = new Date();
    const updatedTime = new Date(dateTime);
    const timeDifference = currentTime.getTime() - updatedTime.getTime();
    const elapsedMinutes = timeDifference / (1000 * 60);
    return elapsedMinutes;
  };

  let elapsedMinutes = getElapsedTime(dateTime);
  let formattedElapsedTime;
  if (elapsedMinutes >= 60) {
    const elapsedHours = Math.round(elapsedMinutes / 60);
    const remainingMinutes = Math.round(elapsedMinutes % 60);
    formattedElapsedTime = `${elapsedHours}h${elapsedHours === 1 ? "" : ""} ${
      remainingMinutes === 0
        ? ""
        : `${remainingMinutes} min${remainingMinutes === 1 ? "" : ""}`
    } ago`;
  } else {
    formattedElapsedTime = Math.round(elapsedMinutes) + ` min${
      elapsedMinutes === 1 ? "" : ""
    } ago`;
  }

  return <div>{formattedElapsedTime}</div>;
};
