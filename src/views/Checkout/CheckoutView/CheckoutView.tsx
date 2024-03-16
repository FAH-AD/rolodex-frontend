// Routing
import { Link, useParams } from "react-router-dom";

import React, { useState, useEffect } from 'react';

// Services
import { useRegisterPaswordlessMutation } from "@services/authApi";
import { useGetCheckoutQuery } from "@services/checkoutApi";
import { skipToken } from "@reduxjs/toolkit/dist/query";

// Redux
import { useReduxSelector } from "@app/hook";
import { selectUser } from "@slices/authSlice";

// Mantine
import { Alert, Button, Flex, Space, Container, Grid, LoadingOverlay, Text, Image } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";

// Icons
import { IconAlertCircle } from "@tabler/icons";

// Components
import ContactInformation from "./ContactInformation";
import OrderReview from "./OrderReview";
import PaymentForm from "./PaymentForm";
import CheckoutSuccess from "./CheckoutSuccess";

// Validation
import { CheckoutFormValues, checkoutSchema } from "./checkoutValidation";

import { IconChevronRight } from '@tabler/icons';

const images: string[] = [
  'https://rolodex-dashboard.s3.amazonaws.com/review_1_checkout.png',
  'https://rolodex-dashboard.s3.amazonaws.com/review_2_checkout.png',
  'https://rolodex-dashboard.s3.amazonaws.com/review_3_checkout.png',
];

const ImageBox: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Flex style={{ display: 'flex', justifyContent: 'center'  }} >
      <Image src={images[currentImage]} alt={`Image ${currentImage + 1}`}/>
    </Flex>
  );
};

export const CheckoutView = () => {
  // Routing
  const { id } = useParams();

  // Queries
  const { data: checkout, isLoading, isFetching } = useGetCheckoutQuery(id ?? skipToken);

  // Mutations
  const [registerPaswordless, { isLoading: isRegistering }] = useRegisterPaswordlessMutation();

  // Redux
  const user = useReduxSelector(selectUser);

  // Form
  const form = useForm<CheckoutFormValues>({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
    validate: checkout?.userId ? undefined : zodResolver(checkoutSchema),
    validateInputOnChange: checkout?.userId ? false : true,
    validateInputOnBlur: checkout?.userId ? false : true,
  });

  const handleSubmit = async (values: CheckoutFormValues) => {
    try {
      await registerPaswordless(values).unwrap();
    } catch { }
  };

  if (isLoading || isFetching || isRegistering) {
    return <LoadingOverlay visible />;
  }

  if (!checkout) {
    return (
      <Container size="lg">
        <Alert icon={<IconAlertCircle />} color="red">
          Checkout not found
        </Alert>
        <Button component={Link} to="/dashboard/services" mt="md" variant="default">
          Go to home page
        </Button>
      </Container>
    );
  }

  if (
    checkout.status === "COMPLETED" ||
    checkout.status === "PAID" ||
    checkout.status === "WAITING_FOR_CAPTURE"
  ) {
    return <CheckoutSuccess />;
  }

  return (
    <Container size="xl" style={{ backgroundColor: 'white' }} p="md">
      <Flex align="center" style={{ backgroundColor: '#FCFCFC' }} p="md">
        <div style={{ color: '#7f8cff' }}>1. Place Order</div>
        <Space h="xl" ml="lg" />
        <IconChevronRight size={24} color="#7f8cff" />
        <Space h="xl" mr="lg" />
        <div style={{ color: '#7f8cff' }}>2. Chat with team to send access and requirements</div>
      </Flex>
      <br />

      <Grid gutter="lg">
        <Grid.Col lg={6}>
          <ContactInformation form={form} checkout={checkout} handleSubmit={handleSubmit} />
          <OrderReview checkout={checkout} />
        </Grid.Col>
        <Grid.Col lg={6}>
          <PaymentForm form={form} checkout={checkout} balance={checkout.user?.balance} />
          <Text my="lg" ml="sm"><strong>What Our Clients Say About Us</strong></Text>
          <ImageBox/>
        </Grid.Col>
      </Grid>

      <Grid gutter="lg" style={{ marginTop: '2rem' }}>
        <Grid.Col lg={4}>
          <Flex align="center" style={{ backgroundColor: '#FCFCFC' }}>
            <Text style={{ color: '#7f8cff', fontSize: '35px' }}><strong>1</strong></Text>
            <Text ml='md'>
              <div style={{ color: '#7f8cff', fontSize: '15px' }}>Place Order</div>
              <div>Our team will be instantly notified and available in chat.</div>
            </Text>
          </Flex>
        </Grid.Col>
        <Grid.Col lg={4}>
          <Flex align="center" style={{ backgroundColor: '#FCFCFC' }}>
            <Text style={{ color: '#7f8cff', fontSize: '35px' }}><strong>2</strong></Text>
            <Text ml='md'>
              <div style={{ color: '#7f8cff', fontSize: '15px' }}>Chat with Team</div>
              <div>Send requirements and access and get expert advice anytime through chat. Available on mobile and desktop.</div>
            </Text>
          </Flex>
        </Grid.Col>
        <Grid.Col lg={4}>
          <Flex align="center" style={{ backgroundColor: '#FCFCFC' }}>
            <Text style={{ color: '#7f8cff', fontSize: '35px' }}><strong>3</strong></Text>
            <Text ml='md'>
              <div style={{ color: '#7f8cff', fontSize: '15px' }}>Follow Tasks</div>
              <div>Get updates and collaborate to get the best outcome</div>
            </Text>
          </Flex>
        </Grid.Col>
      </Grid>
    </Container>
  );
};
