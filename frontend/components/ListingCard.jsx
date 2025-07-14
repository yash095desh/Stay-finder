"use client"
import React from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Bath, BedDouble, Send, Wifi } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { motion } from "motion/react"


const ListingCard = ({ data }) => {
    const router = useRouter();
  return (
    <motion.div 
    whileHover={{ scale : 1.05}}
    transition={{ type: "spring", stiffness: 300, damping: 20}}
    className="w-full max-w-sm"
    >
    <Card className={" w-full drop-shadow-md cursor-pointer"} onClick={()=>{router.push(`/listing/${data?._id}`)}}>
      <CardContent className={" flex flex-col gap-2 flex-start"}>
        <div className="relative w-full h-40 rounded-xl overflow-hidden">
          <Image
            src={data.images[0]}
            alt="listing thumbnail"
            fill
            className="object-cover "
          />
        </div>
        <div>
          <h1 className="font-bold tracking-tighter text-xl truncate mt-4">
            {data.title}
          </h1>
          <p className="text-medium tracking-tighter">
            {data?.location.city} , {data?.location?.country}
          </p>
        </div>
        <div className="flex items-center justify-between ">
          <div className=" flex items-center gap-2 ">
            <BedDouble className=" size-4 text-muted-foreground" />
            <span className="text-muted-foreground font-semibold text-sm">
              2 Bed
            </span>
          </div>
          <div className=" flex items-center gap-2">
            <Bath className=" size-4 text-muted-foreground" />
            <span className="text-muted-foreground font-semibold text-sm">
              2 Bath
            </span>
          </div>
          <div className=" flex items-center gap-2">
            <Wifi className=" size-4 text-muted-foreground" />
            <span className="text-muted-foreground font-semibold text-sm">
              Free Wifi
            </span>
          </div>
        </div>
        <p className="text-sm text-tight tracking-tight text-foreground-muted line-clamp-4 my-2">
          {data.description}
        </p>
        
      </CardContent>
    </Card>
    </motion.div>
  );
};

export default ListingCard;
