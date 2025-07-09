"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import {
  MapPin,
  User,
  IndianRupee,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@clerk/nextjs";

const Page = () => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id: bookingId } = useParams();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookings/specific/${bookingId}`
        );
        if (response.data.success) {
          setBooking(response.data.booking);
        }
      } catch (error) {
        console.error("Error fetching booking", error);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin size-10" />
      </div>
    );
  }

  if (!booking) {
    return <p className="text-center text-red-500">Booking not found</p>;
  }

  const nights =
    (new Date(booking.endDate).getTime() -
      new Date(booking.startDate).getTime()) /
    (1000 * 60 * 60 * 24);

  const statusColor =
    {
      confirmed: "border-green-500 text-green-600",
      pending: "border-yellow-500 text-yellow-600",
      cancelled: "border-red-500 text-red-600",
    }[booking.status] || "border-gray-300 text-gray-500";

  const { listingId: listing, userId: user } = booking;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Floating Icon */}
      <div className="relative">
        <div className="absolute left-1/2 -top-12 transform -translate-x-1/2 z-10">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg border-4 border-white ${
              booking.status === "confirmed"
                ? "bg-green-500"
                : booking.status === "pending"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          >
            {booking.status === "confirmed" && (
              <CheckCircle className="w-12 h-12 text-white" />
            )}
            {booking.status === "pending" && (
              <Clock className="w-12 h-12 text-white" />
            )}
            {booking.status === "cancelled" && (
              <XCircle className="w-12 h-12 text-white" />
            )}
          </div>
        </div>

        {/* Booking Card */}
        <div className="mt-12 bg-white rounded-xl shadow-2xl p-6 pt-16 relative">
          <h1 className="text-center text-2xl font-bold capitalize mb-6">
            Booking {booking.status}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Stay Details */}
            <div className="bg-gray-50 rounded-md p-4 space-y-2">
              <h2 className="text-lg font-semibold mb-2">Stay Details</h2>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <strong>Property:</strong>
                  </span>{" "}
                  {listing.title}
                </p>
                <p>
                  <strong>Location:</strong> {listing.location.city},{" "}
                  {listing.location.country}
                </p>
                <p>
                  <strong>Check-in:</strong>{" "}
                  {format(new Date(booking.startDate), "PPP")}
                </p>
                <p>
                  <strong>Check-out:</strong>{" "}
                  {format(new Date(booking.endDate), "PPP")}
                </p>
                <p>
                  <strong>Total Nights:</strong> {nights}
                </p>
              </div>
            </div>

            {/* Right: Pricing + Guest Info */}
            <div className="bg-gray-50 rounded-md p-4 space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">Pricing</h2>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    <span>
                      <strong>Price per Night:</strong> ₹{listing.pricePerNight}
                    </span>
                  </p>
                  <p>
                    <strong>Total Price:</strong> ₹{booking.totalPrice}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Guest Info</h2>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>
                      <strong>Name:</strong> {user.name}
                    </span>
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Booking ID:</strong> {booking._id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center mt-6">
            <button
              onClick={() => router.push("/")}
              className="bg-primary text-white font-medium px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Back to HomePage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
