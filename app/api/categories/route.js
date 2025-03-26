import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

// BigInt değerlerini normal sayılara dönüştüren yardımcı fonksiyon
function convertBigIntToNumber(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (typeof value === "bigint") {
        return Number(value);
      }
      return value;
    })
  );
}

// Tüm kategorileri listele
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    // BigInt değerlerini normal sayılara dönüştür
    const serializedCategories = convertBigIntToNumber(categories);

    return NextResponse.json(serializedCategories);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Yeni kategori oluştur
export async function POST(request) {
  try {
    const data = await request.json();
    
    const category = await prisma.category.create({
      data: {
        name: data.name,
      },
    });

    // BigInt değerlerini normal sayılara dönüştür
    const serializedCategory = convertBigIntToNumber(category);

    return NextResponse.json(serializedCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 