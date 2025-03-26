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

// Belirli bir gideri getir
export async function GET(request, { params }) {
  try {
    const paramsId = await params.id;
    const id = BigInt(paramsId);
    
    const expense = await prisma.expense.findUnique({
      where: { id }
    });

    if (!expense) {
      return NextResponse.json({ error: "Gider bulunamadı" }, { status: 404 });
    }
    
    // İlgili bilgileri ayrı olarak al
    let house = null;
    let category = null;
    let worker = null;
    
    try {
      if (expense.house_id) {
        house = await prisma.house.findUnique({
          where: { id: expense.house_id }
        });
      }
      
      if (expense.category_id) {
        category = await prisma.category.findUnique({
          where: { id: expense.category_id }
        });
      }
      
      if (expense.worker_id) {
        worker = await prisma.worker.findUnique({
          where: { id: expense.worker_id }
        });
      }
    } catch (error) {
      console.error("Error fetching related data:", error);
    }
    
    const completeExpense = {
      ...expense,
      house: house || { name: "Bilinmiyor", id: 0 },
      category: category || { name: "Bilinmiyor", id: 0 },
      worker: worker || { name: "Bilinmiyor", id: 0 }
    };

    // BigInt değerlerini normal sayılara dönüştür
    const serializedExpense = convertBigIntToNumber(completeExpense);

    return NextResponse.json(serializedExpense);
  } catch (error) {
    console.error("GET expense error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Gideri güncelle
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

    console.log("Updating expense with data:", data);

    // Fiyat değerini kontrol et ve sınırla (MySQL'in DECIMAL sınırları içinde)
    let price = parseFloat(data.price);
    if (isNaN(price)) {
      return NextResponse.json({ error: "Geçersiz fiyat değeri" }, { status: 400 });
    }
    
    // Maksimum değeri 999999.99 olarak sınırla
    if (price > 999999.99) {
      price = 999999.99;
      console.log("Price value was limited to maximum allowed: 999999.99");
    }

    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        name: data.name,
        price: price,
        house_id: BigInt(data.house_id),
        category_id: BigInt(data.category_id),
        worker_id: BigInt(data.worker_id),
        created_at: data.created_at ? new Date(data.created_at) : undefined
      }
    });
    
    console.log("Expense updated:", updatedExpense);
    
    // İlgili bilgileri ayrı olarak al
    let house = null;
    let category = null;
    let worker = null;
    
    try {
      if (updatedExpense.house_id) {
        house = await prisma.house.findUnique({
          where: { id: updatedExpense.house_id }
        });
      }
      
      if (updatedExpense.category_id) {
        category = await prisma.category.findUnique({
          where: { id: updatedExpense.category_id }
        });
      }
      
      if (updatedExpense.worker_id) {
        worker = await prisma.worker.findUnique({
          where: { id: updatedExpense.worker_id }
        });
      }
    } catch (error) {
      console.error("Error fetching related data:", error);
    }
    
    const completeExpense = {
      ...updatedExpense,
      house: house || { name: "Bilinmiyor", id: 0 },
      category: category || { name: "Bilinmiyor", id: 0 },
      worker: worker || { name: "Bilinmiyor", id: 0 }
    };

    // BigInt değerlerini normal sayılara dönüştür
    const serializedExpense = convertBigIntToNumber(completeExpense);

    return NextResponse.json(serializedExpense);
  } catch (error) {
    console.error("PUT expense error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Gideri sil
export async function DELETE(request, { params }) {
  try {
    // Admin kontrolü
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Bu işlem için admin yetkisi gereklidir" }, { status: 403 });
    }

    const paramsId = await params.id;
    const id = BigInt(paramsId);

    await prisma.expense.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE expense error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 