import * as XLSX from 'xlsx';
import { ProfessorData, EXCEL_COLUMN_MAPPINGS } from '@/types/professor';

function normalizeColumnName(name: string): string {
  return name.toLowerCase().trim();
}

function findColumnIndex(headers: string[], searchTerms: string[]): number {
  const normalizedHeaders = headers.map(normalizeColumnName);

  for (const term of searchTerms) {
    const normalizedTerm = normalizeColumnName(term);
    const index = normalizedHeaders.findIndex(h =>
      h === normalizedTerm || h.includes(normalizedTerm) || normalizedTerm.includes(h)
    );
    if (index !== -1) return index;
  }
  return -1;
}

export function parseExcelFile(file: File): Promise<ProfessorData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as string[][];

        if (jsonData.length < 2) {
          reject(new Error('Excel file must have at least a header row and one data row'));
          return;
        }

        const headers = jsonData[0].map(h => String(h || ''));

        // Find column indices
        const columnIndices = {
          firstName: findColumnIndex(headers, [EXCEL_COLUMN_MAPPINGS.firstName, 'first name', 'firstname', 'name - first']),
          lastName: findColumnIndex(headers, [EXCEL_COLUMN_MAPPINGS.lastName, 'last name', 'lastname', 'name - last']),
          email: findColumnIndex(headers, [EXCEL_COLUMN_MAPPINGS.email, 'email', 'your email']),
          semester: findColumnIndex(headers, [EXCEL_COLUMN_MAPPINGS.semester, 'semester', 'which semester']),
          officeLocation: findColumnIndex(headers, [EXCEL_COLUMN_MAPPINGS.officeLocation, 'office', 'building', 'room', 'location']),
          officeHours: findColumnIndex(headers, [EXCEL_COLUMN_MAPPINGS.officeHours, 'office hours', 'hours', 'declare your office hours']),
          meetingLink: findColumnIndex(headers, [EXCEL_COLUMN_MAPPINGS.meetingLink, 'meeting link', 'online link', 'link']),
          byAppointment: findColumnIndex(headers, [EXCEL_COLUMN_MAPPINGS.byAppointment, 'appointment', 'by appointment']),
        };

        // Parse data rows
        const professors: ProfessorData[] = [];

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];

          // Skip empty rows
          if (!row || row.every(cell => !cell || String(cell).trim() === '')) {
            continue;
          }

          const getValue = (index: number): string => {
            if (index === -1 || !row[index]) return '';
            return String(row[index]).trim();
          };

          const getBoolean = (index: number): boolean => {
            if (index === -1 || !row[index]) return false;
            const value = String(row[index]).toLowerCase().trim();
            return value === 'yes' || value === 'true' || value === 'checked' || value === '1' || value === 'x' || value === '✓';
          };

          const professor: ProfessorData = {
            id: crypto.randomUUID(),
            firstName: getValue(columnIndices.firstName),
            lastName: getValue(columnIndices.lastName),
            email: getValue(columnIndices.email),
            semester: getValue(columnIndices.semester),
            officeLocation: getValue(columnIndices.officeLocation),
            officeHours: getValue(columnIndices.officeHours),
            meetingLink: getValue(columnIndices.meetingLink),
            byAppointment: getBoolean(columnIndices.byAppointment),
          };

          // Only add if we have at least a name
          if (professor.firstName || professor.lastName) {
            professors.push(professor);
          }
        }

        if (professors.length === 0) {
          reject(new Error('No valid professor data found in the Excel file'));
          return;
        }

        resolve(professors);
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
}
