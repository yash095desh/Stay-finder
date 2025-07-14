"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { motion } from "motion/react";

const GallerySection = () => {
  return (
    <section className=" w-full my-20">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        viewport={{ once: true }}
        className="flex justify-center"
      >
        <div className="group relative inline-block overflow-hidden rounded-md mb-3">
          <span className="absolute inset-0 w-0 bg-blue-500 transition-all duration-500 ease-in-out group-hover:w-full"></span>
          <Badge
            className="relative z-10 border-blue-500 text-blue-500 group-hover:text-white transition-colors duration-300 px-4 py-2"
            variant="outline"
          >
            Gallery
          </Badge>
        </div>
      </motion.div>
      <div className=" flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          viewport={{ once: true }}
          className="text-xl font-bold tracking-tighter text-center md:text-start"
        >
          Explore the Beauty
          <br className="hidden md:block" />
          of Our Stays Through the Gallery
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          viewport={{ once: true }}
          className="font-medium text-muted-foreground mb-6 text-center md:text-end"
        >
          Take a closer look at the charm,
          <br className="hidden md:block" />
          comfort, and character of our properties. Each photo captures the
          unique experiences waiting for you.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 h-full"
      >
        {/* Left Big Image */}
        <div className="overflow-hidden rounded-xl group h-full">
          <Image
            src="/galleryImages1.jpg"
            alt="gallery-img-1"
            width={600}
            height={600}
            className="w-full h-full object-cover aspect-[4/5] rounded-xl transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
        </div>

        {/* Right Two Stacked Images */}
        <div className="grid grid-cols-1 gap-4 h-full">
          <div className="overflow-hidden rounded-xl group h-full">
            <Image
              src="/galleryImages2.jpg"
              alt="gallery-img-2"
              width={400}
              height={300}
              className="w-full h-full object-cover aspect-[6/5] rounded-xl transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
          </div>
          <div className="overflow-hidden rounded-xl group h-full">
            <Image
              src="/galleryImages3.jpg"
              alt="gallery-img-3"
              width={400}
              height={300}
              className="w-full h-full object-cover aspect-[6/5] rounded-xl transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
          </div>
        </div>

        {/* Bottom Wide Image */}
        <div className="col-span-2 md:col-span-1 overflow-hidden rounded-xl group h-full">
          <Image
            src="/galleryImages4.jpg"
            alt="gallery-img-4"
            width={800}
            height={300}
            className="w-full h-full object-cover aspect-[8/3] rounded-xl transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default GallerySection;
