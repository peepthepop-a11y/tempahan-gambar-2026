import { Student, Order } from '../types';

export function exportStudentsToCsv(students: Student[], filename = 'senarai_murid_sktsp.csv') {
  const headers = ['ID Murid', 'Nama Penuh', 'Kelas', 'Tahun', 'Jantina', 'Nama Penjaga', 'Telefon Penjaga', 'Email Penjaga', 'Tarikh Daftar'];
  const rows = students.map((s) => [
    `"${s.studentNumber || s.id}"`,
    `"${s.fullName.replace(/"/g, '""')}"`,
    `"${s.className}"`,
    `"${s.year}"`,
    `"${s.gender || '-'}"`,
    `"${s.parentName.replace(/"/g, '""')}"`,
    `"${s.parentPhone}"`,
    `"${s.parentEmail || '-'}"`,
    `"${new Date(s.createdAt).toLocaleDateString('ms-MY')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
  downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;');
}

export function exportOrdersToCsv(orders: Order[], filename = 'laporan_tempahan_sktsp.csv') {
  const headers = [
    'No Tempahan',
    'Nama Murid',
    'Kelas',
    'Tahun',
    'Nama Penjaga',
    'Telefon Penjaga',
    'Pakej',
    'Harga (RM)',
    'Status Tempahan',
    'Status Bayaran',
    'Kaedah Bayaran',
    'No Rujukan / Resit',
    'Tarikh Tempahan',
  ];

  const rows = orders.map((o) => [
    `"${o.orderNumber}"`,
    `"${o.studentName.replace(/"/g, '""')}"`,
    `"${o.className}"`,
    `"${o.year}"`,
    `"${o.parentName.replace(/"/g, '""')}"`,
    `"${o.parentPhone}"`,
    `"${o.packageNameSnapshot.replace(/"/g, '""')}"`,
    o.totalAmount.toFixed(2),
    `"${o.orderStatus}"`,
    `"${o.paymentStatus}"`,
    `"${o.paymentMethod}"`,
    `"${o.paymentReference || o.paymentProofFileName || '-'}"`,
    `"${new Date(o.createdAt).toLocaleDateString('ms-MY')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
  downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;');
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface ParseCsvResult {
  validRows: Array<{
    fullName: string;
    studentNumber?: string;
    className: string;
    year: any;
    gender?: 'Lelaki' | 'Perempuan';
    parentName: string;
    parentPhone: string;
    parentEmail?: string;
  }>;
  errors: string[];
}

export function parseStudentsCsv(csvText: string, availableClasses: Array<{ id: string; name: string; year: any }>): ParseCsvResult {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const errors: string[] = [];
  const validRows: ParseCsvResult['validRows'] = [];

  if (lines.length === 0) {
    errors.push('Fail CSV kosong atau tiada baris data.');
    return { validRows, errors };
  }

  // Detect whether line 1 is a header
  const firstLine = lines[0].toLowerCase();
  const hasHeader =
    firstLine.includes('nama') ||
    firstLine.includes('name') ||
    firstLine.includes('kelas') ||
    firstLine.includes('class') ||
    firstLine.includes('student');

  const startIndex = hasHeader ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const lineIndex = i + 1;
    const rawLine = lines[i];

    // CSV row parser handling quotes and comma/tab/semicolon separators
    const separator = rawLine.includes('\t') ? '\t' : rawLine.includes(';') ? ';' : ',';
    const columns: string[] = [];
    let insideQuote = false;
    let entry = '';

    for (let c = 0; c < rawLine.length; c++) {
      const char = rawLine[c];
      if (char === '"' && (c === 0 || rawLine[c - 1] !== '\\')) {
        insideQuote = !insideQuote;
      } else if (char === separator && !insideQuote) {
        columns.push(entry.trim());
        entry = '';
      } else {
        entry += char;
      }
    }
    columns.push(entry.trim());

    const cleanCols = columns.map((col) => col.replace(/^"|"$/g, '').trim());

    // Format yang disokong:
    // Kolum 1: Nama Penuh Murid (Wajib)
    // Kolum 2: Kelas (Wajib, cth: 1 Bestari / 6 Cemerlang)
    // Kolum tambahan (Pilihan jika ada): No Murid, Jantina, dsb.
    const fullName = cleanCols[0];
    const classNameInput = cleanCols[1];
    const studentNumber = cleanCols[2] || undefined;
    const genderRaw = cleanCols[3]?.toLowerCase();
    const parentName = cleanCols[4] || 'Penjaga';
    const parentPhone = cleanCols[5] || '012-0000000';
    const parentEmail = cleanCols[6] || undefined;

    if (!fullName || fullName.length < 2) {
      errors.push(`Baris ${lineIndex}: Nama murid kosong atau terlalu pendek.`);
      continue;
    }

    if (!classNameInput) {
      errors.push(`Baris ${lineIndex}: Kelas murid "${fullName}" kosong.`);
      continue;
    }

    // Match with available classes
    const matchedClass = availableClasses.find(
      (c) =>
        c.name.toLowerCase() === classNameInput.toLowerCase() ||
        classNameInput.toLowerCase().includes(c.name.toLowerCase()) ||
        c.name.toLowerCase().replace(/\s+/g, '') === classNameInput.toLowerCase().replace(/\s+/g, '')
    );

    let year = matchedClass?.year;
    let assignedClassName = matchedClass?.name || classNameInput;

    if (!year) {
      // Guess year from class name (e.g. 1 Bestari -> Tahun 1)
      if (classNameInput.startsWith('1')) year = 'Tahun 1';
      else if (classNameInput.startsWith('2')) year = 'Tahun 2';
      else if (classNameInput.startsWith('3')) year = 'Tahun 3';
      else if (classNameInput.startsWith('4')) year = 'Tahun 4';
      else if (classNameInput.startsWith('5')) year = 'Tahun 5';
      else if (classNameInput.startsWith('6')) year = 'Tahun 6';
      else year = 'Tahun 1';
    }

    const gender: 'Lelaki' | 'Perempuan' | undefined =
      genderRaw === 'lelaki' || genderRaw === 'l'
        ? 'Lelaki'
        : genderRaw === 'perempuan' || genderRaw === 'p'
        ? 'Perempuan'
        : undefined;

    validRows.push({
      fullName: fullName.toUpperCase(),
      studentNumber,
      className: assignedClassName,
      year,
      gender,
      parentName,
      parentPhone,
      parentEmail,
    });
  }

  return { validRows, errors };
}

export function exportClassesToCsv(classes: Array<{ name: string; year: any; teacherName?: string }>, filename = 'senarai_kelas_sktsp.csv') {
  const headers = ['Nama Kelas', 'Tahun', 'Nama Guru Kelas'];
  const rows = classes.map((c) => [
    `"${c.name.replace(/"/g, '""')}"`,
    `"${c.year}"`,
    `"${(c.teacherName || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
  downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;');
}

export interface ParseClassesCsvResult {
  validRows: Array<{
    name: string;
    year: any;
    teacherName?: string;
    isActive: boolean;
  }>;
  errors: string[];
}

export function parseClassesCsv(csvText: string): ParseClassesCsvResult {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const errors: string[] = [];
  const validRows: ParseClassesCsvResult['validRows'] = [];

  if (lines.length === 0) {
    errors.push('Fail CSV kelas kosong atau tiada baris data.');
    return { validRows, errors };
  }

  // Detect whether line 1 is a header
  const firstLine = lines[0].toLowerCase();
  const hasHeader =
    firstLine.includes('kelas') ||
    firstLine.includes('class') ||
    firstLine.includes('guru') ||
    firstLine.includes('teacher') ||
    firstLine.includes('tahun') ||
    firstLine.includes('year');

  const startIndex = hasHeader ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const lineIndex = i + 1;
    const rawLine = lines[i];

    const separator = rawLine.includes('\t') ? '\t' : rawLine.includes(';') ? ';' : ',';
    const columns: string[] = [];
    let insideQuote = false;
    let entry = '';

    for (let c = 0; c < rawLine.length; c++) {
      const char = rawLine[c];
      if (char === '"' && (c === 0 || rawLine[c - 1] !== '\\')) {
        insideQuote = !insideQuote;
      } else if (char === separator && !insideQuote) {
        columns.push(entry.trim());
        entry = '';
      } else {
        entry += char;
      }
    }
    columns.push(entry.trim());

    const cleanCols = columns.map((col) => col.replace(/^"|"$/g, '').trim());

    // Format disokong:
    // Kolum 1: Nama Kelas (cth: "1 Bestari" atau "Bestari")
    // Kolum 2: Nama Guru Kelas (Pilihan) ATAU Tahun (jika 3 lajur)
    // Kolum 3: Nama Guru Kelas (jika lajur 2 ialah Tahun)
    let className = cleanCols[0];
    let col2 = cleanCols[1] || '';
    let col3 = cleanCols[2] || '';

    if (!className || className.length < 1) {
      errors.push(`Baris ${lineIndex}: Nama kelas tidak sah.`);
      continue;
    }

    let year = 'Tahun 1';
    let teacherName: string | undefined = undefined;

    // Detect if col2 looks like a Year (Tahun 1..6, Prasekolah, dsb)
    const yearPattern = /^(tahun\s*[1-6]|prasekolah|pendidikan\s*khas|[1-6])$/i;
    if (yearPattern.test(col2.trim())) {
      const match = col2.trim();
      if (/^[1-6]$/.test(match)) {
        year = `Tahun ${match}`;
      } else if (match.toLowerCase().startsWith('tahun')) {
        const digit = match.replace(/\D/g, '');
        year = digit ? `Tahun ${digit}` : 'Tahun 1';
      } else {
        year = match;
      }
      teacherName = col3 || undefined;
    } else {
      // col2 is the Teacher name!
      teacherName = col2 || undefined;
      // Auto-detect year from className (e.g. "1 Bestari" -> "Tahun 1")
      if (className.startsWith('1')) year = 'Tahun 1';
      else if (className.startsWith('2')) year = 'Tahun 2';
      else if (className.startsWith('3')) year = 'Tahun 3';
      else if (className.startsWith('4')) year = 'Tahun 4';
      else if (className.startsWith('5')) year = 'Tahun 5';
      else if (className.startsWith('6')) year = 'Tahun 6';
      else if (className.toLowerCase().includes('pra')) year = 'Prasekolah';
      else if (className.toLowerCase().includes('khas') || className.toLowerCase().includes('ppki')) year = 'Pendidikan Khas';
      else year = 'Tahun 1';
    }

    validRows.push({
      name: className,
      year,
      teacherName: teacherName ? teacherName.trim() : undefined,
      isActive: true,
    });
  }

  return { validRows, errors };
}
