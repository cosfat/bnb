import prisma from "../prisma";

// Kullanıcı girişi için yardımcı fonksiyon
export async function loginWorker(name, password) {
  console.log("Login attempt for:", { name, password });

  if (!name || !password) {
    console.log("Missing credentials");
    return { success: false, message: "Kullanıcı adı ve şifre gereklidir" };
  }

  try {
    // Worker tablosunda kullanıcı adına göre arama yap
    const worker = await prisma.worker.findFirst({
      where: {
        name: name
      },
      select: {
        id: true,
        name: true,
        password: true,
        isAdmin: true
      }
    });

    console.log("Database query result:", {
      found: !!worker,
      name: worker?.name,
      hasPassword: !!worker?.password
    });

    // Kullanıcı bulunamadıysa hata döndür
    if (!worker) {
      console.log("User not found");
      return { success: false, message: "Kullanıcı bulunamadı" };
    }

    // Şifre kontrolü için debug logları
    const dbPassword = worker.password ? worker.password.trim() : '';
    const inputPassword = password ? password.trim() : '';

    console.log("Password comparison:", {
      inputPasswordLength: inputPassword.length,
      dbPasswordLength: dbPassword.length,
      passwordsMatch: inputPassword === dbPassword,
      inputPasswordChars: Array.from(inputPassword).map(c => c.charCodeAt(0)),
      dbPasswordChars: Array.from(dbPassword).map(c => c.charCodeAt(0))
    });

    // Şifre kontrolü
    if (!dbPassword || inputPassword !== dbPassword) {
      console.log("Password mismatch");
      return { success: false, message: "Hatalı şifre" };
    }

    console.log("Login successful");

    // Başarılı giriş
    return { 
      success: true, 
      worker: {
        id: Number(worker.id),
        name: worker.name,
        isAdmin: Boolean(worker.isAdmin)
      }
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Bir hata oluştu: " + error.message };
  }
} 