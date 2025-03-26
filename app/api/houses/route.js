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

// Tüm evleri getir
export async function GET() {
  try {
    console.log("Houses API called");
    
    try {
      // Veritabanı bağlantısını test et
      await prisma.$connect();
      console.log("Prisma connection successful");
    } catch (connError) {
      console.error("Prisma connection error:", connError);
      return NextResponse.json({ error: "Database connection error: " + connError.message }, { status: 500 });
    }
    
    try {
      const houses = await prisma.house.findMany({
        orderBy: {
          name: "asc",
        },
      });
      console.log("Houses fetched:", houses);
      
      // BigInt değerlerini normal sayılara dönüştür
      const serializedHouses = convertBigIntToNumber(houses);
      
      return NextResponse.json(serializedHouses);
    } catch (queryError) {
      console.error("Query error:", queryError);
      return NextResponse.json({ error: "Query error: " + queryError.message }, { status: 500 });
    }
  } catch (error) {
    console.error("General error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Yeni ev ekle
export async function POST(request) {
  try {
    const data = await request.json();
    
    const house = await prisma.house.create({
      data: {
        name: data.name,
      },
    });

    // BigInt değerlerini normal sayılara dönüştür
    const serializedHouse = convertBigIntToNumber(house);
    
    return NextResponse.json(serializedHouse, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 