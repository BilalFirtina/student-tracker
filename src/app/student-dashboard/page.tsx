"use client";
import { useEffect, useState } from "react";
import supabase from "@/app/api/supabaseClient";
import Calendar from "@/app/components/Calendar";

// Simüle edilecek öğrenci profili için tip tanımı
interface StudentProfile {
  id: string;
  username: string;
  role: string;
  lesson_fee: number;
}

export default function StudentDashboard() {
  const [currentUser, setCurrentUser] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentStudent = async () => {
      try {
        // "Giriş yapmış" öğrenciyi simüle etmek için
        // profiller tablosundan rolü öğrenci olan ilk kullanıcıyı çekiyoruz.
        const { data, error } = await supabase
          .from("profiles")
          .select("id, username, role, lesson_fee")
          .eq("role", "student")
          .limit(1)
          .single(); // .single() metodu tek bir sonuç döndürür veya hata verir

        if (error) {
          throw new Error(
            "Öğrenci profili yüklenemedi. Sisteme kayıtlı bir öğrenci olduğundan emin olun."
          );
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

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>Yükleniyor...</div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "red" }}>
        Hata: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>🗓️ Öğrenci Paneli</h2>
      {currentUser && (
        <div style={{ marginTop: 20 }}>
          <h3>Hoş geldin, {currentUser.username}!</h3>
          <p style={{ textAlign: "center" }}>
            Aşağıdaki takvimden derslerini takip edebilirsin.
          </p>
          <Calendar student={currentUser} />
        </div>
      )}
    </div>
  );
}
