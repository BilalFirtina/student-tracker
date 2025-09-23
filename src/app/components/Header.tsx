"use client";
import { Avatar, Grid, Menu, MenuItem } from "@mui/material";
import Logo from "./Logo";
import { useRouter } from "next/navigation";
import { useState } from "react";
import supabase from "@/app/api/supabaseClient";

export default function Header() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    handleClose();
    router.push("/"); // logout sonrası anasayfa ya da login sayfasına yönlendir
  };

  return (
    <Grid sx={{ p: 1 }}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid>
          <Logo />
        </Grid>
        <Grid
          rowSpacing={1}
          container
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Avatar sx={{ cursor: "pointer" }} onClick={handleClick} />
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={() => router.push("/profile")}>Profil</MenuItem>
            <MenuItem onClick={handleLogout}>Çıkış Yap</MenuItem>
          </Menu>
        </Grid>
      </Grid>
    </Grid>
  );
}
