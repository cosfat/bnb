import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { convertBigIntToNumber } from "../../../lib/helpers";

// Belirli bir evi getir
export async function GET(request, { params }) {
  try {
    const id = BigInt(params.id);
    
    const house = await prisma.house.findUnique({
      where: { id },
      include: {
        expenses: true,
        reservations: true,
      },
    });

    if (!house) {
      return NextResponse.json({ error: "Ev bulunamadı" }, { status: 404 });
    }

    // BigInt değerlerini normal sayılara dönüştür
    const serializedHouse = convertBigIntToNumber(house);

    return NextResponse.json(serializedHouse);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Evi güncelle
export async function PUT(request, { params }) {
  try {
    const id = BigInt(params.id);
    const data = await request.json();

    const updatedHouse = await prisma.house.update({
      where: { id },
      data: {
        name: data.name,
      },
    });

    // BigInt değerlerini normal sayılara dönüştür
    const serializedHouse = convertBigIntToNumber(updatedHouse);

    return NextResponse.json(serializedHouse);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Evi sil
export async function DELETE(request, { params }) {
  try {
    const id = BigInt(params.id);

    // İlişkili verileri kontrol et
    const hasReservations = await prisma.reservation.findFirst({
      where: { house_id: id },
    });

    const hasExpenses = await prisma.expense.findFirst({
      where: { house_id: id },
    });

    if (hasReservations || hasExpenses) {
      return NextResponse.json(
        { error: "Bu eve ait rezervasyonlar veya giderler bulunduğu için silinemez" },
        { status: 400 }
      );
    }

    await prisma.house.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 