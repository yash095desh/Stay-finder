"use client";
import ListingCard from "@/components/ListingCard";
import SearchBox from "@/components/SearchBox";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function page() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState([]);

  const location = searchParams.get("location");
  const price = searchParams.get("price"); // e.g. "1000-3000"
  const date = searchParams.get("date");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/listing/search?location=${location}&price=${price}&date=${date}`
        );
        if (response.data.success) {
          setListings(response.data.listings);
        }
      } catch (err) {
        console.error("Search failed:", err);
      }
    };

    fetchListings();
  }, [location, price, date]);

  return (
    <div className="my-12 grid grid-cols-1 lg:grid-cols-3 gap-4 px-2 md:px-4">
      {/* Right Section: SearchBox (appears on top on mobile, right on desktop) */}
      <div className="order-1 lg:order-2">
        <SearchBox />
      </div>

      {/* Left Section: Listings */}
      <div className="order-2 lg:order-1 lg:col-span-2 flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Searched Stays
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.length > 0 ? (
            listings.map((listing) => (
              <ListingCard data={listing} key={listing?._id} />
            ))
          ) : (
            <div className="text-center text-lg text-gray-600 col-span-full">
              No Listings Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default page;
