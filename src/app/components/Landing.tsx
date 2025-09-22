import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextField, Grid } from "@mui/material";
import supabase from "../api/supabaseClient";

export default function Landing() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {};

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
        sx={{ mb: 1 }}
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
        <Button variant="contained" onClick={login}>
          Giriş Yap
        </Button>
      </Grid>
    </Grid>
  );
}
