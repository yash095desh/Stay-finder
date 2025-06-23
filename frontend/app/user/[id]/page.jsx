'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import axios from 'axios';
import { useUserContext } from '@/hooks/userContext';
import { EditProfileModal } from '@/components/EditProfileModal';
import { BecomeHostModal } from '@/components/becomeHostModal';

const Page = () => {
  const { user } = useUserContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showHost, setShowHost] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();

  const refetchUser = () => setRefresh((prev) => !prev);

  useEffect(() => {
    if (!user?._id) return;

    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookings/user/${user._id}`);
        if (res.data.success) {
          setBookings(res.data.bookings);
        }
      } catch (error) {
        console.error("Error fetching user bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, refresh]);

  if (!user) return <p>Loading user info...</p>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Bookings */}
      <div className="md:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Your Bookings</h3>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : bookings.length === 0 ? (
          <p className="text-muted-foreground">You haven't made any bookings yet.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking._id} className="cursor-pointer hover:shadow-lg transition" onClick={() => router.push(`/booking/${booking._id}`)}>
                <CardContent className="p-4 space-y-2">
                  <h4 className="text-md font-semibold">{booking?.listingId?.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {booking?.listingId?.location?.city}, {booking?.listingId?.location?.country}
                  </p>
                  <div className="text-sm flex justify-between items-center">
                    <div>
                      <p><strong>Check-in:</strong> {format(new Date(booking.startDate), 'PPP')}</p>
                      <p><strong>Check-out:</strong> {format(new Date(booking.endDate), 'PPP')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">₹{booking.totalPrice}</p>
                      <span className="text-xs text-green-600 font-medium">{booking.status}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* User Profile */}
      <Card className="h-fit">
        <CardContent className="flex flex-col items-center gap-4 p-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <span className={`text-xs mt-1 inline-block px-2 py-1 ${user?.role === "host"?"bg-yellow-100 text-yellow-800":"bg-blue-100 text-blue-800"} rounded`}>
              Role: {user.role}
            </span>
          </div>
          <div className="w-full space-y-2">
            <Button variant="outline" className="w-full" onClick={() => setShowEdit(true)}>
              Edit Profile
            </Button>
            {user.role === 'guest' && (
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600" onClick={() => setShowHost(true)}>
                Become a Host
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <EditProfileModal
        open={showEdit}
        onOpenChange={setShowEdit}
        user={user}
        onSuccess={refetchUser}
        uploadImage={async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', 'your_preset');

          const res = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
            method: 'POST',
            body: formData
          });

          const data = await res.json();
          return data.secure_url;
        }}
      />

      <BecomeHostModal
        open={showHost}
        onOpenChange={setShowHost}
        user={user}
        onSuccess={refetchUser}
      />
    </div>
  );
};

export default Page;
