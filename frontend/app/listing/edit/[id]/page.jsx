"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LocationSelector from "@/components/ui/location-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "sonner";
import { useUserContext } from "@/hooks/userContext";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const formSchema = z.object({
  title: z.string().min(1, "Listing title is required"),
  description: z.string().min(1, "Description is required"),
  state: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
  pricePerNight: z.number().min(1, "Price per Night required"),
  availableFrom: z.date().min(new Date(), "Available from Date is required"),
  availableUpto: z.date().min(new Date(), "Available Upto date is required"),
  images: z.array(z.union([z.instanceof(File), z.string()])).min(1),
});

function EditListingPage() {
  const { user } = useUserContext();
  const { id } = useParams();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn]);

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      country: "",
      state: "",
      city: "",
      address: "",
      pricePerNight: undefined,
      availableFrom: undefined,
      availableUpto: undefined,
      images: [],
    },
  });

  const availableFrom = watch("availableFrom");
  const availableUpto = watch("availableUpto");
  const images = watch("images");

  useEffect(() => {
    if (!id) return;
    const fetchListing = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/listing/${id}`
        );
        const data = res.data?.listing;

        setValue("title", data.title);
        setValue("description", data.description);
        setValue("country", data.location.country);
        setValue("state", data.location.state);
        setValue("city", data.location.city);
        setValue("address", data.location.address);
        setValue("pricePerNight", data.pricePerNight);
        setValue("availableFrom", new Date(data.availableFrom));
        setValue("availableUpto", new Date(data.availableTo));
        setValue("images", data.images);
      } catch (err) {
        console.error("Failed to fetch listing", err);
        toast.error("Failed to load listing.");
      }
    };
    fetchListing();
  }, [id, setValue]);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Stay-finder");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/yashdesh/image/upload",
      formData
    );
    return res.data.secure_url;
  };

  const onSubmit = async (data) => {
    try {
      if (!user?._id) return toast("User not found. Please log in again.");

      const uploadedImages = await Promise.all(
        data.images.map(async (img) => {
          if (typeof img === "string") return img;
          return await handleUpload(img);
        })
      );

      const payload = {
        title: data.title,
        description: data.description,
        hostId: user._id,
        location: {
          country: data.country,
          state: data.state,
          city: data.city,
          address: data.address,
        },
        pricePerNight: data.pricePerNight,
        availableFrom: data.availableFrom,
        availableTo: data.availableUpto,
        images: uploadedImages,
      };

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/listing/${id}`,
        payload
      );

      if (res.data.success) {
        toast.success("Listing updated successfully!");
        router.push("/host-dashboard");
      }
    } catch (err) {
      console.error("Error updating listing", err);
      toast.error("Error updating listing.");
    }
  };

  const removeImage = (target) => {
    const newImages = images.filter((img) => {
      if (typeof img === "string") return img !== target;
      return img.name !== target.name;
    });
    setValue("images", newImages, { shouldValidate: true });
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-4xl my-14">
        <CardHeader>
          <CardTitle className="text-4xl font-extrabold text-primary">
            Edit Listing
          </CardTitle>
          <CardDescription>
            Modify your existing listing details
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                id="title"
                placeholder="Enter Title"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                id="description"
                placeholder="Enter Description"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2 w-full">
              <Label>Location</Label>

              <LocationSelector
                onCountryChange={(country) => {
                  const countryName = country?.name || "";
                  setValue("country", countryName);
                }}
                onStateChange={(state) => {
                  const stateName = state?.name || "";
                  setValue("state", stateName);
                }}
              />

              {errors.country && (
                <p className="text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>

            <div className=" flex flex-col md:flex-row items-start gap-4 ">
              <div className="space-y-2 w-full">
                <Label>City</Label>
                <Input
                  id="city"
                  placeholder="Enter City"
                  {...register("city")}
                />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2 w-full">
                <Label>Address</Label>
                <Input
                  id="address"
                  placeholder="Enter Address"
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Price per night</Label>
              <Input
                type="number"
                id="pricePerNight"
                placeholder="Enter price for per night"
                {...register("pricePerNight", {
                  valueAsNumber: true,
                })}
              />
              {errors.pricePerNight && (
                <p className="text-sm text-red-500">
                  {errors.pricePerNight.message}
                </p>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="space-y-2 w-full">
                <Label>Available From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!availableFrom}
                      className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                    >
                      <CalendarIcon />
                      {availableFrom ? (
                        format(availableFrom, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={availableFrom}
                      disabled={(date) => date < new Date()}
                      onSelect={(date) => {
                        setValue("availableFrom", date, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {errors.availableFrom && (
                  <p className="text-sm text-red-500">
                    {errors.availableFrom.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 w-full">
                <Label>Available Upto</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!availableUpto}
                      className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                    >
                      <CalendarIcon />
                      {availableUpto ? (
                        format(availableUpto, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={availableUpto}
                      disabled={(date) =>
                        date < new Date() || date < availableFrom
                      }
                      onSelect={(date) => {
                        setValue("availableUpto", date, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {errors.availableUpto && (
                  <p className="text-sm text-red-500">
                    {errors.availableUpto.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="images">Upload Images (Min: 1)</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                className="cursor-pointer"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  const existingImages = images.filter(
                    (img) => typeof img === "string"
                  );
                  setValue("images", [...existingImages, ...files], {
                    shouldValidate: true,
                  });
                }}
              />

              {images && images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {images.map((img, idx) => {
                    const isUrl = typeof img === "string";
                    const src = isUrl ? img : URL.createObjectURL(img);
                    return (
                      <div key={idx} className="relative group">
                        <img
                          src={src}
                          alt={`preview-${idx}`}
                          className="h-28 w-full object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(img)}
                          className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-black"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {errors.images && (
                <p className="text-sm text-red-500">{errors.images.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="justify-end mt-6">
            <Button
              type="submit"
              className="px-10 py-5 bg-primary text-white rounded-md"
              disabled={isSubmitting}
            >
              Update Listing
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default EditListingPage;
