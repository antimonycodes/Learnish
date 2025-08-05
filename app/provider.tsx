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

  useEffect(() => {
    user && createUser();
  }, [user]);

  // console.log(user);

  const createUser = async () => {
    const response = await axios.post("/api/user", {
      name: user?.fullName,
      email: user?.primaryEmailAddress?.emailAddress,
    });
    console.log(response.data);
  };

  return (
    <UserDetailContext.Provider
      value={{
        userDetail,
        setUserDetail,
      }}
    >
      <SelectedChapterContext
        value={{ selectedChapterIndex, setSelectedChapterIndex }}
      >
        <div>{children}</div>
      </SelectedChapterContext>
    </UserDetailContext.Provider>
  );
};

export default Provider;
