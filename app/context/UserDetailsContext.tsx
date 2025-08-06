// app/context/UserDetailsContext.tsx
import { createContext } from "react";

type UserDetailContextType = {
  userDetail: any;
  setUserDetail: React.Dispatch<React.SetStateAction<any>>;
} | null;

export const UserDetailContext = createContext<UserDetailContextType>(null);
