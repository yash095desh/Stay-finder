"use client";
import CheckOutCard from "@/components/checkoutCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import axios from "axios";
import {
  AirVent,
  ParkingCircle,
  Tv2Icon,
  Utensils,
  WashingMachine,
  Wifi,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);

  const whatThisPlaceOffers = [
    { label: "Wi-Fi", icon: Wifi },
    { label: "Air conditioning", icon: AirVent },
    { label: "Free parking on premises", icon: ParkingCircle },
    { label: "Kitchen", icon: Utensils },
    { label: "Washing machine", icon: WashingMachine },
    { label: "Television", icon: Tv2Icon },
  ];

  const testimonials = [
    {
      name: "Ananya Sharma",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      feedback:
        "Absolutely loved our stay! The home was clean, cozy, and perfectly located. The host was super responsive too!",
    },
    {
      name: "Rohan Mehta",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4,
      feedback:
        "Great location and very well maintained. Would definitely book again for a weekend getaway!",
    },
    {
      name: "Ishita Verma",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      rating: 5,
      feedback:
        "Felt like home away from home. Spacious rooms and amazing amenities. Highly recommended!",
    },
  ]

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/listing/${id}`
        );
        if (response.data.success) {
          setListing(response.data.listing);
        }
      } catch (error) {
        console.error("Error in fetching listing:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchListing();
  }, [id]);


  if (loading) {
    return (
      <div className="w-full flex items-center justify-center my-30">
        <div className="size-8 border-2 border-blue-500 rounded-full border-t-white animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center text-gray-500 my-30">Listing not found.</div>
    );
  }

  return (
    <div className="my-10  ">
      <h1 className="text-3xl font-bold tracking-tight mb-4">
        {listing?.title}
      </h1>

      {listing?.images?.length > 0 && (
        <Carousel className="w-full mb-6">
          <CarouselContent>
            {listing.images.map((image) => (
              <CarouselItem key={image}>
                <div className="relative w-full aspect-[16/6]">
                  <Image
                    src={image}
                    alt="listing-image"
                    fill
                    className="object-cover rounded-2xl"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}

      <div className="grid grid-cols-3 gap-4 ">
        <div className=" col-span-2 flex flex-col gap-6">
          <div className="mt-6 space-y-4">
            <h1 className="text-xl font-semibold tracking-tight">
              Stays Unit in {listing?.location?.address},{" "}
              {listing?.location?.city}, {listing?.location?.country}
            </h1>

            <div className="text-gray-700 flex flex-wrap items-center gap-2 text-sm">
              <p>3 guests</p>
              <span className="h-1 w-1 bg-gray-500 rounded-full" />
              <p>1 bedroom</p>
              <span className="h-1 w-1 bg-gray-500 rounded-full" />
              <p>1 bed</p>
              <span className="h-1 w-1 bg-gray-500 rounded-full" />
              <p>1 bathroom</p>
            </div>

            <div className="py-4 flex items-center gap-4 border-b border-gray-200">
              <Avatar className="h-10 w-10">
                <AvatarImage src={listing?.hostId?.imageUrl} />
                <AvatarFallback>
                  {listing?.hostId?.name?.charAt(0).toUpperCase() ||
                    listing?.hostId?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-medium tracking-tight">
                  Hosted by {listing?.hostId?.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Superhost • Joined{" "}
                  {new Date(listing?.hostId?.createdAt).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "long",
                    }
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="text-gray-700 text-lg tracking-tight flex items-center gap-1 py-4 border-b border-b-gray-200">
            {listing?.description}
          </div>
          <div className=" py-4 border-b border-b-gray-200 flex flex-col gap-2">
            <h1 className=" text-xl font-bold tracking-tight">
              What this place offer
            </h1>
            <div className=" grid grid-cols-2 gap-4 mt-2">
              {whatThisPlaceOffers.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    className="flex items-center gap-2 text-muted-foreground"
                    key={item.label}
                  >
                    <Icon className="size-4" />
                    <p>{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="my-16 px-4 md:px-8 max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                What Our Guests Are Saying
              </h2>
              <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                Real reviews from people who stayed at our properties and
                experienced the comfort, convenience, and care we strive for.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial, idx) => (
                <div
                  key={idx}
                  className="bg-white shadow-md p-6 rounded-2xl border border-gray-100"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <div className="text-yellow-500 text-sm">
                        {"★".repeat(testimonial.rating)}{" "}
                        {"☆".repeat(5 - testimonial.rating)}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {testimonial.feedback}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
            <CheckOutCard listing={listing}/>
        </div>
      </div>
    </div>
  );
};

export default Page;
