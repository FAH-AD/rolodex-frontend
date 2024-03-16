// Services
import { useGetAllTagsQuery } from "@services/tagApi";

// UI Components
import { Badge, Chip, Text } from "@mantine/core";

// Props
type Props = {
  value: string[];
  onChange: (value: string[]) => void;
};

export const Tags = ({ value, onChange }: Props) => {
  // Queries
  const { tags } = useGetAllTagsQuery(undefined, {
    selectFromResult: ({ data, ...rest }) => ({
      ...rest,
      tags: data?.tags || [],
    }),
  });

  if (!tags?.length) {
    return (
      <div>
        <Badge color="gray">No tags found</Badge>
      </div>
    );
  }

  return (
    <Chip.Group multiple={true} value={value} mt="xs" onChange={onChange}>
      {tags.map((tag, i) => (
        <Chip value={tag.id.toString()} key={i}>
          {tag.name}
        </Chip>
      ))}
    </Chip.Group>
  );
};
