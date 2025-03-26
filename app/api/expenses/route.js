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

// Tüm giderleri getir
export async function GET() {
  try {
    console.log("Expenses API called");
    
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
      console.log("Checking expense model:", prisma.expense);
      
      const expenses = await prisma.expense.findMany({
        orderBy: {
          created_at: "desc",
        }
      });
      console.log("Expenses fetched:", expenses.length);
      
      // İlave bilgiler için ayrı sorgular yap
      const enhancedExpenses = await Promise.all(expenses.map(async (expense) => {
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
        
        return {
          ...expense,
          house: house || { name: "Bilinmiyor", id: 0 },
          category: category || { name: "Bilinmiyor", id: 0 },
          worker: worker || { name: "Bilinmiyor", id: 0 }
        };
      }));
      
      // BigInt değerlerini normal sayılara dönüştür
      const serializedExpenses = convertBigIntToNumber(enhancedExpenses);
      
      return NextResponse.json(serializedExpenses);
    } catch (queryError) {
      console.error("Query error:", queryError);
      return NextResponse.json({ error: "Query error: " + queryError.message }, { status: 500 });
    }
  } catch (error) {
    console.error("General error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Yeni gider ekle
export async function POST(request) {
  try {
    // Admin kontrolü
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Bu işlem için admin yetkisi gereklidir" }, { status: 403 });
    }

    const data = await request.json();
    
    console.log("Creating expense with data:", data);
    
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
    
    const expense = await prisma.expense.create({
      data: {
        name: data.name,
        price: price,
        house_id: BigInt(data.house_id),
        category_id: BigInt(data.category_id),
        worker_id: BigInt(data.worker_id),
        created_at: data.created_at ? new Date(data.created_at) : new Date()
      }
    });
    
    console.log("Expense created:", expense);
    
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
    
    return NextResponse.json(serializedExpense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 