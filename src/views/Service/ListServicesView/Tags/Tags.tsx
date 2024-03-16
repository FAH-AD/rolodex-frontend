import React from "react";

// Services
import { useGetAllTagsQuery } from "@services/tagApi";

// UI Components
import { Chip } from "@mantine/core";

// Props
type TagsProps = {
  tag: string;
  onTagChange: (value: string) => void;
};

export const Tags: React.FC<TagsProps> = ({ tag, onTagChange }) => {
  // Queries
  const { data } = useGetAllTagsQuery();

  return (
    <Chip.Group multiple={false} value={tag} onChange={onTagChange}>
      <Chip value="all">All</Chip>
      {data?.tags.map((tag, i) => (
        <Chip value={tag.value} key={i}>
          {tag.name}
        </Chip>
      ))}
    </Chip.Group>
  );
};
