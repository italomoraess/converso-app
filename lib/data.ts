/* CONVERSO — dados mock compartilhados (ported from shared/data.js to typed TS).
   Cenário: um(a) autônomo(a) multi-serviço. */
import type { IconName } from '@/components/Icon';

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

import { categoryColor, stageColor } from '@/theme/tokens';

export const clientes: Cliente[] = [
  { id: 'c1', nome: 'Mariana Lopes', fone: '(11) 98842-1190', email: 'mari.lopes@gmail.com', ini: 'ML', cor: '#0EA5E9' },
  { id: 'c2', nome: 'Rafael Andrade', fone: '(11) 99710-3320', email: 'rafa.andrade@outlook.com', ini: 'RA', cor: '#8B5CF6' },
  { id: 'c3', nome: 'Studio Bloom', fone: '(11) 3045-8821', email: 'contato@studiobloom.com', ini: 'SB', cor: '#F59E0B' },
  { id: 'c4', nome: 'Camila Souza', fone: '(21) 98123-7765', email: 'camila.souza@gmail.com', ini: 'CS', cor: '#10B981' },
  { id: 'c5', nome: 'Pedro Henrique', fone: '(11) 99432-1188', email: 'ph.martins@gmail.com', ini: 'PH', cor: '#F43F5E' },
  { id: 'c6', nome: 'Ateliê Nova Casa', fone: '(11) 3322-0091', email: 'ola@novacasa.com.br', ini: 'NC', cor: '#6366F1' },
  { id: 'c7', nome: 'Beatriz Nunes', fone: '(31) 98800-4521', email: 'bia.nunes@gmail.com', ini: 'BN', cor: '#EC4899' },
];

export const servicos: Servico[] = [
  { id: 's1', nome: 'Consultoria de Marca', cat: 'Consultoria', preco: 1800, dur: '3h', status: 'ativo', cliente: 'c3', desc: 'Diagnóstico de posicionamento + entrega de guia de marca.' },
  { id: 's2', nome: 'Sessão de Fotos Produto', cat: 'Fotografia', preco: 950, dur: '2h', status: 'ativo', cliente: 'c6', desc: 'Ensaio de até 15 produtos com tratamento de imagem.' },
  { id: 's3', nome: 'Manutenção Elétrica', cat: 'Reparos', preco: 320, dur: '1h30', status: 'ativo', cliente: 'c1', desc: 'Visita técnica, diagnóstico e troca de pontos.' },
  { id: 's4', nome: 'Personal Training', cat: 'Bem-estar', preco: 120, dur: '1h', status: 'ativo', cliente: 'c4', desc: 'Treino individual com plano mensal acompanhado.' },
  { id: 's5', nome: 'Design de Apresentação', cat: 'Design', preco: 680, dur: '4h', status: 'pausado', cliente: 'c2', desc: 'Deck profissional de até 20 slides.' },
  { id: 's6', nome: 'Aula de Inglês', cat: 'Educação', preco: 90, dur: '1h', status: 'ativo', cliente: 'c5', desc: 'Conversação 1:1 online, foco em negócios.' },
  { id: 's7', nome: 'Diária de Limpeza', cat: 'Reparos', preco: 180, dur: '6h', status: 'rascunho', cliente: 'c7', desc: 'Limpeza completa residencial.' },
];

// re-export the category color map for convenience
export const catColor = categoryColor;

export const etapas: Etapa[] = [
  { id: 'lead', nome: 'Lead', cor: stageColor.lead },
  { id: 'contato', nome: 'Contato', cor: stageColor.contato },
  { id: 'prop', nome: 'Proposta', cor: stageColor.prop },
  { id: 'nego', nome: 'Negociação', cor: stageColor.nego },
  { id: 'ganho', nome: 'Fechado', cor: stageColor.ganho },
];

