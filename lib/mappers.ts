/* CONVERSO Mobile — mapeamento entre o domínio do layout (PT-BR) e o wire da crm-api. */
import type { Cliente, Negocio, Servico, Evento, EtapaId } from './data';

export type ApiStage = 'novo' | 'contatado' | 'proposta' | 'negociando' | 'fechado' | 'perdido';

const STAGE_TO_API: Record<EtapaId, ApiStage> = {
  lead: 'novo',
  contato: 'contatado',
  prop: 'proposta',
  nego: 'negociando',
  ganho: 'fechado',
};
const API_TO_STAGE: Record<ApiStage, EtapaId> = {
  novo: 'lead',
  contatado: 'contato',
  proposta: 'prop',
  negociando: 'nego',
  fechado: 'ganho',
  perdido: 'ganho',
};
export const stageToApi = (s: EtapaId): ApiStage => STAGE_TO_API[s];
export const stageFromApi = (s: string): EtapaId => API_TO_STAGE[s as ApiStage] ?? 'lead';

const initials = (name: string) =>
  (name || '').split(' ').map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?';
const PALETTE = ['#0EA5E9', '#8B5CF6', '#F59E0B', '#10B981', '#F43F5E', '#6366F1', '#EC4899'];
const colorFor = (id: string) => PALETTE[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length];

export interface ApiLead {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  funnelStage: string;
  dealValue?: string | number | null;
  observations?: string | null;
}

export function leadToCliente(l: ApiLead): Cliente {
  return { id: l.id, nome: l.name, fone: l.phone, email: l.email ?? '', ini: initials(l.name), cor: colorFor(l.id) };
}
export function leadToNegocio(l: ApiLead): Negocio {
  return {
    id: l.id,
    titulo: l.name,
    cliente: l.id,
    valor: Number(l.dealValue ?? 0),
    etapa: stageFromApi(l.funnelStage),
    dias: 0,
    servico: l.observations ?? '',
  };
}

export interface ApiProduct {
  id: string;
  name: string;
  price: string | number;
  durationDays?: number | null;
  duration?: string | null;
  description?: string | null;
  status?: 'ativo' | 'pausado' | 'rascunho' | null;
  category?: { id: string; name: string } | null;
}
export function productToServico(p: ApiProduct): Servico {
  return {
    id: p.id,
    nome: p.name,
    cat: p.category?.name ?? 'Consultoria',
    preco: Number(p.price),
    dur: p.duration ?? (p.durationDays ? `${p.durationDays}d` : '1h'),
    status: p.status ?? 'ativo',
    cliente: '',
    desc: p.description ?? '',
  };
}
export function servicoToProductBody(s: Partial<Servico> & { categoryId?: string }) {
  return {
    name: s.nome,
    price: typeof s.preco === 'string' ? parseFloat(s.preco) : s.preco,
    duration: s.dur,
    description: s.desc,
    status: s.status,
    categoryId: s.categoryId,
  };
}

export interface ApiAppointment {
  id: string;
  title: string;
  date: string;
  startTime?: string | null;
  durationMinutes?: number | null;
  serviceCategory?: string | null;
  completed?: boolean;
  type?: string;
  leadId?: string | null;
}
export function eventoToAppointmentBody(ev: Omit<Evento, 'id'>, year: number, month: number) {
  const dd = String(ev.dia).padStart(2, '0');
  const mm = String(month + 1).padStart(2, '0');
  return {
    title: ev.titulo,
    date: `${year}-${mm}-${dd}`,
    startTime: ev.hora,
    durationMinutes: ev.dur,
    serviceCategory: ev.tipo,
    leadId: ev.cliente || undefined,
  };
}
export function appointmentToEvento(a: ApiAppointment): Evento {
  const day = Number(a.date.slice(8, 10)) || new Date(a.date).getUTCDate();
  return {
    id: a.id,
    dia: day,
    hora: a.startTime ?? '09:00',
    dur: a.durationMinutes ?? 60,
    titulo: a.title,
    cliente: a.leadId ?? '',
    tipo: a.serviceCategory ?? a.type ?? 'Consultoria',
    status: a.completed ? 'confirmado' : 'pendente',
  };
}
