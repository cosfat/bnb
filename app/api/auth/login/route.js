import { NextResponse } from "next/server";
import { loginWorker } from "../../../lib/auth/auth";
import { convertBigIntToNumber } from "../../../lib/helpers";

export async function POST(request) {
  try {
    console.log("Login API called");
    
    const body = await request.json();
    console.log("Request body:", body);
    
    const { name, password } = body;
    
    if (!name || !password) {
      console.log("Missing credentials in request");
      return NextResponse.json(
        { error: "Kullanıcı adı ve şifre gereklidir" }, 
        { status: 400 }
      );
    }
    
    const result = await loginWorker(name, password);
    console.log("Login result:", result);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message }, 
        { status: 401 }
      );
    }
    
    // İşlem başarılı, kullanıcı bigints temizlenmiş haliyle döndürülüyor
    const serializedWorker = convertBigIntToNumber(result.worker);
    console.log("Serialized worker:", serializedWorker);
    
    // Oturum bilgisiyle birlikte döndür
    return NextResponse.json({
      success: true,
      worker: serializedWorker
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Giriş işlemi sırasında bir hata oluştu: " + error.message }, 
      { status: 500 }
    );
  }
} 