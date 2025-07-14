"use client";
import React from "react";
import SearchBox from "@/components/SearchBox";
import { motion } from "motion/react";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="my-10 md:my-20 flex flex-col-reverse gap-6 relative">
      <motion.div
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 60,
          damping: 15,
          duration: 0.8,
        }}
        className="md:absolute md:h-full w-full md:max-w-sm flex items-center md:justify-center md:right-6 z-10"
      >
        <SearchBox />
      </motion.div>
      <div className=" flex flex-col gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.2,
            }}
            viewport={{ once: true }}
            className=" text-2xl md:text-4xl font-extrabold tracking-tighter mb-2"
          >
            Experience the Best <br /> Stays Around the World
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.2,
            }}
            viewport={{ once: true }}
            className="text-muted-foreground font-medium tracking-tight"
          >
            Find comfort, convenience, and unforgettable memories
            <br />
            Book Unique Stays in Amazing Places Affordable. Comfortable. Just
            the way you like it
          </motion.p>
        </div>
        <div className="relative w-full h-80">
          <Image
            src="/LandingPageImage.jpg"
            alt="Homepage image"
            fill
            className="object-cover "
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
