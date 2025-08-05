import { UserProfile } from "@clerk/nextjs";
import React from "react";

const Profile = () => {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl px-4 py-8 w-fit">
        <h2 className="mb-8 text-2xl font-bold">Manage your profile</h2>
        <UserProfile routing="hash" />
      </div>
    </div>
  );
};

export default Profile;
