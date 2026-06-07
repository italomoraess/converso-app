/* CONVERSO — tipos de domínio + constantes de UI (cores, status, formatação).
   Os dados são carregados da crm-api (ver lib/services + lib/store);
   este arquivo não contém mais dados de exemplo. */
import type { IconName } from '@/components/Icon';
import { categoryColor, stageColor } from '@/theme/tokens';

export type Cliente = {
  id: string;
  nome: string;
  fone: string;
  email: string;
  ini: string;
  cor: string;
};

export type ServiceStatus = 'ativo' | 'pausado' | 'rascunho';

export type Servico = {
  id: string;
  nome: string;
  cat: string;
  preco: number;
  dur: string;
  status: ServiceStatus;
  cliente: string;
  desc: string;
};

export type EtapaId = 'lead' | 'contato' | 'prop' | 'nego' | 'ganho';

export type Etapa = {
  id: EtapaId;
  nome: string;
  cor: string;
};

export type Negocio = {
  id: string;
  titulo: string;
  cliente: string;
  valor: number;
  etapa: EtapaId;
  dias: number;
  servico: string;
};

export type AgendaStatus = 'confirmado' | 'pendente';

export type Evento = {
  id: string;
  dia: number;
  hora: string;
  dur: number;
  titulo: string;
  cliente: string;
  tipo: string;
  status: AgendaStatus;
};

export type Kpis = {
  receitaMes: number;
  receitaMeta: number;
  receitaDelta: number;
  aReceber: number;
  servicosAtivos: number;
  negociosAbertos: number;
  taxaConversao: number;
  novosClientes: number;
  agendaHoje: number;
};

export type Usuario = {
  nome: string;
  papel: string;
  email: string;
  ini: string;
  fone: string;
  cidade: string;
  plano: string;
};

// re-export the category color map for convenience
export const catColor = categoryColor;

export const etapas: Etapa[] = [
  { id: 'lead', nome: 'Lead', cor: stageColor.lead },
  { id: 'contato', nome: 'Contato', cor: stageColor.contato },
  { id: 'prop', nome: 'Proposta', cor: stageColor.prop },
  { id: 'nego', nome: 'Negociação', cor: stageColor.nego },
  { id: 'ganho', nome: 'Fechado', cor: stageColor.ganho },
];

export const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const catIconMap: Record<string, IconName> = {
  Consultoria: 'sparkle',
  Fotografia: 'camera',
  Reparos: 'settings',
  'Bem-estar': 'target',
  Design: 'grid',
  Educação: 'star',
};

export const STATUS_META: Record<ServiceStatus, { label: string; cor: string }> = {
  ativo: { label: 'Ativo', cor: '#059669' },
  pausado: { label: 'Pausado', cor: '#D97706' },
  rascunho: { label: 'Rascunho', cor: '#6B7393' },
};

export function catIcon(cat: string): IconName {
  return catIconMap[cat] || 'tag';
}

export function fmtBRL(n: number): string {
  return 'R$ ' + n.toLocaleString('pt-BR');
}
