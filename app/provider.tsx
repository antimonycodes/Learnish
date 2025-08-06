"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { UserDetailContext } from "./context/UserDetailsContext";
import { SelectedChapterContext } from "./context/SelectedChapterContext";

const Provider = ({ children }: any) => {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState<any>();
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);

  const createUser = async () => {
    try {
      const response = await axios.post("/api/user", {
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  useEffect(() => {
    if (user) createUser();
  }, [user]);

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <SelectedChapterContext.Provider
        value={{ selectedChapterIndex, setSelectedChapterIndex }}
      >
        <div>{children}</div>
      </SelectedChapterContext.Provider>
    </UserDetailContext.Provider>
  );
};

export default Provider;
