"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon, ArrowRight, Loader2, ArrowRightCircleIcon } from "lucide-react";
import { format, differenceInDays, isBefore } from "date-fns";
import { Calendar } from "./ui/calendar";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner"; 
import { useUserContext } from "@/hooks/userContext";

const CheckOutCard = ({ listing }) => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [loading, setLoading] = useState(false);
  const { user } = useUserContext();
  const router = useRouter();
  const [bookingDates, setBookingDates] = useState([]);
  const [reservedBooking, setReservedBooking] = useState(null);
  const [reserving, setReserving] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const nights =
    startDate && endDate ? differenceInDays(endDate, startDate) : 0;
  const totalPrice = nights * listing?.pricePerNight;

  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });

  const handleReserve = async () => {
    if (!user) {
      toast("Sign in first to reserve.");
      return router.push(
        `/sign-up?redirect_url=${encodeURIComponent(window.location.pathname)}`
      );
    }

    if (!startDate || !endDate) {
      return toast("Please select both check-in and check-out dates.");
    }

    if (isBefore(endDate, startDate)) {
      return toast("Check-out date must be after check-in date.");
    }

    setReserving(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookings/create-new`,
        {
          userId: user?._id,
          listingId: listing?._id,
          startDate,
          endDate,
        }
      );

      if (response.data?.success) {
        toast.success("Reservation created. Please proceed to payment.");
        setReservedBooking(response.data.booking);
      }
    } catch (error) {
      toast("Something went wrong while reserving.");
      console.error(error);
    } finally {
      setReserving(false);
    }
  };

  const handleCheckout = async () => {
    if (!reservedBooking) return toast("Please reserve first.");

    setLoading(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) return alert("Failed to load Razorpay SDK");

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/payment/create-order`,
        {
          amount: reservedBooking.totalPrice,
          bookingId: reservedBooking._id,
        }
      );

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "StayFinder",
        description: "Booking Payment",
        order_id: data.order.id,
        notes: { bookingId: reservedBooking._id },
        theme: { color: "#3399cc" },
        handler: async function (response) {
          try {
            const check = await axios.get(
              `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookings/specific/${reservedBooking._id}`
            );

            if (check.data?.booking?.status === "confirmed") {
              setReservedBooking(check.data?.booking);
              toast.success("🎉 Payment Successful!");
              router.push(`/booking/${reservedBooking._id}`);
            } else {
              toast.error("Payment made but booking not yet confirmed.");
            }
          } catch (error) {
            toast.error("Error confirming payment.");
            console.log("Error in verifying payment",error?.message)
          }
        },
        modal: {
          ondismiss: async () => {
            toast("🔎 Checking if payment went through...");
            try {
              const check = await axios.get(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookings/specific/${reservedBooking._id}`
              );

              if (check.data?.booking?.status === "confirmed") {
                toast.success("🎉 Payment Successful!");
                router.push(`/booking/${reservedBooking._id}`);
              } else {
                toast("❌ Payment was not completed.");
              }
            } catch (err) {
              console.error("Status check failed", err);
              toast.error("Couldn't verify payment.");
            }
          },
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Checkout error", err);
      toast.error("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const checkUserBooking = async (userId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookings/check/${userId}/${listing?._id}`
      );
      return response.data?.booking || null;
    } catch (error) {
      console.error("Error while checking user booking", error);
      return null;
    }
  };

  const handleCancelReservation = async () => {
    if (!reservedBooking) return;

    setCancelLoading(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookings/${reservedBooking._id}`
      );
      setReservedBooking(null);
      toast("Reservation cancelled.");
    } catch (error) {
      toast("Failed to cancel reservation.");
      console.error(error);
    } finally {
      setCancelLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserBooking = async () => {
      if (!user) return;
      try {
        const booking = await checkUserBooking(user._id);
        if (booking && new Date(booking.endDate).getTime() > Date.now()) {
          setReservedBooking(booking);
        }
      } catch (err) {
        console.error("Failed to fetch reservation:", err);
      }
    };

    fetchUserBooking();
  }, [user, listing._id]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookings/getAll/${listing._id}`
        );

        if (response.data.bookings) {
          const bookings = response.data.bookings;

          const disabledSet = new Set();

          bookings.forEach((booking) => {
            const start = new Date(booking.startDate);
            const end = new Date(booking.endDate);

            for (
              let d = new Date(start);
              d <= end;
              d.setDate(d.getDate() + 1)
            ) {
              disabledSet.add(new Date(d.getTime()).toDateString());
            }
          });

          // Convert back to array of Date objects
          const uniqueDates = Array.from(disabledSet).map(
            (dateStr) => new Date(dateStr)
          );
          setBookingDates(uniqueDates);
        }
      } catch (error) {
        console.log("Error while fetching bookings", error);
      }
    };

    fetchBookings();
  }, [listing._id, reservedBooking]);

  return (
    <Card>
      <CardContent className="space-y-4 py-4">
        {reservedBooking && reservedBooking.status !== "confirmed" && (
          <div className="p-3 mb-4 rounded-lg bg-yellow-100 text-yellow-800 border border-yellow-300 text-sm">
            You have a pending reservation from{" "}
            <strong>
              {format(new Date(reservedBooking.startDate), "PPP")}
            </strong>{" "}
            to{" "}
            <strong>{format(new Date(reservedBooking.endDate), "PPP")}</strong>.
            <div className="mt-2 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-red-500 border-red-400 hover:bg-red-100"
                onClick={handleCancelReservation}
                disabled={cancelLoading}
              >
                {cancelLoading ? (
                  <Loader2 className="animate-spin size-4" />
                ) : (
                  "Cancel Reservation"
                )}
              </Button>
            </div>
          </div>
        )}
        <h1 className="text-xl font-bold tracking-tighter">
          <span className="underline">₹{listing?.pricePerNight}</span> per Night
        </h1>

        {/* Date Selection */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Check-in */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!startDate}
                className="w-full justify-start h-16"
              >
                <div className="flex flex-col items-start px-2 py-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CalendarIcon size={16} />
                    Check In
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0)) || // disable dates before today
                  bookingDates.some(
                    (d) => d.toDateString() === date.toDateString()
                  ) ||
                  (endDate && date >= endDate)
                }
              />
            </PopoverContent>
          </Popover>

          {/* Check-out */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!endDate}
                className="w-full justify-start h-16"
              >
                <div className="flex flex-col items-start px-2 py-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <ArrowRight size={16} />
                    Check Out
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) =>
                  date <= startDate ||
                  date < new Date(new Date().setHours(0, 0, 0, 0)) || // disable past dates here too
                  bookingDates.some(
                    (d) => d.toDateString() === date.toDateString()
                  )
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Total Price */}
        {nights > 0 && (
          <div className="flex justify-between text-sm font-medium border-t pt-2">
            <span>
              {nights} night{nights > 1 ? "s" : ""}
            </span>
            <span>₹{totalPrice}</span>
          </div>
        )}

        {/* Reserve Button */}
        {!reservedBooking ? (
          <Button
            className="w-full mt-2 bg-blue-500 hover:bg-blue-600"
            disabled={!startDate || !endDate || reserving}
            onClick={handleReserve}
          >
            {reserving ? (
              <Loader2 className="animate-spin size-5" />
            ) : (
              "Reserve"
            )}
          </Button>
        ) : reservedBooking.status === "confirmed" ? (
          <Button
            className="w-full mt-2 border-blue-600 text-blue-600 hover:text-blue-700 flex gap-2 items-center"
            variant={"outline"}
            onClick={() => router.push(`/booking/${reservedBooking._id}`)}
          >
            View Booking <ArrowRightCircleIcon className=" size-4"/>
          </Button>
        ) : (
          <Button
            className="w-full mt-2 bg-green-500 hover:bg-green-600"
            disabled={loading}
            onClick={handleCheckout}
          >
            {loading ? <Loader2 className="animate-spin size-5" /> : "Checkout"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CheckOutCard;
