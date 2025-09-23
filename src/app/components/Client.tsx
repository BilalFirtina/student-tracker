"use client";
import Header from "@/app/components/Header";
import { ReactNode, useEffect, useState } from "react";
import supabase from "@/app/api/supabaseClient";
import Landing from "@/app/components/Landing";

const Client = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // mevcut session kontrol et
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session); // session varsa true
    };

    checkSession();

    // oturum değişimini dinle
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Header />
      {!isLoggedIn ? <Landing /> : children}
    </>
  );
};

export default Client;
