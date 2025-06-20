'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { MapPin, User, IndianRupee, BadgeCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, differenceInDays } from 'date-fns';

const Page = () => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id : bookingId } = useParams();
  const router = useRouter();

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

  const nights = differenceInDays(
    new Date(booking.endDate),
    new Date(booking.startDate)
  );

  const { listingId: listing, userId: user } = booking;

  return (
     <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold flex justify-center items-center gap-2">
          <BadgeCheck className="text-green-500" /> Booking Confirmed 🎉
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here's your reservation summary
        </p>
      </div>

      {/* Stay Details */}
      <Card>
        <CardContent className="py-4 space-y-2">
          <h2 className="text-xl font-semibold mb-1">🏨 Stay Details</h2>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              <strong>Property:</strong> {listing.title}
            </p>
            <p className="flex items-center gap-1">
              <MapPin size={14} /> {listing.location.city}, {listing.location.country}
            </p>
            <p>
              <strong>Check-in:</strong> {format(new Date(booking.startDate), 'PPP')}
            </p>
            <p>
              <strong>Check-out:</strong> {format(new Date(booking.endDate), 'PPP')}
            </p>
            <p>
              <strong>Total Nights:</strong> {nights}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardContent className="py-4 space-y-2">
          <h2 className="text-xl font-semibold mb-1">💰 Pricing</h2>
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="flex items-center gap-1">
              <IndianRupee size={14} />
              <strong>Price per Night:</strong> ₹{listing.pricePerNight}
            </p>
            <p>
              <strong>Total Price:</strong> ₹{booking.totalPrice}
            </p>
          </div>
        </CardContent>
      </Card>

       {/* Guest Info */}
      <Card>
        <CardContent className="py-4 space-y-2">
          <h2 className="text-xl font-semibold mb-1">👤 Guest Info</h2>
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="flex items-center gap-1">
              <User size={14} /> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Booking ID:</strong> {booking._id}
            </p>
          </div>
        </CardContent>
      </Card>


      <div className="text-center mt-6">
        <Button
          onClick={() => router.push('/')}
          className="bg-primary hover:bg-primary/90"
        >
          Back to HomePage
        </Button>
      </div>
    </div>
  );
};

export default Page;
