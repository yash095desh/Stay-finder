"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect } from "react";

function useCreateUser() {
  const { user } = useUser();

  useEffect(() => {
    console.log("hook called ", user)
    if (user) {
      const storeUser = async () => {
        try {
          if (!process.env.NEXT_PUBLIC_SERVER_URL) throw new Error("backend url not found");

          const response = await axios.post(
              `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/storeUser`,
              {
                clerkId: user.id,
                email: user.primaryEmailAddress?.emailAddress,
                name: user.fullName,
                image: user.imageUrl,
              }
            )
          
          console.log("User Stored :", response);
        } catch (error) {
          console.log("Error while storing the user", error);
        }
      };
      storeUser();
    }
  }, [user]);

}

export default useCreateUser;