export const negocios: Negocio[] = [
  { id: 'd1', titulo: 'Rebrand completo', cliente: 'c3', valor: 4200, etapa: 'nego', dias: 2, servico: 'Consultoria de Marca' },
  { id: 'd2', titulo: 'Catálogo verão', cliente: 'c6', valor: 2850, etapa: 'prop', dias: 1, servico: 'Sessão de Fotos Produto' },
  { id: 'd3', titulo: 'Pacote treino trimestral', cliente: 'c4', valor: 1080, etapa: 'ganho', dias: 0, servico: 'Personal Training' },
  { id: 'd4', titulo: 'Reforma elétrica loja', cliente: 'c1', valor: 1600, etapa: 'contato', dias: 4, servico: 'Manutenção Elétrica' },
  { id: 'd5', titulo: 'Curso intensivo', cliente: 'c5', valor: 720, etapa: 'lead', dias: 6, servico: 'Aula de Inglês' },
  { id: 'd6', titulo: 'Deck investidores', cliente: 'c2', valor: 1360, etapa: 'prop', dias: 3, servico: 'Design de Apresentação' },
  { id: 'd7', titulo: 'Ensaio institucional', cliente: 'c7', valor: 1900, etapa: 'lead', dias: 5, servico: 'Sessão de Fotos Produto' },
  { id: 'd8', titulo: 'Mentoria de marca', cliente: 'c3', valor: 980, etapa: 'contato', dias: 2, servico: 'Consultoria de Marca' },
  { id: 'd9', titulo: 'Plano anual treino', cliente: 'c4', valor: 3200, etapa: 'nego', dias: 1, servico: 'Personal Training' },
];

export const agenda: Evento[] = [
  { id: 'a1', dia: 4, hora: '09:00', dur: 90, titulo: 'Consultoria — Studio Bloom', cliente: 'c3', tipo: 'Consultoria', status: 'confirmado' },
  { id: 'a2', dia: 4, hora: '14:30', dur: 60, titulo: 'Personal — Camila', cliente: 'c4', tipo: 'Bem-estar', status: 'confirmado' },
  { id: 'a3', dia: 5, hora: '10:00', dur: 120, titulo: 'Fotos — Nova Casa', cliente: 'c6', tipo: 'Fotografia', status: 'pendente' },
  { id: 'a4', dia: 9, hora: '08:00', dur: 60, titulo: 'Aula inglês — Pedro', cliente: 'c5', tipo: 'Educação', status: 'confirmado' },
  { id: 'a5', dia: 11, hora: '15:00', dur: 90, titulo: 'Elétrica — Mariana', cliente: 'c1', tipo: 'Reparos', status: 'confirmado' },
  { id: 'a6', dia: 12, hora: '11:00', dur: 60, titulo: 'Reunião proposta — Rafael', cliente: 'c2', tipo: 'Consultoria', status: 'pendente' },
  { id: 'a7', dia: 18, hora: '09:30', dur: 120, titulo: 'Ensaio — Beatriz', cliente: 'c7', tipo: 'Fotografia', status: 'confirmado' },
  { id: 'a8', dia: 18, hora: '16:00', dur: 60, titulo: 'Personal — Camila', cliente: 'c4', tipo: 'Bem-estar', status: 'confirmado' },
  { id: 'a9', dia: 23, hora: '10:00', dur: 90, titulo: 'Consultoria — Studio Bloom', cliente: 'c3', tipo: 'Consultoria', status: 'confirmado' },
  { id: 'a10', dia: 25, hora: '14:00', dur: 60, titulo: 'Aula inglês — Pedro', cliente: 'c5', tipo: 'Educação', status: 'confirmado' },
];

export const kpis: Kpis = {
  receitaMes: 8740,
  receitaMeta: 12000,
  receitaDelta: 18,
  aReceber: 3260,
  servicosAtivos: 5,
  negociosAbertos: 6,
  taxaConversao: 42,
  novosClientes: 3,
  agendaHoje: 2,
};

// Sparkline receita últimos 7 dias
export const sparkReceita: number[] = [320, 0, 950, 540, 120, 1800, 410];

// Receita por mês (6 meses)
export const receitaMeses: { m: string; v: number }[] = [
  { m: 'Jan', v: 6200 },
  { m: 'Fev', v: 7100 },
  { m: 'Mar', v: 5800 },
  { m: 'Abr', v: 9300 },
  { m: 'Mai', v: 8100 },
  { m: 'Jun', v: 8740 },
];

export const user: Usuario = {
  nome: 'Júlia Mendes',
  papel: 'Designer & Consultora',
  email: 'julia.mendes@converso.app',
  ini: 'JM',
  fone: '(11) 98765-4321',
  cidade: 'São Paulo, SP',
  plano: 'Profissional',
};

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

export function clienteById(id: string): Cliente | { nome: string; ini: string; cor: string } {
  return clientes.find((c) => c.id === id) || { nome: '—', ini: '?', cor: '#999' };
}

export function fmtBRL(n: number): string {
  return 'R$ ' + n.toLocaleString('pt-BR');
}
