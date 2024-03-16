import React, { useState } from "react";

// Services
import { useGetEcommerceChecklistsQuery } from "@services/ecommerceChecklistApi";

// UI Components
import { Alert, Chip, Grid, Loader } from "@mantine/core";

// Components
import { EcommerceChecklistCollapsible } from "./EcommerceChecklistCollapsible";

// Icons
import { IconInfoCircle } from "@tabler/icons";

// Data
import { categories } from "../../categories";

export const ListEcommerceChecklistsResult = () => {
  // State
  const [category, setCategory] = useState("All");

  // Queries
  const { data: checklists, isLoading } = useGetEcommerceChecklistsQuery({ category });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <Chip.Group multiple={false} value={category} onChange={setCategory}>
        <Chip value="All">All</Chip>
        {categories.map((category, i) => (
          <Chip value={category} key={i}>
            {category}
          </Chip>
        ))}
      </Chip.Group>
      {checklists && checklists.length === 0 ? (
        <Alert color="cyan" mt="md" icon={<IconInfoCircle />}>
          No checklists found
        </Alert>
      ) : null}
      {checklists && checklists.length > 0 ? (
        <Grid mt="sm">
          {checklists.map((checklist, i) => (
            <Grid.Col sm={2} lg={4} key={i}>
              <EcommerceChecklistCollapsible checklist={checklist} />
            </Grid.Col>
          ))}
        </Grid>
      ) : null}
    </div>
  );
};
