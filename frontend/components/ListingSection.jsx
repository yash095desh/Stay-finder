"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import ListingCard from "./ListingCard";
import { motion } from "motion/react";

const ListingSection = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const getListing = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/listing/search`
      );
      const listings = res?.data?.listings?.slice(0, 5) || [];
      setListings(listings);
    };
    getListing();
  }, []);

  return (
    <>
      {listings?.length > 0 && (
        <motion.section
          initial={{ opacity: 0 , y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className=" w-full my-20 px-5 md:px-0"
        >
          <div className="flex justify-center">
            <div className="group relative inline-block overflow-hidden rounded-md mb-3">
              <span className="absolute inset-0 w-0 bg-blue-500 transition-all duration-500 ease-in-out group-hover:w-full"></span>
              <Badge
                className="relative z-10 border-blue-500 text-blue-500 group-hover:text-white transition-colors duration-300 px-4 py-2"
                variant="outline"
              >
                Our Rooms
              </Badge>
            </div>
          </div>

          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.8,
            }}
            viewport={{ once: true }}
            className=" text-xl font-bold tracking-tighter text-center md:text-start"
          >
            Featured Stays Just for You
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.8,
            }}
            viewport={{ once: true }}
            className="font-medium text-muted-foreground mb-6 text-center md:text-start"
          >
            Discover popular properties handpicked for comfort, style, and
            unforgettable experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay:0.8 }}
            viewport={{ once: true }}
          >
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent className="py-3">
                {listings?.map((item) => (
                  <CarouselItem
                    key={item?._id}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="">
                      <ListingCard data={item} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </motion.div>
        </motion.section>
      )}
    </>
  );
};

export default ListingSection;
