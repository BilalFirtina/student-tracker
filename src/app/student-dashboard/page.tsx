"use client";
import { useEffect, useState } from "react";
import supabase from "@/app/api/supabaseClient";
import Calendar from "@/app/components/Calendar";
import Tasks from "@/app/components/Tasks";
import ExamResults from "@/app/components/ExamResults";
import { Button, Box, Stack, Typography } from "@mui/material";

interface StudentProfile {
  id: string;
  username: string;
  role: string;
  lesson_fee: number;
}

type ActiveSection = "calendar" | "tasks" | "examResults" | null;

export default function StudentDashboard() {
  const [currentUser, setCurrentUser] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);

  useEffect(() => {
    const fetchCurrentStudent = async () => {
      try {
        // Auth ile giriş yapan kullanıcıyı al
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) {
          throw new Error("Oturum bulunamadı. Lütfen tekrar giriş yapın.");
        }

        // Bu kullanıcıya ait profili getir
        const { data, error } = await supabase
          .from("profiles")
          .select("id, username, role, lesson_fee")
          .eq("id", user.id)
          .single();

        if (error) {
          throw new Error("Öğrenci profili bulunamadı.");
        }

        if (data) {
          setCurrentUser(data);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Bilinmeyen bir hata oluştu.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentStudent();
  }, []);

  if (loading)
    return (
      <div style={{ padding: 20, textAlign: "center" }}>Yükleniyor...</div>
    );
  if (error)
    return (
      <div style={{ padding: 20, textAlign: "center", color: "red" }}>
        Hata: {error}
      </div>
    );

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>🗓️ Öğrenci Paneli</h2>
      {currentUser && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" mb={2} textAlign="center">
            Hoş geldin, {currentUser.username}!
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
              📅 Derslerim
            </Button>
            <Button
              variant={activeSection === "tasks" ? "contained" : "outlined"}
              onClick={() =>
                setActiveSection(activeSection === "tasks" ? null : "tasks")
              }
              sx={{ minWidth: 200 }}
            >
              📝 Ödevlerim
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
              📊 Sınav Sonuçlarım
            </Button>
          </Stack>

          {activeSection === "calendar" && (
            <Box sx={{ mb: 3 }}>
              <Calendar student={currentUser} />
            </Box>
          )}

          {activeSection === "tasks" && (
            <Box sx={{ mb: 3 }}>
              <Tasks studentId={currentUser.id} mode="student" />
            </Box>
          )}

          {activeSection === "examResults" && (
            <Box sx={{ mb: 3 }}>
              <ExamResults studentId={currentUser.id} mode="student" />
            </Box>
          )}
        </Box>
      )}
    </div>
  );
}
