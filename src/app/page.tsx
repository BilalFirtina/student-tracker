"use client";

import { useState } from "react";
import { Container, Grid } from "@mui/material";
import UserHeader from "./components/User/Header";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function Home() {
  const [date, setDate] = useState<Date>(new Date()); // state olarak Date tipi

  return (
    <Container>
      <Grid>
        <UserHeader />
      </Grid>
      <Grid container justifyContent="center" sx={{ mt: 2 }}>
        <ReactCalendar
          onChange={(newDate) => setDate(newDate as Date)}
          value={date}
          calendarType="iso8601"
          nextLabel=">"
          prevLabel="<"
          tileClassName="small-calendar" // mobil için CSS ile küçültebilirsin
        />
      </Grid>
    </Container>
  );
}
