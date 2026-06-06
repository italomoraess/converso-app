/* CONVERSO Mobile — service layer over crm-api. */
import { api, setTokens } from './api';
import {
  leadToCliente,
  leadToNegocio,
  productToServico,
  appointmentToEvento,
  eventoToAppointmentBody,
  servicoToProductBody,
  stageToApi,
  type ApiLead,
  type ApiProduct,
  type ApiAppointment,
} from './mappers';
import type { EtapaId, Servico, Evento } from './data';

export interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  plan?: string;
  role?: string;
  /** false quando o trial acabou e não há assinatura ativa. */
  hasAccess?: boolean;
}
export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user?: UserProfile;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResult> {
    const { data } = await api.post<AuthResult>('/auth/login', { email, password });
    await setTokens(data.accessToken, data.refreshToken);
    return data;
  },
  async register(body: { name: string; email: string; password: string; phone?: string }): Promise<AuthResult> {
    const { data } = await api.post<AuthResult>('/auth/register', body);
    await setTokens(data.accessToken, data.refreshToken);
    return data;
  },
  async me(): Promise<UserProfile> {
    const { data } = await api.get<UserProfile>('/auth/me');
    return data;
  },
};

export const leadsService = {
  async list() {
    const { data } = await api.get<ApiLead[]>('/leads');
    return data;
  },
  async moveStage(id: string, stage: EtapaId) {
    const { data } = await api.patch<ApiLead>(`/leads/${id}/stage`, { funnelStage: stageToApi(stage) });
    return leadToNegocio(data);
  },
};

export const catalogService = {
  async list() {
    const { data } = await api.get<ApiProduct[]>('/catalog/products');
    return data.map(productToServico);
  },
  async ensureCategory(name: string): Promise<string> {
    const { data } = await api.get<{ id: string; name: string }[]>('/catalog/categories');
    const found = data.find((c) => c.name === name);
    if (found) return found.id;
    const created = await api.post<{ id: string }>('/catalog/categories', { name });
    return created.data.id;
  },
  async create(s: Servico) {
    const categoryId = await catalogService.ensureCategory(s.cat);
    const { data } = await api.post<ApiProduct>('/catalog/products', servicoToProductBody({ ...s, categoryId }));
    return productToServico(data);
  },
  async update(id: string, s: Servico) {
    const categoryId = await catalogService.ensureCategory(s.cat);
    const { data } = await api.patch<ApiProduct>(`/catalog/products/${id}`, servicoToProductBody({ ...s, categoryId }));
    return productToServico(data);
  },
  async remove(id: string) {
    await api.delete(`/catalog/products/${id}`);
  },
};

export const agendaService = {
  async list() {
    const { data } = await api.get<ApiAppointment[]>('/appointments');
    return data.map(appointmentToEvento);
  },
  async create(ev: Omit<Evento, 'id'>, year: number, month: number) {
    const { data } = await api.post<ApiAppointment>('/appointments', eventoToAppointmentBody(ev, year, month));
    return appointmentToEvento(data);
  },
};

export interface DashboardKpis {
  receitaMes: number;
  receitaMeta: number;
  receitaDelta: number;
  aReceber: number;
  servicosAtivos: number;
  negociosAbertos: number;
  taxaConversao: number;
  novosClientes: number;
  agendaHoje: number;
}
export interface DashboardData {
  kpis: DashboardKpis;
  receitaMeses: { m: string; v: number }[];
  sparkReceita: number[];
}
export const reportsService = {
  async dashboard(): Promise<DashboardData> {
    const { data } = await api.get<DashboardData>('/reports/dashboard');
    return data;
  },
};
