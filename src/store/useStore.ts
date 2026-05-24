import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  User, Lead, Visit, Budget, Production, Installation, MeasurementSheet, Subscription,
  KnowledgeItem, Notification, LeadStatus 
} from '../types';
import { mockLeads, mockVisits, mockBudgets, mockProductions, mockInstallations, mockKnowledge, mockUsers } from '../data/mockData';

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Users
  users: User[];

  // Subscription
  subscription: Subscription;
  updateSubscription: (updates: Partial<Subscription>) => void;
  
  // Leads
  leads: Lead[];
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  deleteLead: (id: string) => void;
  
  // Visits
  visits: Visit[];
  addVisit: (visit: Visit) => void;
  updateVisit: (id: string, updates: Partial<Visit>) => void;
  deleteVisit: (id: string) => void;

  // Measurement Sheets
  measurementSheets: MeasurementSheet[];
  saveMeasurementSheet: (sheet: MeasurementSheet) => void;
  
  // Budgets
  budgets: Budget[];
  addBudget: (budget: Budget) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  
  // Productions
  productions: Production[];
  addProduction: (production: Production) => void;
  updateProduction: (id: string, updates: Partial<Production>) => void;
  
  // Installations
  installations: Installation[];
  addInstallation: (installation: Installation) => void;
  updateInstallation: (id: string, updates: Partial<Installation>) => void;
  
  // Knowledge Base
  knowledgeBase: KnowledgeItem[];
  addKnowledgeItem: (item: KnowledgeItem) => void;
  updateKnowledgeItem: (id: string, updates: Partial<KnowledgeItem>) => void;
  deleteKnowledgeItem: (id: string) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  
  // UI State
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      currentUser: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const user = mockUsers.find(u => u.email === email);
        if (user && password === '123456') {
          set({ currentUser: user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ currentUser: null, isAuthenticated: false }),
      
      // Users
      users: mockUsers,

      // Subscription
      subscription: {
        customerName: 'Marquinhos OS',
        customerDocument: '00.000.000/0001-00',
        customerEmail: 'financeiro@marquinhosos.com',
        plan: 'professional',
        status: 'trial',
        amount: 297,
        billingCycle: 'monthly',
        maxUsers: 10,
        dueDay: 10,
        nextDueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        paymentMethod: 'pix',
        invoiceUrl: '',
        notes: 'Assinatura em periodo de implantacao.',
        updatedAt: new Date(),
      },
      updateSubscription: (updates) => set((state) => ({
        subscription: { ...state.subscription, ...updates, updatedAt: new Date() }
      })),
      
      // Leads
      leads: mockLeads,
      addLead: (lead) => set((state) => ({ leads: [lead, ...state.leads] })),
      updateLead: (id, updates) => set((state) => ({
        leads: state.leads.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date() } : l)
      })),
      updateLeadStatus: (id, status) => set((state) => ({
        leads: state.leads.map(l => l.id === id ? { ...l, status, updatedAt: new Date() } : l)
      })),
      deleteLead: (id) => set((state) => ({ leads: state.leads.filter(l => l.id !== id) })),
      
      // Visits
      visits: mockVisits,
      addVisit: (visit) => set((state) => ({ visits: [visit, ...state.visits] })),
      updateVisit: (id, updates) => set((state) => ({
        visits: state.visits.map(v => v.id === id ? { ...v, ...updates } : v)
      })),
      deleteVisit: (id) => set((state) => ({ visits: state.visits.filter(v => v.id !== id) })),

      // Measurement Sheets
      measurementSheets: [],
      saveMeasurementSheet: (sheet) => set((state) => {
        const exists = state.measurementSheets.some(s => s.id === sheet.id);
        return {
          measurementSheets: exists
            ? state.measurementSheets.map(s => s.id === sheet.id ? sheet : s)
            : [sheet, ...state.measurementSheets]
        };
      }),
      
      // Budgets
      budgets: mockBudgets,
      addBudget: (budget) => set((state) => ({ budgets: [budget, ...state.budgets] })),
      updateBudget: (id, updates) => set((state) => ({
        budgets: state.budgets.map(b => b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b)
      })),
      deleteBudget: (id) => set((state) => ({ budgets: state.budgets.filter(b => b.id !== id) })),
      
      // Productions
      productions: mockProductions,
      addProduction: (production) => set((state) => ({ productions: [production, ...state.productions] })),
      updateProduction: (id, updates) => set((state) => ({
        productions: state.productions.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      
      // Installations
      installations: mockInstallations,
      addInstallation: (installation) => set((state) => ({ installations: [installation, ...state.installations] })),
      updateInstallation: (id, updates) => set((state) => ({
        installations: state.installations.map(i => i.id === id ? { ...i, ...updates } : i)
      })),
      
      // Knowledge Base
      knowledgeBase: mockKnowledge,
      addKnowledgeItem: (item) => set((state) => ({ knowledgeBase: [item, ...state.knowledgeBase] })),
      updateKnowledgeItem: (id, updates) => set((state) => ({
        knowledgeBase: state.knowledgeBase.map(k => k.id === id ? { ...k, ...updates } : k)
      })),
      deleteKnowledgeItem: (id) => set((state) => ({ knowledgeBase: state.knowledgeBase.filter(k => k.id !== id) })),
      
      // Notifications
      notifications: [],
      addNotification: (notification) => set((state) => ({ 
        notifications: [notification, ...state.notifications].slice(0, 50) 
      })),
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      clearNotifications: () => set({ notifications: [] }),
      
      // UI State
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      activeTab: 'dashboard',
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'marquinhos-os-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        leads: state.leads,
        visits: state.visits,
        measurementSheets: state.measurementSheets,
        subscription: state.subscription,
        budgets: state.budgets,
        productions: state.productions,
        installations: state.installations,
        knowledgeBase: state.knowledgeBase,
        notifications: state.notifications,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
