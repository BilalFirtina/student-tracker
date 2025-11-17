 "use client";
import { useEffect, useState } from "react";
import supabase from "@/app/api/supabaseClient";
import Calendar from "@/app/components/Calendar";
import Tasks from "@/app/components/Tasks";
import ExamResults from "@/app/components/ExamResults";
import { Button, Box, Stack, Typography } from "@mui/material";

type Student = {
  id: string;
  username: string;
  role: string;
  lesson_fee: number;
};

type ActiveSection = "calendar" | "tasks" | "examResults" | null;

export default function TeacherDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, role, lesson_fee")
        .eq("role", "student");

      if (error) {
        console.error(error.message);
        return;
      }
      setStudents(data || []);
    };

    fetchStudents();
  }, []);

  // Öğrenci değiştiğinde tüm bölümleri kapat
  useEffect(() => {
    if (selectedStudent) {
      setActiveSection(null);
    }
  }, [selectedStudent]);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>📚 Öğretmen Paneli</h2>
      <h3>Öğrencilerim:</h3>
      <ul>
        {students.map((s) => (
          <li
            key={s.id}
            style={{ cursor: "pointer", listStyle: "none" }}
            onClick={() => setSelectedStudent(s)}
          >
            {" "}
            <Button> {s.username}</Button>
          </li>
        ))}
      </ul>

      {selectedStudent && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" mb={2} textAlign="center">
            Seçilen öğrenci: {selectedStudent.username}
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            sx={{ mb: 3 }}
          >
            <Button
              variant={activeSection === "calendar" ? "contained" : "outlined"}
              onClick={() =>
                setActiveSection(activeSection === "calendar" ? null : "calendar")
              }
              sx={{ minWidth: 200 }}
            >
              📅 Ders Ekleme
            </Button>
            <Button
              variant={activeSection === "tasks" ? "contained" : "outlined"}
              onClick={() =>
                setActiveSection(activeSection === "tasks" ? null : "tasks")
              }
              sx={{ minWidth: 200 }}
            >
              📝 Ödev Verme
            </Button>
            <Button
              variant={
                activeSection === "examResults" ? "contained" : "outlined"
              }
              onClick={() =>
                setActiveSection(
                  activeSection === "examResults" ? null : "examResults"
                )
              }
              sx={{ minWidth: 200 }}
            >
              📊 Sınav Sonucu Girme
            </Button>
          </Stack>

          {activeSection === "calendar" && (
            <Box sx={{ mb: 3 }}>
              <Calendar student={selectedStudent} />
            </Box>
          )}

          {activeSection === "tasks" && (
            <Box sx={{ mb: 3 }}>
              <Tasks studentId={selectedStudent.id} mode="teacher" />
            </Box>
          )}

          {activeSection === "examResults" && (
            <Box sx={{ mb: 3 }}>
              <ExamResults studentId={selectedStudent.id} mode="teacher" />
            </Box>
          )}
        </Box>
      )}
    </div>
  );
}
