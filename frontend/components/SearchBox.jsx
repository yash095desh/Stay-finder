"use client";

import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const SearchBox = () => {
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [date, setDate] = useState(undefined);

  const handleSearch = () => {
    const query = new URLSearchParams();

    if (location) query.append("location", location);
    if (priceRange) query.append("price", priceRange);
    if (date) query.append("date", date.toISOString());

    // Navigate or fetch using this query
    window.location.href = `/search?${query.toString()}`;
  };

  return (
    <Card className="bg-blue-50 w-full">
      <CardContent className="flex flex-col gap-4 p-4 w-full">
        {/* Location */}
        <div className="space-y-2">
          <Label>Location</Label>
          <Input
            type="text"
            placeholder="Enter Stay Location"
            className=" bg-white"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Price Range</Label>
          <Select onValueChange={setPriceRange} >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select price range" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="0-1000">₹0 - ₹1,000</SelectItem>
                <SelectItem value="1000-3000">₹1,000 - ₹3,000</SelectItem>
                <SelectItem value="3000-7000">₹3,000 - ₹7,000</SelectItem>
                <SelectItem value="7000-15000">₹7,000 - ₹15,000</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!date}
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </PopoverContent>
          </Popover>
        </div>

        {/* Submit Button */}
        <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600" onClick={handleSearch}>
          Search Stays
        </Button>
      </CardContent>
    </Card>
  );
};

export default SearchBox;
