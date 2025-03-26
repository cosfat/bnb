import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { convertBigIntToNumber } from "../../lib/helpers";
import { headers } from "next/headers";

// Admin kontrolü için yardımcı fonksiyon
async function checkIsAdmin() {
  try {
    const headersList = headers();
    const userId = headersList.get('x-user-id');
    
    if (!userId) {
      return false;
    }

    const user = await prisma.worker.findUnique({
      where: { id: BigInt(userId) }
    });

    return user?.isAdmin || false;
  } catch (error) {
    console.error("Admin check error:", error);
    return false;
  }
}

// Tüm rezervasyonları getir
export async function GET() {
  try {
    console.log("Reservations API called");
    
    try {
      // Veritabanı bağlantısını test et
      await prisma.$connect();
      console.log("Prisma connection successful");
    } catch (connError) {
      console.error("Prisma connection error:", connError);
      return NextResponse.json({ error: "Database connection error: " + connError.message }, { status: 500 });
    }
    
    try {
      // Hata ayıklama için şemayı kontrol et
      console.log("Checking reservation model:", prisma.reservation);
      
      const reservations = await prisma.reservation.findMany({
        orderBy: {
          start: "desc",
        }
      });
      console.log("Reservations fetched:", reservations.length);
      
      // İlave bilgiler için ayrı sorgular yap
      const enhancedReservations = await Promise.all(reservations.map(async (reservation) => {
        let house = null;
        let worker = null;
        
        try {
          if (reservation.house_id) {
            house = await prisma.house.findUnique({
              where: { id: reservation.house_id }
            });
          }
          
          if (reservation.worker_id) {
            worker = await prisma.worker.findUnique({
              where: { id: reservation.worker_id }
            });
          }
        } catch (error) {
          console.error("Error fetching related data:", error);
        }
        
        return {
          ...reservation,
          house: house || { name: "Bilinmiyor", id: 0 },
          worker: worker || { name: "Bilinmiyor", id: 0 }
        };
      }));
      
      // BigInt değerlerini normal sayılara dönüştür
      const serializedReservations = convertBigIntToNumber(enhancedReservations);
      
      return NextResponse.json(serializedReservations);
    } catch (queryError) {
      console.error("Query error:", queryError);
      return NextResponse.json({ error: "Query error: " + queryError.message }, { status: 500 });
    }
  } catch (error) {
    console.error("General error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Yeni rezervasyon ekle
export async function POST(request) {
  try {
    // Admin kontrolü
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Bu işlem için admin yetkisi gereklidir" }, { status: 403 });
    }

    const data = await request.json();
    
    const reservation = await prisma.reservation.create({
      data: {
        name: data.name,
        house_id: BigInt(data.house_id),
        worker_id: BigInt(data.worker_id),
        start: new Date(data.start),
        finish: new Date(data.finish),
        price: parseFloat(data.price),
        info: data.info || null
      }
    });
    
    // İlgili bilgileri ayrı olarak al
    let house = null;
    let worker = null;
    
    try {
      if (reservation.house_id) {
        house = await prisma.house.findUnique({
          where: { id: reservation.house_id }
        });
      }
      
      if (reservation.worker_id) {
        worker = await prisma.worker.findUnique({
          where: { id: reservation.worker_id }
        });
      }
    } catch (error) {
      console.error("Error fetching related data:", error);
    }
    
    const completeReservation = {
      ...reservation,
      house: house || { name: "Bilinmiyor", id: 0 },
      worker: worker || { name: "Bilinmiyor", id: 0 }
    };

    // BigInt değerlerini normal sayılara dönüştür
    const serializedReservation = convertBigIntToNumber(completeReservation);
    
    return NextResponse.json(serializedReservation, { status: 201 });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 