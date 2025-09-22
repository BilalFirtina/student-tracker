"use client";
import Header from "@/app/components/Header";
import { ReactNode, useState } from "react";
import Landing from "@/app/components/Landing";

const Client = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
      <Header />
      {!isLoggedIn ? <Landing /> : children}
    </>
  );
};

export default Client;
