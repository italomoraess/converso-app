/* CONVERSO Mobile — data store (context) backed by the crm-api service layer.
   Loads real data after login; exposes collections + mutators to the screens. */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  type Cliente,
  type Servico,
  type Negocio,
  type Evento,
  type Usuario,
  type EtapaId,
} from './data';
import { getToken } from './api';
import {
  authService,
  leadsService,
  catalogService,
  agendaService,
  reportsService,
  type DashboardKpis,
} from './services';
import { leadToCliente, leadToNegocio } from './mappers';

const EMPTY_KPIS: DashboardKpis = {
  receitaMes: 0, receitaMeta: 5000, receitaDelta: 0, aReceber: 0,
  servicosAtivos: 0, negociosAbertos: 0, taxaConversao: 0, novosClientes: 0, agendaHoje: 0,
};

const EMPTY_USER: Usuario = { nome: '', papel: '', email: '', ini: '', fone: '', cidade: '', plano: '' };

interface DataCtx {
  loading: boolean;
  hasAccess: boolean;
  clientes: Cliente[];
  servicos: Servico[];
  negocios: Negocio[];
  agenda: Evento[];
  kpis: DashboardKpis;
  sparkReceita: number[];
  receitaMeses: { m: string; v: number }[];
  user: Usuario;
  clienteById: (id: string) => Cliente | { nome: string; ini: string; cor: string };
  reload: () => Promise<void>;
  saveService: (f: Servico) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  moveDeal: (id: string, etapa: EtapaId) => void;
  addEvent: (ev: Omit<Evento, 'id'>) => Promise<void>;
  updateProfile: (p: { nome?: string; fone?: string; cidade?: string }) => Promise<void>;
}

const initials = (s: string) =>
  s.split(' ').map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?';

const Ctx = createContext<DataCtx | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(true);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [agenda, setAgenda] = useState<Evento[]>([]);
  const [kpis, setKpis] = useState<DashboardKpis>(EMPTY_KPIS);
  const [sparkReceita, setSpark] = useState<number[]>([]);
  const [receitaMeses, setMeses] = useState<{ m: string; v: number }[]>([]);
  const [user, setUser] = useState<Usuario>(EMPTY_USER);

  const reload = useCallback(async () => {
    if (!(await getToken())) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [profile, leads, svc, ag, dash] = await Promise.all([
        authService.me().catch(() => null),
        leadsService.list().catch(() => []),
        catalogService.list().catch(() => []),
        agendaService.list().catch(() => []),
        reportsService.dashboard().catch(() => null),
      ]);
      if (profile) {
        setHasAccess(profile.hasAccess !== false);
        setUser({
          nome: profile.name ?? profile.email,
          papel: 'Autônomo',
          email: profile.email,
          ini: initials(profile.name ?? profile.email),
          fone: profile.phone ?? '',
          cidade: profile.city ?? '',
          plano: profile.plan ?? 'Profissional',
        });
      }
      setClientes(leads.map(leadToCliente));
      setNegocios(leads.map(leadToNegocio));
      setServicos(svc);
      setAgenda(ag);
      if (dash) {
        setKpis(dash.kpis);
        setSpark(dash.sparkReceita);
        setMeses(dash.receitaMeses);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const clienteById = useCallback(
    (id: string) => clientes.find((c) => c.id === id) || { nome: '—', ini: '?', cor: '#999' },
    [clientes],
  );

  const saveService = useCallback(
    async (f: Servico) => {
      const isEdit = !!f.id && servicos.some((s) => s.id === f.id);
      const saved = isEdit ? await catalogService.update(f.id, f) : await catalogService.create(f);
      setServicos((l) => (isEdit ? l.map((s) => (s.id === saved.id ? saved : s)) : [saved, ...l]));
    },
    [servicos],
  );

  const deleteService = useCallback(async (id: string) => {
    await catalogService.remove(id);
    setServicos((l) => l.filter((s) => s.id !== id));
  }, []);

  const moveDeal = useCallback((id: string, etapa: EtapaId) => {
    setNegocios((l) => l.map((d) => (d.id === id ? { ...d, etapa, dias: 0 } : d)));
    leadsService.moveStage(id, etapa).catch(() => {});
  }, []);

  const addEvent = useCallback(async (ev: Omit<Evento, 'id'>) => {
    const now = new Date();
    const saved = await agendaService.create(ev, now.getFullYear(), now.getMonth());
    setAgenda((l) => [...l, saved]);
  }, []);

  const updateProfile = useCallback(
    async (p: { nome?: string; fone?: string; cidade?: string }) => {
      const saved = await authService.updateProfile({ name: p.nome, phone: p.fone, city: p.cidade });
      setUser((u) => ({
        ...u,
        nome: saved.name ?? u.nome,
        ini: initials(saved.name ?? u.nome),
        fone: saved.phone ?? '',
        cidade: saved.city ?? '',
      }));
    },
    [],
  );

  const value = useMemo<DataCtx>(
    () => ({
      loading, hasAccess, clientes, servicos, negocios, agenda, kpis, sparkReceita, receitaMeses, user,
      clienteById, reload, saveService, deleteService, moveDeal, addEvent, updateProfile,
    }),
    [loading, hasAccess, clientes, servicos, negocios, agenda, kpis, sparkReceita, receitaMeses, user, clienteById, reload, saveService, deleteService, moveDeal, addEvent, updateProfile],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData(): DataCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
