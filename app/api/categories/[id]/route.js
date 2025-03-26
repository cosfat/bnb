import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { convertBigIntToNumber } from "../../../lib/helpers";

// Belirli bir kategoriyi getir
export async function GET(request, { params }) {
  try {
    const id = BigInt(params.id);
    
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        expenses: true,
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Kategori bulunamadı" }, { status: 404 });
    }

    // BigInt değerlerini normal sayılara dönüştür
    const serializedCategory = convertBigIntToNumber(category);

    return NextResponse.json(serializedCategory);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Kategoriyi güncelle
export async function PUT(request, { params }) {
  try {
    const id = BigInt(params.id);
    const data = await request.json();

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
      },
    });

    // BigInt değerlerini normal sayılara dönüştür
    const serializedCategory = convertBigIntToNumber(updatedCategory);

    return NextResponse.json(serializedCategory);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Kategoriyi sil
export async function DELETE(request, { params }) {
  try {
    const id = BigInt(params.id);

    // İlişkili giderleri kontrol et
    const hasExpenses = await prisma.expense.findFirst({
      where: { category_id: id },
    });

    if (hasExpenses) {
      return NextResponse.json(
        { error: "Bu kategoriye ait giderler bulunduğu için silinemez" },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 