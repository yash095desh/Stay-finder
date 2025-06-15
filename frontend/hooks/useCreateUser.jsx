"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect } from "react";
import { useUserContext } from "./userContext";

function useCreateUser() {
  const { user } = useUser();
  const { setUser } = useUserContext();

  useEffect(() => {
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
          
          // console.log("User Stored :", response?.data?.user);
          setUser(response?.data?.user);
        } catch (error) {
          console.log("Error while storing the user", error);
        }
      };
      storeUser();
    }else {
      setUser(null); 
    }
  }, [user]);

}

export default useCreateUser;
