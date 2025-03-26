import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { name, password } = await request.json();

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10);

    // Admin kullanıcısını oluştur
    const admin = await prisma.worker.create({
      data: {
        name,
        password: hashedPassword,
        isAdmin: true
      }
    });

    return NextResponse.json({ success: true, admin }, { status: 201 });
  } catch (error) {
    console.error("Admin oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Admin oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
} 