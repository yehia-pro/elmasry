/**
 * Helper to parse and validate Egyptian 14-digit National IDs
 */

const GOVERNORATES_MAP: Record<string, string> = {
  '01': 'القاهرة',
  '02': 'الإسكندرية',
  '03': 'بورسعيد',
  '04': 'السويس',
  '11': 'دمياط',
  '12': 'الدقهلية',
  '13': 'الشرقية',
  '14': 'القليوبية',
  '15': 'كفر الشيخ',
  '16': 'الغربية',
  '17': 'المنوفية',
  '18': 'البحيرة',
  '19': 'الإسماعيلية',
  '21': 'الجيزة',
  '22': 'بني سويف',
  '23': 'الفيوم',
  '24': 'المنيا',
  '25': 'أسيوط',
  '26': 'سوهاج',
  '27': 'قنا',
  '28': 'أسوان',
  '29': 'الأقصر',
  '31': 'البحر الأحمر',
  '32': 'الوادي الجديد',
  '33': 'مطروح',
  '34': 'شمال سيناء',
  '35': 'جنوب سيناء',
  '88': 'خارج الجمهورية',
};

export interface ParsedNationalId {
  isValid: boolean;
  birthDate?: string; // YYYY-MM-DD
  governorate?: string;
  gender?: 'ذكر' | 'أنثى';
  error?: string;
}

export function parseEgyptianNationalId(id: string): ParsedNationalId {
  if (!id || typeof id !== 'string') {
    return { isValid: false, error: 'الرقم القومي مطلوب' };
  }

  const cleanId = id.trim();
  if (!/^\d{14}$/.test(cleanId)) {
    return { isValid: false, error: 'الرقم القومي يجب أن يتكون من 14 رقماً' };
  }

  const centuryDigit = parseInt(cleanId[0], 10);
  if (centuryDigit !== 2 && centuryDigit !== 3) {
    return { isValid: false, error: 'الرقم القومي غير صالح (خانة القرن غير صحيحة)' };
  }

  const century = centuryDigit === 2 ? 1900 : 2000;
  const year = century + parseInt(cleanId.substring(1, 3), 10);
  const month = parseInt(cleanId.substring(3, 5), 10);
  const day = parseInt(cleanId.substring(5, 7), 10);

  if (month < 1 || month > 12) {
    return { isValid: false, error: 'تاريخ الميلاد في الرقم القومي غير صالح (الشهر غير صحيح)' };
  }

  if (day < 1 || day > 31) {
    return { isValid: false, error: 'تاريخ الميلاد في الرقم القومي غير صالح (اليوم غير صحيح)' };
  }

  const formattedMonth = month.toString().padStart(2, '0');
  const formattedDay = day.toString().padStart(2, '0');
  const birthDate = `${year}-${formattedMonth}-${formattedDay}`;

  const govCode = cleanId.substring(7, 9);
  const governorate = GOVERNORATES_MAP[govCode] || 'أخرى';

  const genderDigit = parseInt(cleanId[12], 10);
  const gender = genderDigit % 2 === 1 ? 'ذكر' : 'أنثى';

  return {
    isValid: true,
    birthDate,
    governorate,
    gender,
  };
}
