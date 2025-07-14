"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  BrushCleaning,
  ClockFadingIcon,
  DoorOpen,
  LocateFixedIcon,
  Utensils,
  Wifi,
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      title: "Prime Locations",
      description:
        "Stay in vibrant neighborhoods close to landmarks, local dining, and transportation hubs.",
      icon: LocateFixedIcon,
    },
    {
      title: "Fully Equipped Kitchens",
      description:
        "Prepare meals anytime with access to high-quality kitchen appliances and utensils.",
      icon: Utensils,
    },
    {
      title: "High-Speed Wi-Fi",
      description:
        "Whether working remotely or streaming your favorite shows, stay connected seamlessly.",
      icon: Wifi,
    },
    {
      title: "Flexible Check-In & Check-Out",
      description:
        "Enjoy stress-free arrivals and departures with our flexible and contactless check-in options.",
      icon: DoorOpen,
    },
    {
      title: "Verified & Cleaned Homes",
      description:
        "Every property is thoroughly cleaned and verified for your safety and peace of mind.",
      icon: BrushCleaning,
    },
    {
      title: "24/7 Support",
      description:
        "Our support team is available around the clock to assist you with anything you need.",
      icon: ClockFadingIcon,
    },
  ];

  return (
    <motion.section
      className="w-full my-20 flex flex-col gap-2"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      {/* Badge */}
      <div className="flex justify-center">
        <div className="group relative inline-block overflow-hidden rounded-md mb-3">
          <span className="absolute inset-0 w-0 bg-blue-500 transition-all duration-500 ease-in-out group-hover:w-full"></span>
          <Badge
            className="relative z-10 border-blue-500 text-blue-500 group-hover:text-white transition-colors duration-300 px-4 py-2"
            variant="outline"
          >
            Features
          </Badge>
        </div>
      </div>

      {/* Heading and Description */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
          viewport={{ once: true }}
          className="text-xl font-bold tracking-tighter text-center md:text-start max-w-xl"
        >
          Why Guests Love
          <br className="hidden md:block" />
          Staying With Us
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
          viewport={{ once: true }}
          className="font-medium text-muted-foreground mb-6 text-center md:text-end max-w-2xl"
        >
          From curated amenities to thoughtful design,
          <br className="hidden md:block" />
          our stays offer comfort, convenience, and a true sense of home wherever you go.
        </motion.p>
      </div>

      {/* Feature Cards */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.8 + index * 0.15,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
            >
              <Card className="bg-blue-100">
                <CardContent className="flex items-center justify-center gap-2 flex-col text-center py-6">
                  <Icon className="size-5 text-blue-500 mb-4" />
                  <h2 className="text-lg font-bold tracking-tight">
                    {feature.title}
                  </h2>
                  <p className="text-sm tracking-tighter leading-snug">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default FeaturesSection;
