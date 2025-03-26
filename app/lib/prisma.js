import { PrismaClient } from '@prisma/client';

// Prisma istemcisinin global olarak tanımlanması
const globalForPrisma = global;

// Development ortamında her sıcak yeniden yükleme sırasında birden fazla Prisma istemcisi oluşmasını önlemek için
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  globalForPrisma.prisma = prisma;
}

export default prisma; 