'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { useUserContext } from '@/hooks/userContext';
import { useRouter } from 'next/navigation';

export const BecomeHostModal = ({ open, onOpenChange, user, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useUserContext();
  const router = useRouter();

  const handleBecomeHost = async () => {
    if (!user.name || !user.imageUrl) {
      return toast("Complete your profile first");
    }
    setLoading(true);
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${user._id}`, {
        role: "host",
      });
      if (res.data.success) {
        setUser(res.data.user)
        toast("You are now a host!");
        onSuccess();
        onOpenChange(false);
        router.push("/host-dashboard")
      }
    } catch (err) {
      console.error(err);
      toast("Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Become a Host</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Hosting lets you share your space with travelers and earn money. Make sure your profile is complete before proceeding.
        </p>

        <DialogFooter>
          <Button disabled={loading} onClick={handleBecomeHost}>
            Confirm & Become Host
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};