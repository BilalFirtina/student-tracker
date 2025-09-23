"use client";

import { Grid, Container } from "@mui/material";
import UserHeader from "./components/User/Header";

export default function Home() {
  return (
    <Container>
      <Grid>
        <UserHeader />
      </Grid>
      <Grid container justifyContent="center" sx={{ mt: 2 }}></Grid>
    </Container>
  );
}
