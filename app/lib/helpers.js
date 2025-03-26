/**
 * BigInt değerlerini normal sayılara dönüştüren yardımcı fonksiyon
 * Prisma'dan dönen BigInt ID'leri normal sayılara dönüştürmek için kullanılır
 */
export function convertBigIntToNumber(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (typeof value === "bigint") {
        return Number(value);
      }
      return value;
    })
  );
} 