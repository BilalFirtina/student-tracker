try {
  // 1️⃣ Profili username ile çek
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("username", username)
    .single();

  if (error || !profile) {
    alert("Kullanıcı bulunamadı");
    return;
  }

  // 2️⃣ Kullanıcı giriş yapıyor (password auth)
  // Eğer supabase auth email kullanıyorsa, username -> fake email
  const email = `${username}@gmail.com`;

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError) {
    alert(authError.message);
    return;
  }

  // 3️⃣ Role bazlı yönlendirme
  if (profile.role === "teacher") {
    router.push("/teacher-dashboard"); // öğrencileri görebileceği sayfa
  } else if (profile.role === "student") {
    router.push("/student-dashboard"); // sadece kendi bilgilerini görebileceği sayfa
  } else {
    alert("Tanımlanmamış rol!");
  }
} catch (err) {
  console.error(err);
  alert("Giriş sırasında bir hata oluştu");
}
