"use client";

import { useEffect, useState } from "react";
import supabase from "@/app/api/supabaseClient";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Subject = "türkçe" | "matematik" | "fen bilgisi" | "sosyal bilgiler";

interface ExamResult {
  id: string;
  student_id: string;
  subject: Subject;
  score: number;
  exam_date: string; // YYYY-MM-DD
}

interface ExamResultsProps {
  studentId: string;
  mode: "teacher" | "student";
}

const subjects: Subject[] = ["türkçe", "matematik", "fen bilgisi", "sosyal bilgiler"];

const subjectLabels: Record<Subject, string> = {
  türkçe: "Türkçe",
  matematik: "Matematik",
  "fen bilgisi": "Fen Bilgisi",
  "sosyal bilgiler": "Sosyal Bilgiler",
};

const subjectColors: Record<Subject, string> = {
  türkçe: "#ef4444", // Kırmızı
  matematik: "#3b82f6", // Mavi
  "fen bilgisi": "#f59e0b", // Turuncu
  "sosyal bilgiler": "#10b981", // Yeşil
};

export default function ExamResults({ studentId, mode }: ExamResultsProps) {
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<Subject>("türkçe");
  const [score, setScore] = useState<string>("");
  const [examDate, setExamDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const fetchExamResults = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("exam_results")
        .select("id, student_id, subject, score, exam_date")
        .eq("student_id", studentId)
        .order("exam_date", { ascending: true });

      if (error) {
        console.error("Sınav sonuçları alınırken hata:", error.message);
      } else {
        setExamResults((data as ExamResult[]) || []);
      }
      setLoading(false);
    };

    if (studentId) {
      fetchExamResults();
    }
  }, [studentId]);

  const handleAddResult = async () => {
    if (!score.trim() || !examDate) return;

    const scoreNum = parseFloat(score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      alert("Not 0-100 arasında olmalıdır.");
      return;
    }

    const newResult = {
      student_id: studentId,
      subject: selectedSubject,
      score: scoreNum,
      exam_date: examDate,
    };

    const { data, error } = await supabase
      .from("exam_results")
      .insert(newResult)
      .select("id, student_id, subject, score, exam_date")
      .single();

    if (error) {
      console.error("Sınav sonucu eklenirken hata:", error.message);
      alert("Sınav sonucu eklenirken bir hata oluştu.");
      return;
    }

    setExamResults((prev) => [...prev, data as ExamResult]);
    setScore("");
    setExamDate(new Date().toISOString().split("T")[0]);
  };

  // Grafik için veri hazırlama
  const prepareChartData = () => {
    // Tüm sınav tarihlerini topla ve sırala
    const allDates = Array.from(
      new Set(examResults.map((r) => r.exam_date))
    ).sort();

    // Her tarih için her dersin notunu bul
    const chartData = allDates.map((date) => {
      const dataPoint: Record<string, string | number | null> = {
        date: new Date(date).toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "2-digit",
        }),
      };

      subjects.forEach((subject) => {
        const result = examResults.find(
          (r) => r.exam_date === date && r.subject === subject
        );
        // Not varsa göster, yoksa null (connectNulls=true olduğu için çizgiler birleşir)
        dataPoint[subjectLabels[subject]] = result ? result.score : null;
      });

      return dataPoint;
    });

    return chartData;
  };

  const chartData = prepareChartData();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" mb={2}>
        📊 Sınav Sonuçları
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
            Yeni sınav sonucu ekle
          </Typography>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ flexWrap: "wrap" }}
          >
            <Select
              size="small"
              value={selectedSubject}
              onChange={(e: SelectChangeEvent) =>
                setSelectedSubject(e.target.value as Subject)
              }
              sx={{ minWidth: 150, flex: { xs: "1 1 100%", md: "1 1 25%" } }}
            >
              {subjects.map((subject) => (
                <MenuItem key={subject} value={subject}>
                  {subjectLabels[subject]}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Not (0-100)"
              type="number"
              size="small"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              inputProps={{ min: 0, max: 100 }}
              sx={{ flex: { xs: "1 1 100%", md: "1 1 25%" } }}
            />
            <TextField
              label="Sınav Tarihi"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              sx={{ flex: { xs: "1 1 100%", md: "1 1 25%" } }}
            />
            <Button
              variant="contained"
              onClick={handleAddResult}
              sx={{ whiteSpace: "nowrap", flex: { xs: "1 1 100%", md: "1 1 20%" } }}
            >
              Ekle
            </Button>
          </Stack>
        </Box>
      )}

      {loading ? (
        <Typography variant="body2">Sınav sonuçları yükleniyor...</Typography>
      ) : chartData.length === 0 ? (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="grey.400" mb={2}>
            Henüz sınav sonucu bulunmuyor.
          </Typography>
          {mode === "student" && (
            <Button
              variant="outlined"
              onClick={() => setShowChart(true)}
              disabled
            >
              📊 Grafiği Göster
            </Button>
          )}
        </Box>
      ) : (
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            onClick={() => setShowChart(true)}
            sx={{ mb: 2 }}
          >
            📊 Grafiği Göster
          </Button>
        </Box>
      )}

      {/* Fullscreen Grafik Modal */}
      <Dialog
        open={showChart}
        onClose={() => setShowChart(false)}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
            m: 0,
            borderRadius: 0,
            backgroundColor: "rgba(15, 23, 42, 0.98)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#e5e7eb",
            borderBottom: "1px solid rgba(148,163,184,0.3)",
          }}
        >
          <Typography variant="h6">📊 Sınav Sonuçları Grafiği</Typography>
          <Button
            onClick={() => setShowChart(false)}
            variant="outlined"
            sx={{ color: "#e5e7eb", borderColor: "rgba(148,163,184,0.4)" }}
          >
            Kapat
          </Button>
        </DialogTitle>
        <DialogContent sx={{ p: 3, height: "calc(100% - 64px)" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.3)" />
              <XAxis
                dataKey="date"
                stroke="#e5e7eb"
                style={{ fontSize: "14px" }}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#e5e7eb"
                style={{ fontSize: "14px" }}
                label={{
                  value: "Not",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle", fill: "#e5e7eb", fontSize: "14px" },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(148,163,184,0.4)",
                  color: "#e5e7eb",
                }}
              />
              <Legend
                wrapperStyle={{ color: "#e5e7eb", fontSize: "14px" }}
                iconType="line"
              />
              {subjects.map((subject) => (
                <Line
                  key={subject}
                  type="monotone"
                  dataKey={subjectLabels[subject]}
                  stroke={subjectColors[subject]}
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                  connectNulls={true}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

