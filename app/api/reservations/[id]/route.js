import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { convertBigIntToNumber } from "../../../lib/helpers";
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

// Belirli bir rezervasyonu getir
export async function GET(request, { params }) {
  try {
    const paramsId = await params.id;
    const id = BigInt(paramsId);
    
    const reservation = await prisma.reservation.findUnique({
      where: { id }
    });

    if (!reservation) {
      return NextResponse.json({ error: "Rezervasyon bulunamadı" }, { status: 404 });
    }
    
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

    return NextResponse.json(serializedReservation);
  } catch (error) {
    console.error("GET reservation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Rezervasyonu güncelle
export async function PUT(request, { params }) {
  try {
    // Admin kontrolü
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Bu işlem için admin yetkisi gereklidir" }, { status: 403 });
    }

    const paramsId = await params.id;
    const id = BigInt(paramsId);
    const data = await request.json();

    const updatedReservation = await prisma.reservation.update({
      where: { id },
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
      if (updatedReservation.house_id) {
        house = await prisma.house.findUnique({
          where: { id: updatedReservation.house_id }
        });
      }
      
      if (updatedReservation.worker_id) {
        worker = await prisma.worker.findUnique({
          where: { id: updatedReservation.worker_id }
        });
      }
    } catch (error) {
      console.error("Error fetching related data:", error);
    }
    
    const completeReservation = {
      ...updatedReservation,
      house: house || { name: "Bilinmiyor", id: 0 },
      worker: worker || { name: "Bilinmiyor", id: 0 }
    };

    // BigInt değerlerini normal sayılara dönüştür
    const serializedReservation = convertBigIntToNumber(completeReservation);

    return NextResponse.json(serializedReservation);
  } catch (error) {
    console.error("PUT reservation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Rezervasyonu sil
export async function DELETE(request, { params }) {
  try {
    // Admin kontrolü
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Bu işlem için admin yetkisi gereklidir" }, { status: 403 });
    }

    const paramsId = await params.id;
    const id = BigInt(paramsId);

    await prisma.reservation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE reservation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 