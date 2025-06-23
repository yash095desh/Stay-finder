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
import Image from "next/image";
import ListingCard from "@/components/ListingCard";
import SearchBox from "@/components/SearchBox";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default async function Home() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/listing/search`,
    {
      cache: "no-store", // fetch fresh data
    }
  );
  const data = await res.json();
  const listings = data?.listings?.slice(0, 5) || [];

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
    <div className="px-4 md:px-0">
      {/* HeroImage Section */}
      <section className=" my-20 flex flex-col gap-6 relative">
        <div className=" md:absolute md:h-full w-full md:max-w-sm flex items-center md:justify-center md:right-6 z-10">
          <SearchBox />
        </div>
        <div>
          <h1 className=" text-4xl font-extrabold tracking-tighter mb-2">
            Experience the Best <br /> Stays Around the World
          </h1>
          <p className="text-muted-foreground font-medium tracking-tight">
            Find comfort, convenience, and unforgettable memories
            <br />
            Book Unique Stays in Amazing Places Affordable. Comfortable. Just
            the way you like it
          </p>
        </div>
        <div className="relative w-full h-80">
          <Image
            src="/LandingPageImage.jpg"
            alt="Homepage image"
            fill
            className="object-cover "
          />
        </div>
      </section>

      {/* Listing Section */}
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

      {/* Gallery Section */}
      <section className=" w-full my-20">
        <div className="flex justify-center">
          <Badge
            className={
              "border-blue-500 text-blue-500 text-center px-4 py-2 mb-4"
            }
            variant={"outline"}
          >
            Gallery
          </Badge>
        </div>
        <div className=" flex flex-col md:flex-row items-start justify-between gap-4">
          <h1 className=" text-xl font-bold tracking-tighter">
            Explore the Beauty <br /> of Our Stays Through the Gallery
          </h1>
          <p className="font-medium text-muted-foreground mb-6 md:text-end">
            Take a closer look at the charm, comfort, and character <br /> of
            our properties. Each photo captures the unique experiences waiting
            for you
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div className="row-span-1 md:row-span-2">
            <Image
              src="/galleryImages1.jpg"
              alt="gallery-img-1"
              width={600}
              height={600}
              className="w-full h-full object-cover rounded-xl aspect-[4/5]"
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Image
              src="/galleryImages2.jpg"
              alt="gallery-img-2"
              width={400}
              height={300}
              className="w-full h-full object-cover rounded-xl aspect-[6/5]"
            />
            <Image
              src="/galleryImages3.jpg"
              alt="gallery-img-3"
              width={400}
              height={300}
              className="w-full h-full object-cover rounded-xl aspect-[6/5]"
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/galleryImages4.jpg"
              alt="gallery-img-4"
              width={800}
              height={300}
              className="w-full h-full object-cover rounded-xl aspect-[8/3]"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className=" w-full my-20 flex flex-col gap-4">
        <div className="flex justify-center">
          <Badge
            className={
              "border-blue-500 text-blue-500 text-center px-4 py-2 mb-4"
            }
            variant={"outline"}
          >
            Features
          </Badge>
        </div>
        <div className=" flex flex-col md:flex-row items-start justify-between gap-4">
          <h1 className=" text-xl font-bold tracking-tighter">
            Why Guests Love <br /> Staying With Us
          </h1>
          <p className="font-medium text-muted-foreground mb-6 md:text-end">
            From handpicked amenities to exceptional service, our properties{" "}
            <br /> are thoughtfully designed to offer you comfort, convenience,
            and a stay that feels like home—no matter where you are.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card className="bg-blue-100" key={feature.title}>
                <CardContent className="flex items-center justify-center gap-2 flex-col text-center">
                  <Icon className="size-5 text-blue-500 mb-4" />
                  <h2 className="text-lg font-bold tracking-tight">
                    {feature.title}
                  </h2>
                  <p className="text-sm tracking-tighter leading-snug">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
