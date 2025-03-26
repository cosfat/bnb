import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { name, password } = await request.json();

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcıyı oluştur
    const worker = await prisma.worker.create({
      data: {
        name,
        password: hashedPassword,
        isAdmin: false
      }
    });

    return NextResponse.json({ success: true, worker }, { status: 201 });
  } catch (error) {
    console.error("Kayıt hatası:", error);
    return NextResponse.json(
      { error: "Kayıt işlemi sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
} 