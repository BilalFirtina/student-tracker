"use client";

import { useEffect, useState } from "react";
import supabase from "@/app/api/supabaseClient";
import {
  Box,
  Button,
  Chip,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type TaskStatus = "pending" | "done";

interface Task {
  id: string;
  student_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null; // YYYY-MM-DD
}

interface TasksProps {
  studentId: string;
  mode: "teacher" | "student";
}

const statusLabel: Record<TaskStatus, string> = {
  pending: "Beklemede",
  done: "Tamamlandı",
};

export default function Tasks({ studentId, mode }: TasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("tasks")
        .select("id, student_id, title, description, status, due_date")
        .eq("student_id", studentId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Görevler alınırken hata:", error.message);
      } else {
        setTasks((data as Task[]) || []);
      }
      setLoading(false);
    };

    if (studentId) {
      fetchTasks();
    }
  }, [studentId]);

  const handleAddTask = async () => {
    if (!title.trim()) return;

    const newTask = {
      student_id: studentId,
      title: title.trim(),
      description: description.trim() || null,
      status: "pending" as TaskStatus,
      due_date: dueDate || null,
    };

    const { data, error } = await supabase
      .from("tasks")
      .insert(newTask)
      .select("id, student_id, title, description, status, due_date")
      .single();

    if (error) {
      console.error("Görev eklenirken hata:", error.message);
      alert("Görev eklenirken bir hata oluştu.");
      return;
    }

    setTasks((prev) => [...prev, data as Task]);
    setTitle("");
    setDescription("");
    setDueDate("");
  };

  const handleStatusChange = async (taskId: string, value: TaskStatus) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status: value })
      .eq("id", taskId);

    if (error) {
      console.error("Durum güncellenirken hata:", error.message);
      alert("Görev durumu güncellenemedi.");
      return;
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: value } : t))
    );
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" mb={2}>
        Ödevler / Görevler
      </Typography>

      {mode === "teacher" && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            border: "1px solid rgba(148,163,184,0.4)",
          }}
        >
          <Typography variant="subtitle2" mb={1}>
            Yeni görev ekle
          </Typography>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ flexWrap: "wrap" }}
          >
            <TextField
              label="Başlık"
              size="small"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ flex: { xs: "1 1 100%", md: "1 1 30%" } }}
            />
            <TextField
              label="Açıklama"
              size="small"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ flex: { xs: "1 1 100%", md: "1 1 40%" } }}
            />
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flex: { xs: "1 1 100%", md: "1 1 25%" },
              }}
            >
              <TextField
                label="Son tarih"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                sx={{ flex: 1 }}
              />
              <Button
                variant="contained"
                onClick={handleAddTask}
                sx={{ whiteSpace: "nowrap" }}
              >
                Ekle
              </Button>
            </Box>
          </Stack>
        </Box>
      )}

      {loading ? (
        <Typography variant="body2">Görevler yükleniyor...</Typography>
      ) : tasks.length === 0 ? (
        <Typography variant="body2" color="grey.400">
          Henüz tanımlanmış bir görev bulunmuyor.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {tasks.map((task) => (
            <Box
              key={task.id}
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: "1px solid rgba(148,163,184,0.4)",
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                backgroundColor:
                  task.status === "pending"
                    ? "rgba(252, 231, 243, 0.8)" // Açık pembe arka plan
                    : "rgba(209, 250, 229, 0.8)", // Açık yeşil arka plan
                color:
                  task.status === "pending"
                    ? "#831843" // Koyu pembe yazı
                    : "#065f46", // Koyu yeşil yazı
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography
                  fontWeight={600}
                  sx={{
                    color:
                      task.status === "pending" ? "#831843" : "#065f46",
                  }}
                >
                  {task.title}
                </Typography>
                <Chip
                  label={statusLabel[task.status]}
                  size="small"
                  sx={{
                    backgroundColor:
                      task.status === "pending" ? "#ec4899" : "#22c55e",
                    color: "#ffffff",
                    fontWeight: 600,
                  }}
                />
              </Box>
              {task.description && (
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      task.status === "pending"
                        ? "#9f1239"
                        : "#047857",
                  }}
                >
                  {task.description}
                </Typography>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 0.5,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      task.status === "pending"
                        ? "#9f1239"
                        : "#047857",
                  }}
                >
                  {task.due_date ? `Son tarih: ${task.due_date}` : "Son tarih yok"}
                </Typography>

                {/* Sadece öğretmen durumu güncelleyebilir */}
                <Select
                  size="small"
                  value={task.status}
                  onChange={(e: SelectChangeEvent) =>
                    handleStatusChange(task.id, e.target.value as TaskStatus)
                  }
                  sx={{
                    minWidth: 150,
                    display: mode === "student" ? "none" : "block",
                  }}
                >
                  <MenuItem value="pending">Beklemede</MenuItem>
                  <MenuItem value="done">Tamamlandı</MenuItem>
                </Select>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}



