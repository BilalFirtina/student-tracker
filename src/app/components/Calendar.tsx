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

function Calendar() {
  const [date, setDate] = useState<Date>(new Date()); // seçili tarih
  const [open, setOpen] = useState(false); // modal kontrolü
  const [hours, setHours] = useState<number>(0); // girilen ders saati
  const [schedule, setSchedule] = useState<{ [key: string]: number }>({}); // tarihler ve saatler

  const handleDayClick = (clickedDate: Date) => {
    setDate(clickedDate);
    setHours(schedule[clickedDate.toDateString()] || 0); // varsa eski değeri al
    setOpen(true);
  };

  const handleSave = () => {
    setSchedule((prev) => ({
      ...prev,
      [date.toDateString()]: hours,
    }));
    setOpen(false);
  };
  return (
    <>
      <ReactCalendar
        onClickDay={handleDayClick} // gün tıklandığında modal aç
        value={date}
        calendarType="iso8601"
        nextLabel=">"
        prevLabel="<"
      />
      {/* Ders saatini girme modalı */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Ders Saati Girişi</DialogTitle>
        <DialogContent>
          <TextField
            label="Ders Saati"
            type="number"
            defaultValue={1}
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
