"use client";
import { Avatar, Grid } from "@mui/material";
export default function UserHeader() {
  return (
    <Grid container direction="column" alignItems="center">
      <Grid>
        <Avatar>B</Avatar>
      </Grid>
      <Grid>
        <h1 style={{ margin: 0 }}>Bilal Fırtına</h1>
        <p style={{ margin: 0 }}>KullanıcıAdi</p>
      </Grid>
    </Grid>
  );
}
