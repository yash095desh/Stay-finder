'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { CalendarIcon, ArrowRight, Loader2 } from 'lucide-react';
import { format, differenceInDays, isBefore } from 'date-fns';
import { Calendar } from './ui/calendar';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner'; // or your toast lib
import { useUserContext } from '@/hooks/userContext';

const CheckOutCard = ({ listing }) => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [loading, setLoading] = useState(false);
  const {user} = useUserContext();
  const router = useRouter();
  const [bookingDates , setBookingDates] = useState([]);

  const nights = startDate && endDate ? differenceInDays(endDate, startDate) : 0;
  const totalPrice = nights * listing?.pricePerNight;

  const handleCheckout = async () => {
    console.log(user)
    if (!user) {
      toast("Sign in first to reserve.");
      return router.push(`/sign-up?redirect_url=${encodeURIComponent(window.location.pathname)}`);
    }

    if (!startDate || !endDate) {
      return toast("Please select both check-in and check-out dates.");
    }

    if (isBefore(endDate, startDate)) {
      return toast("Check-out date must be after check-in date.");
    }

    setLoading(true);
    try {
      const existingBooking = await checkUserBooking(user._id);
      if (existingBooking) {
        toast("You already have a booking.");
        return router.push(`/bookings/${existingBooking._id}`);
      }

      // Proceed to checkout logic here
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookings/create-new`,{
        userId: user?._id,
        listingId: listing?._id,
        startDate,
        endDate
      })

      if(response.data.success){
        toast.success("🎉 Booking Confirmed")
        router.push(`/booking/${response?.data?.booking?._id}`)
      }

    } catch (error) {
      toast("Something went wrong. Try again.");
      console.error(error);
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
        const uniqueDates = Array.from(disabledSet).map(dateStr => new Date(dateStr));
        setBookingDates(uniqueDates);
      }
    } catch (error) {
      console.log("Error while fetching bookings", error);
    }
  };

  fetchBookings();
}, [listing._id]); 




  return (
    <Card>
      <CardContent className="space-y-4 py-4">
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
                    {startDate ? format(startDate, 'PPP') : 'Pick a date'}
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
                    {endDate ? format(endDate, 'PPP') : 'Pick a date'}
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
            <span>{nights} night{nights > 1 ? 's' : ''}</span>
            <span>₹{totalPrice}</span>
          </div>
        )}

        {/* Reserve Button */}
        <Button
          className="w-full mt-2 bg-blue-500 hover:bg-blue-600"
          disabled={!startDate || !endDate || loading}
          onClick={handleCheckout}
        >
          {loading ? <Loader2 className="animate-spin size-5" /> : "Checkout"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CheckOutCard;
