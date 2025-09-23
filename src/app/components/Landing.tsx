"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextField, Grid } from "@mui/material";
import supabase from "../api/supabaseClient";

export default function Landing() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const email = `${username}@gmail.com`;
      console.log(email);
      console.log(password);

      // 1️⃣ Email + password ile giriş yap
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        alert(authError.message);
        return;
      }
      console.log(authData);
      // 2️⃣ Kullanıcının profilini çek
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id) // auth.users tablosundaki id ile eşle
        .single();

      if (profileError || !profile) {
        alert("Kullanıcı profili bulunamadı");
        return;
      }

      // 3️⃣ Role bazlı yönlendirme
      if (profile.role === "teacher") {
        router.push("/teacher-dashboard");
      } else if (profile.role === "student") {
        router.push("/student-dashboard");
      } else {
        alert("Tanımlanmamış rol!");
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Bilinmeyen bir hata oluştu");
      }
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      direction="column"
    >
      <Grid textAlign="center">
        <h1 style={{ marginTop: 0 }}>
          Öğrencinizin Bilgilerine Erişmek İçin Lütfen Giriş Yapınız
        </h1>
      </Grid>

      <Grid
        container
        direction="column"
        justifyContent="flex-end"
        alignItems="center"
        sx={{ mb: 1, width: "300px" }}
      >
        <TextField
          sx={{ mb: 2 }}
          size="small"
          label="Kullanıcı Adı"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          sx={{ mb: 2 }}
          size="small"
          label="Şifre"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="button" variant="contained" onClick={(e) => login(e)}>
          Giriş Yap
        </Button>
      </Grid>
    </Grid>
  );
}
