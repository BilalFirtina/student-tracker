"use client";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import supabase from "@/app/api/supabaseClient";

// Öğrenci profili tipi
interface StudentProfile {
  id: string;
  username: string;
  role: string;
  lesson_fee: number;
}

// Ders tipi
interface Lesson {
  lesson_date: string;
  duration: number;
}

function Calendar({ student }: { student: StudentProfile }) {
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState<number>(1); // Varsayılan 1 saat
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeMonth, setActiveMonth] = useState(new Date());

  // Gün tıklama → Öğretmen ders ekler
  const handleDayClick = (clickedDate: Date) => {
    setDate(clickedDate);
    setHours(1);
    setOpen(true);
  };

  // Dersleri DB'den çek
  useEffect(() => {
    if (!student) return;

    const fetchLessons = async () => {
      const startOfMonth = new Date(
        activeMonth.getFullYear(),
        activeMonth.getMonth(),
        1
      )
        .toISOString()
        .split("T")[0];

      const endOfMonth = new Date(
        activeMonth.getFullYear(),
        activeMonth.getMonth() + 1,
        0
      )
        .toISOString()
        .split("T")[0];

      const { data, error } = await supabase
        .from("lesson_dates")
        .select("lesson_date, duration")
        .eq("student_id", student.id)
        .gte("lesson_date", startOfMonth)
        .lte("lesson_date", endOfMonth);

      if (error) {
        console.error(error.message);
        return;
      }

      setLessons(data || []);
    };

    fetchLessons();
  }, [student, activeMonth]);

  // Ders kaydet
  const handleSave = async () => {
    if (!student) return;
    const formattedDate = date.toLocaleDateString("sv-SE"); // YYYY-MM-DD

    const { error } = await supabase.from("lesson_dates").insert({
      student_id: student.id,
      lesson_date: formattedDate,
      duration: hours,
    });

    if (error) {
      alert("Ders kaydı başarısız!");
    } else {
      alert(
        `${
          student.username
        } için ${date.toDateString()} tarihine ${hours} saat eklendi`
      );
      setLessons([...lessons, { lesson_date: formattedDate, duration: hours }]);
    }
    setOpen(false);
  };

  // Aylık toplam saat
  const monthlyTotal = lessons
    .filter((l) => {
      const d = new Date(l.lesson_date);
      return (
        d.getMonth() === activeMonth.getMonth() &&
        d.getFullYear() === activeMonth.getFullYear()
      );
    })
    .reduce((sum, l) => sum + (l.duration || 0), 0);

  // Toplam ücret
  const totalFee = monthlyTotal * (student?.lesson_fee ?? 0);

  return (
    <>
      <ReactCalendar
        onClickDay={handleDayClick}
        value={date}
        calendarType="iso8601"
        nextLabel=">"
        prevLabel="<"
        onActiveStartDateChange={({ activeStartDate }) =>
          setActiveMonth(activeStartDate || new Date())
        }
        tileClassName={({ date }) => {
          const formatted = date.toLocaleDateString("sv-SE"); // YYYY-MM-DD
          return lessons.find((l) => l.lesson_date === formatted)
            ? "lesson-day"
            : "";
        }}
      />

      <p style={{ marginTop: "10px" }}>
        Bu ay toplam: {monthlyTotal} saat →{" "}
        {new Intl.NumberFormat("tr-TR", {
          style: "currency",
          currency: "TRY",
        }).format(totalFee)}
      </p>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Ders Saati Girişi ({student?.username})</DialogTitle>
        <DialogContent>
          <TextField
            label="Ders Saati"
            type="number"
            inputProps={{ min: 1 }}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            fullWidth
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
