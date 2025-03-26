import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { convertBigIntToNumber } from "../../lib/helpers";

// Tüm çalışanları getir
export async function GET() {
  try {
    const workers = await prisma.worker.findMany({
      orderBy: {
        name: "asc",
      },
    });

    // BigInt değerlerini normal sayılara dönüştür
    const serializedWorkers = convertBigIntToNumber(workers);

    return NextResponse.json(serializedWorkers);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Yeni çalışan ekle
export async function POST(request) {
  try {
    const data = await request.json();
    
    const worker = await prisma.worker.create({
      data: {
        name: data.name,
      },
    });

    // BigInt değerlerini normal sayılara dönüştür
    const serializedWorker = convertBigIntToNumber(worker);

    return NextResponse.json(serializedWorker, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 