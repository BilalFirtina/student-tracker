"use client";
import Image from "next/image";

const Logo = () => {
  return (
    <Image src="/logo-light.png" alt="Logo" width={60} height={60} priority />
  );
};

export default Logo;
