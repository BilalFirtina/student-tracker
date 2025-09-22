"use client";
import { CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Header from "@/app/components/Header";
import { ReactNode, useState } from "react";
import Landing from "@/app/components/Landing";

const Client = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CssBaseline />
      <Header />
      {!isLoggedIn ? <Landing /> : children}
    </LocalizationProvider>
  );
};

export default Client;
