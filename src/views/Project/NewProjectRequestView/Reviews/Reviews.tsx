import { useRef } from "react";

// Mantine
import { Avatar, Paper, Text, Title, Rating, Flex } from "@mantine/core";
import { Carousel } from "@mantine/carousel";

// Embla
import Autoplay from "embla-carousel-autoplay";

const reviews = [
  {
    id: 1,
    name: "Joachim Schjøtt",
    company: "Schjøtt Team",
    review: `Working with Nick and his team was an outstanding experience. They were attentive,
    responsive, and we were highly satisfied with the entire process. Their
    collaborative approach made it easy to cooperate, and they completed the job
    professionally and efficiently. Nick and his team's exceptional communication skills
    and professionalism ensured a smooth, stress-free experience. We are thrilled with
    the final product and would not hesitate to collaborate with them again in the
    future.`,
  },
  {
    id: 2,
    name: "Stefano Rosà",
    company: "FlipRoom",
    review: `I had a fantastic experience working with the agency, led by the talented Nick and his dedicated team. They took my website to a whole new level, elevating its design and ensuring top-notch optimization. Their marketing insights were invaluable, and I can't wait for future collaborations with Nick and his team. Highly recommended!`,
  },
  {
    id: 3,
    name: "Stephanie Rodriguez",
    company: "Shopify Store Owner",
    review: `I cannot say just how great of an experience that I had working with this team. I have tried getting help in the past to enhance my site and there was always something lacking, mostly on the communication side. Working with the team was different from the very start. Everything was described in perfect detail from the recommendations to enhance my site, the reasoning behind those recommendations, and I was also provided updates as work was underway.
    The transparency and knowledge of this team made it easy to quickly build my trust and I am thankful for that as I am in love with the enhancements to my site. Will for sure be partnering with again in the future.`,
  },
  {
    id: 4,
    name: "Arye Gros",
    company: "Arye Marketing",
    review: `Best team in the industry hand down!I had a fantastic experience working with Nick. He were attentive,responsive, and delivered a stunning website that exceeded myexpectations. His creativity and innovative approach set my website apartfrom the competition.Additionally, Nick was a pleasure to work with, demonstrating a positiveattitude and a willingness to collaborate throughout the entire process. Helistened carefully to my needs and preferences and provided expertguidance that helped me to make informed decisions. His professionalismand excellent communication skills made the entire experience stress-freeand enjoyable. I am thrilled with the final product and would not hesitate towork with him again in the future.`,
  },
  {
    id: 5,
    name: "Adrian Alonzo",
    company: "Shopify Store Owner",
    review: `Best Ecommerce Expert I have dealt with since begining my journey with my e-commerce site.I have worked with alot of people to get my store optimzed and no luck unitl I found them which was a very easy experience they knew what needed to be done from an expert ecommerce/marketing perspective to optimize my store as a brand. they were also very responsive and detailed with a checklist which I very much appreciate to know what has been done and reassure me what I paid for was quality work! Don't hesitate to hire if your are trying to get in to the ecomerce buisness they will not dissapoint. Thank you E-Commerce King`,
  },
];

export const Reviews = () => {
  const autoplay = useRef(Autoplay({ delay: 2000 }));

  return (
    <Paper
      p="lg"
      radius="lg"
      withBorder
      style={{
        height: "100%",
        background: `linear-gradient(317.01deg, #5963C1 1.38%, #00FFD0 183.5%)`,
      }}
    >
      <Title align="center" color="white">
        What Our Clients Say About Us
      </Title>
      <Text color="white" align="center" mt="md">
        Real-Life Experiences and Honest Opinions on EcomRolodex
      </Text>
      <Carousel
        withIndicators
        mt={64}
        slideSize="70%"
        pb={96}
        slideGap="md"
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
      >
        {reviews.map((review) => (
          <Carousel.Slide key={review.id}>
            <Flex gap={0} direction="column" align="center">
              <Avatar mt="sm" size="lg" radius="xl">
                {`${review.name[0]}${review.name[1]}`.toUpperCase()}
              </Avatar>
              <Text color="white" size="xl" weight={600}>
                {review.name}
              </Text>
              <Text color="white">{review.company}</Text>
              <Rating mt="sm" value={5} color="yellow" readOnly />
              <Text mt="xl" align="center" color="white">
                {review.review}
              </Text>
            </Flex>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Paper>
  );
};
