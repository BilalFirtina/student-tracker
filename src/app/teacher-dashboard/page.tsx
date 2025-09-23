"use client";
import { useEffect, useState } from "react";
import supabase from "@/app/api/supabaseClient";
import Calendar from "@/app/components/Calendar";
import { Button } from "@mui/material";

export default function TeacherDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

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
        <div style={{ marginTop: 20 }}>
          <h3>Seçilen öğrenci: {selectedStudent.username}</h3>
          {selectedStudent && <Calendar student={selectedStudent} />}
        </div>
      )}
    </div>
  );
}
