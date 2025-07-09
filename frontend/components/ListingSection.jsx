'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import ListingCard from './ListingCard';

const ListingSection = () => {
    const [listings,setListings] = useState([]);

    useEffect(()=>{
    const getListing = async() =>{
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/listing/search`);
        const listings = res?.data?.listings?.slice(0, 5) || [];
        setListings(listings);
    }
    getListing();
    },[])
     
  return (
  <>
     {listings?.length > 0 && (
        <section className=" w-full my-20 px-10">
          <div className="flex justify-center">
            <Badge
              className={
                "border-blue-500 text-blue-500 text-center px-4 py-2 mb-4"
              }
              variant={"outline"}
            >
              Our Rooms
            </Badge>
          </div>
          <h1 className=" text-xl font-bold tracking-tighter">
            Featured Stays Just for You
          </h1>
          <p className="font-medium text-muted-foreground mb-6">
            Discover popular properties handpicked for comfort, style, and
            unforgettable experiences.
          </p>

          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              {listings?.map((item) => (
                <CarouselItem
                  key={item?._id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <ListingCard data={item} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
      )}
  </>
  )
}

export default ListingSection