"use client";
import { Button, TextField, Grid } from "@mui/material";
import Image from "next/image";

export default function Landing() {
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
        />
        <TextField
          sx={{ mb: 2 }}
          size="small"
          label="Şifre"
          variant="outlined"
        />
        <Button variant="contained">Giriş Yap</Button>
      </Grid>
      <Grid>
        <Image
          width={150}
          height={150}
          style={{ maxWidth: "300px" }}
          src={"/dilber-foto.jpg"}
          alt="profile-photo"
        />
      </Grid>
    </Grid>
  );
}
