"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Home, CalendarCheck, IndianRupee, MoreVertical } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useUserContext } from "@/hooks/userContext";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useAuth } from "@clerk/nextjs";

const Page = () => {
  const [viewMode, setViewMode] = useState("month");
  const [selectedListingId, setSelectedListingId] = useState("");
  const [summary, setSummary] = useState({
    totalListings: [],
    upcomingBookings: [],
    totalEarnings: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);

  const { user } = useUserContext();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchSummary = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/dashboard/summary/${user?._id}`
      );
      setSummary(res.data);
      if (res.data.totalListings?.length) {
        setSelectedListingId(res.data.totalListings[0]._id);
      }
    };

    const fetchChart = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/dashboard/bookings-by-month/${user?._id}`
      );
      setChartData(res.data.result);
    };

    fetchSummary();
    fetchChart();
  }, [user]);

  const getChartDataForListing = (listingTitle) => {
    return chartData.map((entry) => ({
      month: entry.month,
      count: entry[listingTitle] || 0,
    }));
  };

  const selectedListing = summary.totalListings.find(
    (l) => l._id === selectedListingId
  );
  const chartForListing = selectedListing
    ? getChartDataForListing(selectedListing.title)
    : [];

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/listing/${listingToDelete._id}`
      );
      setSummary((prev) => ({
        ...prev,
        totalListings: prev.totalListings.filter(
          (l) => l._id !== listingToDelete._id
        ),
      }));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteDialogOpen(false);
      setListingToDelete(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <Home className="w-6 h-6 text-blue-600" />
          <div className="text-center">
            <h4 className="text-sm text-muted-foreground">Total Listings</h4>
            <p className="text-2xl font-bold">
              {summary?.totalListings.length}
            </p>
          </div>
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <CalendarCheck className="w-6 h-6 text-green-600" />
          <div className="text-center">
            <h4 className="text-sm text-muted-foreground">Upcoming Bookings</h4>
            <p className="text-2xl font-bold">
              {summary?.upcomingBookings.length}
            </p>
          </div>
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <IndianRupee className="w-6 h-6 text-yellow-600" />
          <div className="text-center">
            <h4 className="text-sm text-muted-foreground">Total Earnings</h4>
            <p className="text-2xl font-bold">₹{summary?.totalEarnings}</p>
          </div>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold">Bookings Over Time</h4>
          <Select
            value={selectedListingId}
            onValueChange={setSelectedListingId}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select listing" />
            </SelectTrigger>
            <SelectContent>
              {summary.totalListings.map((listing) => (
                <SelectItem key={listing._id} value={listing._id}>
                  {listing.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartForListing}>
            <CartesianGrid strokeDasharray="4 2" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Listings and Bookings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Listings */}
        <Card className="p-4 bg-blue-50">
          <h4 className="text-lg font-semibold mb-4">My Listings</h4>
          <div className="space-y-3">
            {summary?.totalListings.map((listing) => (
              <div
                key={listing._id}
                className="relative border bg-white hover:shadow-md transition p-3 rounded-lg group"
              >
                <Link href={`/listing/${listing._id}`}>
                  <div>
                    <p className="font-medium text-blue-900">
                      {listing.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {listing.location.city}, {listing.location.country}
                    </p>
                  </div>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger className="absolute top-2 right-2">
                    <MoreVertical className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/listing/edit/${listing._id}`)
                      }
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setListingToDelete(listing);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </Card>

        {/* Bookings */}
        <Card className="p-4 bg-green-50">
          <h4 className="text-lg font-semibold mb-4">Upcoming Bookings</h4>
          <div className="space-y-3">
            {summary?.upcomingBookings.map((booking) => (
              <div
                key={booking._id}
                onClick={() => router.push(`/booking/${booking._id}`)}
                className="cursor-pointer border bg-white hover:shadow transition p-3 rounded-lg"
              >
                <div className="flex items-center gap-3 mb-1">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={booking?.userId?.imageUrl} />
                    <AvatarFallback>
                      {booking.userId?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">
                      {booking.userId?.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {booking.userId?.email}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/listing/${booking?.listingId?._id}`}
                  onClick={(e) => e.stopPropagation()} 
                  className="text-sm text-blue-600 hover:underline"
                >
                  {booking.listingId?.title}
                </Link>

                <p className="text-xs text-muted-foreground">
                  Check-in: {format(new Date(booking.startDate), 'PPP')}
                </p>
                <p className="text-xs text-muted-foreground">
                  Total: ₹{booking.totalPrice}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{listingToDelete?.title}</span>?
            This action cannot be undone.
          </p>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
