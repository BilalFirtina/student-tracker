"use client";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import supabase from "@/app/api/supabaseClient";

function Calendar({ student }: { student: any }) {
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState<number>(0);

  const handleDayClick = (clickedDate: Date) => {
    setDate(clickedDate);
    setHours(1);
    setOpen(true);
  };

  const handleSave = async () => {
    const { error } = await supabase.from("lessons").insert({
      student_id: student.id,
      date: date.toISOString().split("T")[0],
      hours,
    });

    if (error) {
      console.error("Ders eklenirken hata:", error.message);
      alert("Ders kaydı başarısız!");
    } else {
      alert(
        `${
          student.username
        } için ${date.toDateString()} tarihine ${hours} saat eklendi`
      );
    }

    setOpen(false);
  };

  return (
    <>
      <ReactCalendar
        onClickDay={handleDayClick}
        value={date}
        calendarType="iso8601"
        nextLabel=">"
        prevLabel="<"
      />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Ders Saati Girişi ({student.username})</DialogTitle>
        <DialogContent>
          <TextField
            label="Ders Saati"
            type="number"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            fullWidth
            sx={{ mt: "5px", mb: "5px" }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={() => setOpen(false)}>İptal</Button>
          <Button onClick={handleSave} variant="contained">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Calendar;
