export interface Session {
  id: string;
  title: string;
  description: string;
  category: SessionCategory;
  city: string;
  dateTime: Date;
  status: SessionStatus;
  imageUrl?: string;
  createdBy: string;
}

export type SessionCategory = 'Formación' | 'Reunión' | 'Demo' | 'Workshop' | 'Conferencia';
export type SessionStatus = 'borrador' | 'bloqueado' | 'oculto' | 'publicado';

export interface SessionFilter {
  category?: SessionCategory;
  status?: SessionStatus;
  searchTerm?: string;
}
