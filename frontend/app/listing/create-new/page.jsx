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
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "sonner";
import { useUserContext } from "@/hooks/userContext";
import { useRouter } from "next/navigation";
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
  images: z
    .array(z.instanceof(File))
    .min(3, { message: "At least 3 images are required." }),
});

function CreateListingPage() {
  const {user} = useUserContext();
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
    mode: "onBlur", // optional, improves UX
  });

  const availableFrom = watch("availableFrom");
  const availableUpto = watch("availableUpto");
  const images = watch("images");

  const onSubmit = async (data) => {
    try {
     
      if(!user?._id) return toast("User not found Please login again") ;
      // Upload images to Cloudinary
      const imageUrls = await Promise.all(
        data.images.map((file) => handleUpload(file))
      );

      // Construct the final payload to send to backend
      const payload = {
        title: data.title,
        description: data.description,
        hostId: user?._id,
        location: {
          country: data.country,
          state: data.state,
          city: data.city,
          address: data.address,
        },
        pricePerNight: data.pricePerNight,
        availableFrom: data.availableFrom,
        availableTo: data.availableUpto,
        images: imageUrls,
      };

      console.log("Payload to backend:", payload);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/listing/create-new`,payload);

      if(response.data.success){
        console.log("Listing Created",response?.data?.listing)
        toast.success("Listing Created !")
        router.push("/host-dashboard")
      }

    } catch (error) {
      console.log("Error in creating listing", error);
    }
  };

  const handleUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);  
      formData.append("upload_preset", "Stay-finder");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/yashdesh/image/upload",
        formData
      );

      if (response.data.secure_url) {
        return response.data.secure_url;
      } else {
        throw new Error("No secure_url returned from Cloudinary");
      }
    } catch (error) {
      console.log("Error in uploading file", error);
      throw error; // Rethrow so Promise.all fails properly
    }
  };


  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-4xl my-14 ">
        <CardHeader className="mb-4">
          <CardTitle className=" text-2xl md:text-4xl font-extrabold text-primary mb-2 tracking-tighter">
            Create New Listing
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium md:text-lg tracking-tight leading-snug">
            Use this form to share your space with others. <br className=" hidden md:block" />
            Once submitted, your property will be visible to users looking for a
            place to stay.
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
              <Label htmlFor="images">Upload Images (Min: 3)</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                className="cursor-pointer"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setValue("images", files, {
                    shouldValidate: true,
                  });
                }}
              />

              {/* Optional: Image preview */}
              {images && images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {Array.from(images).map((file, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(file)}
                      alt={`preview-${idx}`}
                      className="h-24 w-full object-cover rounded-md border"
                    />
                  ))}
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
              className="px-10 py-5 bg-primary text-white rounded-md tracking-tight "
              disabled={isSubmitting}
            >
              Submit Listing
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default CreateListingPage;
