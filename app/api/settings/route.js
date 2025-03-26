import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Tek bir Prisma örneği oluştur ve yeniden kullan
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Geliştirme ortamında global değişken olarak saklayarak 
  // hot reload sırasında çoklu bağlantıları engelle
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

// Varsayılan ayarlar - veritabanında kayıt yoksa kullanılacak
const defaultSettings = {
  worker_pay_amount: 7000.00,
  euro_rate: 32.50,
  created_at: new Date(),
  updated_at: new Date()
};

// BigInt değerlerini JSON için uygun formata dönüştür
function serializeSettings(settings) {
  return {
    id: typeof settings.id === 'bigint' ? Number(settings.id) : settings.id,
    worker_pay_amount: typeof settings.worker_pay_amount === 'bigint' 
      ? Number(settings.worker_pay_amount) 
      : (typeof settings.worker_pay_amount === 'string' 
        ? parseFloat(settings.worker_pay_amount) 
        : settings.worker_pay_amount),
    euro_rate: typeof settings.euro_rate === 'bigint'
      ? Number(settings.euro_rate)
      : (typeof settings.euro_rate === 'string'
        ? parseFloat(settings.euro_rate)
        : settings.euro_rate),
    created_at: settings.created_at,
    updated_at: settings.updated_at
  };
}

// Ayarları getir
export async function GET() {
  try {
    console.log("GET /api/settings çağrıldı");
    
    // Veritabanından ayarları çek - en son eklenen kaydı al
    let settings = await prisma.settings.findFirst({
      orderBy: {
        id: 'desc'
      }
    });
    
    // Eğer ayarlar yoksa, varsayılan değerleri kullan
    if (!settings) {
      console.log("Veritabanında ayar bulunamadı, varsayılan değerler kullanılıyor");
      
      // Varsayılan ayarları veritabanına kaydet
      try {
        settings = await prisma.settings.create({
          data: defaultSettings
        });
        console.log("Varsayılan ayarlar veritabanına kaydedildi", settings);
      } catch (createError) {
        console.error("Varsayılan ayarlar kaydedilemedi:", createError);
        settings = { ...defaultSettings, id: 1 };
      }
    } else {
      console.log("Veritabanından ayarlar yüklendi:", settings);
    }
    
    // BigInt değerlerini JSON olarak serileştirilebilir hale getir
    const serializedSettings = serializeSettings(settings);
    console.log("Serialized settings:", serializedSettings);
    
    return NextResponse.json(serializedSettings);
  } catch (error) {
    console.error("Settings API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Ayarları güncelle
export async function PUT(request) {
  try {
    console.log("PUT /api/settings çağrıldı");
    
    const data = await request.json();
    console.log("Gelen veri:", data);
    
    if (!data.worker_pay_amount && data.worker_pay_amount !== 0) {
      return NextResponse.json({ error: "worker_pay_amount değeri gerekli" }, { status: 400 });
    }
    
    // Sayısal değerlere çevir
    const payAmount = parseFloat(data.worker_pay_amount);
    const euroRate = data.euro_rate ? parseFloat(data.euro_rate) : undefined;
    
    if (isNaN(payAmount)) {
      return NextResponse.json({ error: "worker_pay_amount sayısal bir değer olmalı" }, { status: 400 });
    }
    
    if (euroRate !== undefined && isNaN(euroRate)) {
      return NextResponse.json({ error: "euro_rate sayısal bir değer olmalı" }, { status: 400 });
    }
    
    // Veritabanında son kaydı bul
    let settings = await prisma.settings.findFirst({
      orderBy: {
        id: 'desc'
      }
    });
    
    let updatedSettings;
    
    if (settings) {
      console.log("Mevcut ayar bulundu, güncelleniyor. ID:", settings.id);
      // Kayıt varsa güncelle
      updatedSettings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          worker_pay_amount: payAmount,
          ...(euroRate !== undefined && { euro_rate: euroRate }),
          updated_at: new Date()
        }
      });
      console.log("Ayarlar güncellendi:", updatedSettings);
    } else {
      console.log("Mevcut ayar bulunamadı, yeni kayıt oluşturuluyor");
      // Kayıt yoksa oluştur
      updatedSettings = await prisma.settings.create({
        data: {
          worker_pay_amount: payAmount,
          euro_rate: euroRate || defaultSettings.euro_rate,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      console.log("Yeni ayarlar oluşturuldu:", updatedSettings);
    }
    
    // BigInt değerlerini JSON olarak serileştirilebilir hale getir
    const serializedSettings = serializeSettings(updatedSettings);
    console.log("Serialized updated settings:", serializedSettings);
    
    return NextResponse.json(serializedSettings);
  } catch (error) {
    console.error("Update settings error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 