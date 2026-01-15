export interface ProfessorData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  semester: string;
  officeLocation: string;
  officeHours: string;
  meetingLink?: string;
  byAppointment: boolean;
}

export interface EditableProfessorData extends ProfessorData {
  isEditing?: boolean;
}

export const EXCEL_COLUMN_MAPPINGS = {
  firstName: 'Name - First',
  lastName: 'Name - Last',
  email: 'Email',
  semester: 'For which semester you are declaring Office Hours?',
  officeLocation: 'Where is your office (building and room number)? If you don\'t have an office, specify the place where the Office Hours will be held',
  officeHours: 'Please declare your Office Hours. If any timeframe is offered online, please specify so in parenthesis (Online)',
  meetingLink: 'Meeting link for Online Office hours (Optional)',
  byAppointment: 'I will also offer Office Hours by appointment -- Check the box below if you also will offer Office Hours by appointment',
} as const;

export function createEmptyProfessor(): ProfessorData {
  return {
    id: crypto.randomUUID(),
    firstName: '',
    lastName: '',
    email: '',
    semester: '',
    officeLocation: '',
    officeHours: '',
    meetingLink: '',
    byAppointment: false,
  };
}
