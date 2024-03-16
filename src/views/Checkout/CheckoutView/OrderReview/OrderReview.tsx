import React from "react";

// UI Components
import { Box, Card, Text, Group, Badge } from "@mantine/core";

// Interfaces
import { Checkout } from "@interfaces/checkout";

// Props
type OrderReviewProps = {
  checkout: Checkout;
};

export const OrderReview: React.FC<OrderReviewProps> = ({ checkout }) => {
  return (
    <Card p="xl" mt="md" style={{ background: 'linear-gradient(to bottom, #AAB2FD, #3E50FF)', color: 'white', borderRadius: '8px', borderWidth: '4px', borderColor: '#5969eb' }}>
      <div>
        <Text size="lg">Offer</Text>

        <Box mt="md">
          {checkout?.offer && (
            <Text>
              Offer made for project #ECOM{checkout.offer.projectId} with a budget of $
              {checkout.amount} and a delivery time of {checkout.offer.deliveryInDays} days.
            </Text>
          )}
          {checkout?.service && (
            <div>
              <Box mt="md">
                <Text size="lg">{checkout.service.title}</Text>
              </Box>
            </div>
          )}
        </Box>
      </div>
      <Box mt="lg">
        {checkout.service?.description && (
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-circle-check"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="green"
              fill="green"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path d="M9 12l2 2l4 -4" stroke="white" fill="none" />
            </svg>
            <span style={{ marginLeft: '8px' }}>{checkout.service?.description}</span>
          </Box>
        )}
      </Box>
    </Card>
  );
};
