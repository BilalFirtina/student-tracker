"use client";
import { Avatar, Grid, Button } from "@mui/material";
import Logo from "./Logo";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
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
          <Avatar
            sx={{ cursor: "pointer" }}
            className="pointer"
            onClick={() => router.push("/profile")}
          >
            B
          </Avatar>
        </Grid>
      </Grid>
    </Grid>
  );
}
