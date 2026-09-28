import fs from 'fs';
import path from 'path';
import { Deal, Stakeholder, Interaction, Task, DealEvent, HindsightMemory } from '@/types';

interface DatabaseSchema {
  deals: Deal[];
  stakeholders: Stakeholder[];
  interactions: Interaction[];
  tasks: Task[];
  events: DealEvent[];
  memories: HindsightMemory[];
  settings: {
    currency: string;
    hindsightApiKey: string;
    hindsightBaseUrl: string;
    groqApiKey: string;
    groqModel: string;
    activeWorkspace: string;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Realistic enterprise demo data in INR (₹)
const INITIAL_DEALS: Deal[] = [
  {
    id: 'deal-1',
    name: 'Aurora Solutions - Core Banking Modernization',
    company: 'Aurora Solutions',
    value: 25000000, // ₹2.50 Cr
    currency: 'INR',
    stage: 'Discovery',
    probability: 45,
    owner: 'Alex Morgan',
    closeDate: '2026-11-30',
    priority: 'High',
    health: 42,
    risk: 'High Risk',
    industry: 'Financial Services',
    description: 'Cloud native ledger replacement and API gateway integration for Tier-1 private bank partner.',
    pipeline: 'Enterprise Pipeline',
    lastContactDaysAgo: 18,
    daysInStage: 14,
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-09-20T14:30:00Z',
  },
  {
    id: 'deal-2',
    name: 'Northwind Labs - AI Diagnostics Infrastructure',
    company: 'Northwind Labs',
    value: 12000000, // ₹1.20 Cr
    currency: 'INR',
    stage: 'Qualification',
    probability: 30,
    owner: 'Sarah Jenkins',
    closeDate: '2026-12-15',
    priority: 'Medium',
    health: 58,
    risk: 'Weak Engagement',
    industry: 'Healthcare Tech',
    description: 'Scalable GPU inference cluster and compliant data lakehouse for genomic sequencing.',
    pipeline: 'Enterprise Pipeline',
    lastContactDaysAgo: 8,
    daysInStage: 12,
    createdAt: '2026-08-22T09:15:00Z',
    updatedAt: '2026-09-22T11:00:00Z',
  },
  {
    id: 'deal-3',
    name: 'Flexion Enterprises - Omni-Channel Supply Chain',
    company: 'Flexion Enterprises',
    value: 20000000, // ₹2.00 Cr
    currency: 'INR',
    stage: 'Proposal',
    probability: 60,
    owner: 'Alex Morgan',
    closeDate: '2026-10-31',
    priority: 'Critical',
    health: 48,
    risk: 'High Risk',
    industry: 'Retail & Logistics',
    description: 'Warehouse execution system integration with real-time fleet telematics tracking across 40 hubs.',
    pipeline: 'Enterprise Pipeline',
    lastContactDaysAgo: 21,
    daysInStage: 21,
    createdAt: '2026-07-15T14:20:00Z',
    updatedAt: '2026-09-18T16:45:00Z',
  },
  {
    id: 'deal-4',
    name: 'Omega Corp - Autonomous Security Orchestration',
    company: 'Omega Corp',
    value: 17500000, // ₹1.75 Cr
    currency: 'INR',
    stage: 'Negotiation',
    probability: 75,
    owner: 'David Rao',
    closeDate: '2026-10-15',
    priority: 'High',
    health: 65,
    risk: 'Silence',
    industry: 'Cybersecurity',
    description: 'SOC automation with AI incident triaging replacing legacy SIEM connectors.',
    pipeline: 'Enterprise Pipeline',
    lastContactDaysAgo: 15,
    daysInStage: 9,
    createdAt: '2026-06-30T11:00:00Z',
    updatedAt: '2026-09-25T17:00:00Z',
  },
  {
    id: 'deal-5',
    name: 'Globex Corporation - Global Telephony Migration',
    company: 'Globex Corporation',
    value: 21000000, // ₹2.10 Cr
    currency: 'INR',
    stage: 'Closed Won',
    probability: 100,
    owner: 'Sarah Jenkins',
    closeDate: '2026-09-15',
    priority: 'Medium',
    health: 95,
    risk: 'Won',
    industry: 'Telecommunications',
    description: 'Enterprise SIP trunking and WebRTC collaboration suite deployed to 12,000 employees.',
    pipeline: 'Apollo Pipeline',
    lastContactDaysAgo: 2,
    daysInStage: 14,
    createdAt: '2026-05-10T08:30:00Z',
    updatedAt: '2026-09-15T18:00:00Z',
  },
  {
    id: 'deal-6',
    name: 'Vertex Digital - Customer Experience Engine',
    company: 'Vertex Digital',
    value: 15000000, // ₹1.50 Cr
    currency: 'INR',
    stage: 'Discovery',
    probability: 50,
    owner: 'Alex Morgan',
    closeDate: '2026-11-20',
    priority: 'High',
    health: 52,
    risk: 'Stalled',
    industry: 'E-commerce',
    description: 'Real-time personalization and semantic product recommendation engine.',
    pipeline: 'Apollo Pipeline',
    lastContactDaysAgo: 12,
    daysInStage: 18,
    createdAt: '2026-08-01T13:40:00Z',
    updatedAt: '2026-09-24T10:15:00Z',
  },
  {
    id: 'deal-7',
    name: 'BluePeak Systems - Hybrid Multi-Cloud Governance',
    company: 'BluePeak Systems',
    value: 6000000, // ₹60 Lakhs
    currency: 'INR',
    stage: 'Qualification',
    probability: 40,
    owner: 'David Rao',
    closeDate: '2026-12-05',
    priority: 'Medium',
    health: 85,
    risk: 'Low Risk',
    industry: 'Enterprise Software',
    description: 'FinOps cost observability and policy compliance guardrails for AWS and Azure.',
    pipeline: 'SMB Pipeline',
    lastContactDaysAgo: 4,
    daysInStage: 7,
    createdAt: '2026-09-01T15:00:00Z',
    updatedAt: '2026-09-26T12:00:00Z',
  },
  {
    id: 'deal-8',
    name: 'InnovaTech - Edge IoT Telemetry Ingestion',
    company: 'InnovaTech',
    value: 9500000, // ₹95 Lakhs
    currency: 'INR',
    stage: 'Discovery',
    probability: 45,
    owner: 'Sarah Jenkins',
    closeDate: '2026-11-10',
    priority: 'Medium',
    health: 60,
    risk: 'Weak Engagement',
    industry: 'Industrial IoT',
    description: 'MQTT sensor ingestion and predictive anomaly detection for manufacturing lines.',
    pipeline: 'Enterprise Pipeline',
    lastContactDaysAgo: 9,
    daysInStage: 11,
    createdAt: '2026-08-28T10:30:00Z',
    updatedAt: '2026-09-23T16:20:00Z',
  },
];

const INITIAL_STAKEHOLDERS: Stakeholder[] = [
  {
    id: 'sh-1',
    dealId: 'deal-1',
    name: 'Rajesh Subramanian',
    role: 'Decision Maker',
    title: 'Chief Information & Technology Officer',
    influence: 'Key Decision Maker',
    sentiment: 'Skeptical',
    decisionRole: 'Budget & Architectural Sign-off',
    email: 'rajesh.s@aurorasolutions.io',
    phone: '+91 98201 44521',
    notes: 'Concerned about migration downtime and legacy core banking compatibility. Stated clearly in meeting 2 that data residency must stay in Mumbai region.',
    relationshipStatus: 'Needs Executive Sponsor Alignment',
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-09-15T11:00:00Z',
  },
  {
    id: 'sh-2',
    dealId: 'deal-1',
    name: 'Pooja Kulkarni',
    role: 'Champion',
    title: 'Head of Digital Channels',
    influence: 'High',
    sentiment: 'Positive',
    decisionRole: 'Business Sponsor',
    email: 'pooja.k@aurorasolutions.io',
    phone: '+91 98402 11983',
    notes: 'Pooja loves our developer ergonomics and low latency APIs. Wants pilot live by Q1 2027 to satisfy RBI digital banking push.',
    relationshipStatus: 'Strong Supporter',
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-09-18T14:00:00Z',
  },
  {
    id: 'sh-3',
    dealId: 'deal-1',
    name: 'Vikram Merchant',
    role: 'Blocker',
    title: 'VP of Information Security & Compliance',
    influence: 'High',
    sentiment: 'Hostile',
    decisionRole: 'Security & InfoSec Sign-off',
    email: 'vikram.m@aurorasolutions.io',
    phone: '+91 99304 88712',
    notes: 'Strong bias toward on-premise solutions. Pointed out that competitor Tata Consultancy / Finacle has existing master service agreement.',
    relationshipStatus: 'Critical Risk - Requires CISO-to-CISO Session',
    createdAt: '2026-08-15T11:00:00Z',
    updatedAt: '2026-09-19T16:30:00Z',
  },
  {
    id: 'sh-4',
    dealId: 'deal-3',
    name: 'Amitabh Sen',
    role: 'Decision Maker',
    title: 'Executive Vice President of Operations',
    influence: 'Key Decision Maker',
    sentiment: 'Neutral',
    decisionRole: 'Commercial Approval',
    email: 'amitabh.sen@flexion.co.in',
    phone: '+91 98111 23456',
    notes: 'Evaluating our proposal against Manhattan Associates. Budget cap is ₹1.8 Cr; our quote is ₹2.0 Cr.',
    relationshipStatus: 'Pending Commercial Revision',
    createdAt: '2026-07-20T10:00:00Z',
    updatedAt: '2026-09-18T10:00:00Z',
  },
  {
    id: 'sh-5',
    dealId: 'deal-4',
    name: 'Neha Nair',
    role: 'Champion',
    title: 'Director of Cyber Defense',
    influence: 'High',
    sentiment: 'Positive',
    decisionRole: 'Technical Evaluation Lead',
    email: 'neha.n@omegacorp.com',
    phone: '+91 98765 43210',
    notes: 'Completed POC with 98% accuracy on alert deduplication. Waiting for legal review on indemnification clauses.',
    relationshipStatus: 'Very Engaged',
    createdAt: '2026-07-05T09:00:00Z',
    updatedAt: '2026-09-20T15:00:00Z',
  },
];

const INITIAL_INTERACTIONS: Interaction[] = [
  {
    id: 'int-1',
    dealId: 'deal-1',
    date: '2026-08-12T11:00:00Z',
    type: 'Meeting',
    participants: ['Alex Morgan', 'Pooja Kulkarni', 'Rajesh Subramanian'],
    summary: 'Initial discovery on core banking modernization and cloud migration.',
    keyPoints: [
      'Aurora plans to migrate 8 million consumer accounts to hybrid cloud.',
      'Target go-live is Q1 2027.',
      'Strict RBI compliance and Indian data residency required.',
    ],
    objections: ['High cost of implementation services', 'Fear of downtime during account cutover'],
    competitors: ['Infosys Finacle', 'Oracle FLEXCUBE'],
    pricingDiscussion: 'Budget ballpark discussed at ₹2.5 Cr annually inclusive of enterprise support.',
    customerRequirements: ['Sub-50ms transaction latency', 'Active-active multi-region failover in Mumbai and Hyderabad'],
    commitments: ['Alex to provide architectural security whitepaper and benchmark numbers by Aug 20'],
    nextSteps: ['Schedule deep dive technical demo with security team'],
    memoryRetained: true,
    memoryBankId: 'deal-bank-deal-1',
    createdAt: '2026-08-12T12:30:00Z',
  },
  {
    id: 'int-2',
    dealId: 'deal-1',
    date: '2026-08-25T15:00:00Z',
    type: 'Demo',
    participants: ['Alex Morgan', 'Sarah Jenkins', 'Rajesh Subramanian', 'Vikram Merchant'],
    summary: 'Technical architecture demonstration and security review session.',
    keyPoints: [
      'Demonstrated zero-downtime ledger re-indexing and audit logging.',
      'Showcased hardware security module (HSM) encryption integration.',
      'Vikram expressed hostility regarding public cloud key escrow.',
    ],
    objections: [
      'Customer stated KMS keys must never leave their own dedicated on-prem hardware security modules.',
      'Vikram claims competitor Finacle already has pre-approved RBI audit clearance.',
    ],
    competitors: ['Infosys Finacle'],
    pricingDiscussion: 'Vikram requested a 20% discount on upfront professional services.',
    customerRequirements: ['Customer-managed KMS keys (BYOK/HYOK)', 'SOC-2 Type II and ISO 27001 audit package'],
    commitments: ['Sarah to provide Bring-Your-Own-KMS integration architecture diagram.'],
    nextSteps: ['Deliver InfoSec responses to Vikram Merchant.'],
    memoryRetained: true,
    memoryBankId: 'deal-bank-deal-1',
    createdAt: '2026-08-25T16:45:00Z',
  },
  {
    id: 'int-3',
    dealId: 'deal-1',
    date: '2026-09-10T14:00:00Z',
    type: 'Call',
    participants: ['Alex Morgan', 'Pooja Kulkarni'],
    summary: 'One-on-one catch-up with champion Pooja Kulkarni on internal alignment.',
    keyPoints: [
      'Pooja confirmed CITO Rajesh is on board if InfoSec approval is granted.',
      'Pooja warned that Vikram Merchant is meeting Oracle FLEXCUBE sales VP on Sept 28.',
      'Budget for FY27 is getting locked on Oct 15; we must reach proposal stage before then.',
    ],
    objections: ['Timeline urgency: if security approval slips past October, budget will be deferred to next year.'],
    competitors: ['Oracle FLEXCUBE'],
    pricingDiscussion: 'Pooja suggested we include 24/7 dedicated Technical Account Manager at no extra cost to close deal.',
    customerRequirements: ['Dedicated Indian TAM timezone coverage', 'Fixed price implementation guarantee'],
    commitments: ['Alex promised to discuss complimentary TAM with sales VP and confirm in writing.'],
    nextSteps: ['Set up executive alignment call between our VP of Security and Vikram Merchant.'],
    memoryRetained: true,
    memoryBankId: 'deal-bank-deal-1',
    createdAt: '2026-09-10T15:10:00Z',
  },
];

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    dealId: 'deal-1',
    stakeholderId: 'sh-3',
    task: 'Schedule CISO-to-CISO briefing with Vikram Merchant regarding Bring-Your-Own-Key encryption.',
    owner: 'Alex Morgan',
    dueDate: '2026-10-02',
    priority: 'High',
    status: 'in_progress',
    createdAt: '2026-09-12T10:00:00Z',
    updatedAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'task-2',
    dealId: 'deal-1',
    stakeholderId: 'sh-2',
    task: 'Deliver formal approval for complimentary TAM (Technical Account Manager) to Pooja Kulkarni.',
    owner: 'Alex Morgan',
    dueDate: '2026-09-30',
    priority: 'High',
    status: 'pending',
    createdAt: '2026-09-15T11:00:00Z',
    updatedAt: '2026-09-15T11:00:00Z',
  },
  {
    id: 'task-3',
    dealId: 'deal-1',
    stakeholderId: 'sh-1',
    task: 'Submit revised proposal showing Mumbai data center compliance before Oct 15 budget deadline.',
    owner: 'Sarah Jenkins',
    dueDate: '2026-10-08',
    priority: 'High',
    status: 'pending',
    createdAt: '2026-09-18T14:00:00Z',
    updatedAt: '2026-09-18T14:00:00Z',
  },
  {
    id: 'task-4',
    dealId: 'deal-3',
    stakeholderId: 'sh-4',
    task: 'Provide revised commercial pricing table aligned with Amitabh Sens ₹1.8 Cr budget cap.',
    owner: 'Alex Morgan',
    dueDate: '2026-10-05',
    priority: 'High',
    status: 'in_progress',
    createdAt: '2026-09-20T09:00:00Z',
    updatedAt: '2026-09-20T09:00:00Z',
  },
  {
    id: 'task-5',
    dealId: 'deal-4',
    stakeholderId: 'sh-5',
    task: 'Legal team to approve updated master agreement indemnification clause.',
    owner: 'David Rao',
    dueDate: '2026-10-04',
    priority: 'Medium',
    status: 'pending',
    createdAt: '2026-09-22T10:00:00Z',
    updatedAt: '2026-09-22T10:00:00Z',
  },
];

const INITIAL_EVENTS: DealEvent[] = [
  {
    id: 'evt-1',
    dealId: 'deal-1',
    type: 'interaction',
    title: 'Initial Discovery Meeting',
    description: 'Meeting held with CITO Rajesh Subramanian & Head of Channels Pooja Kulkarni.',
    timestamp: '2026-08-12T11:00:00Z',
  },
  {
    id: 'evt-2',
    dealId: 'deal-1',
    type: 'memory_event',
    title: 'Hindsight Memory Retained',
    description: 'Extracted 4 core requirements and budget parameters into deal-bank-deal-1.',
    timestamp: '2026-08-12T12:35:00Z',
  },
  {
    id: 'evt-3',
    dealId: 'deal-1',
    type: 'objection',
    title: 'Security Blocker Raised',
    description: 'VP of InfoSec Vikram Merchant raised objection regarding cloud KMS and key escrow.',
    timestamp: '2026-08-25T15:30:00Z',
  },
  {
    id: 'evt-4',
    dealId: 'deal-1',
    type: 'memory_event',
    title: 'Hindsight Memory Retained',
    description: 'Stored customer-managed KMS constraint and Finacle competitor evaluation.',
    timestamp: '2026-08-25T16:50:00Z',
  },
  {
    id: 'evt-5',
    dealId: 'deal-1',
    type: 'risk_alert',
    title: 'Deal Risk Escalated to High',
    description: 'Silence > 18 days combined with pending competitor meeting with Oracle FLEXCUBE.',
    timestamp: '2026-09-20T14:30:00Z',
  },
];

const INITIAL_MEMORIES: HindsightMemory[] = [
  {
    id: 'mem-1',
    bankId: 'deal-bank-deal-1',
    dealId: 'deal-1',
    type: 'World',
    content: 'Aurora Solutions is a Tier-1 private bank in India migrating 8 million retail customer accounts to modern microservices by Q1 2027.',
    confidence: 0.98,
    timestamp: '2026-08-12T12:35:00Z',
  },
  {
    id: 'mem-2',
    bankId: 'deal-bank-deal-1',
    dealId: 'deal-1',
    type: 'Experience',
    content: 'Customer strictly mandates that all data and cryptographic keys remain within Indian geographic borders (Mumbai/Hyderabad) to satisfy Reserve Bank of India regulations.',
    confidence: 0.95,
    timestamp: '2026-08-12T12:35:00Z',
  },
  {
    id: 'mem-3',
    bankId: 'deal-bank-deal-1',
    dealId: 'deal-1',
    type: 'Observation',
    content: 'VP of InfoSec Vikram Merchant is an active blocker who favors incumbent vendor Infosys Finacle and insists on on-premise HSM integration.',
    confidence: 0.92,
    timestamp: '2026-08-25T16:50:00Z',
  },
  {
    id: 'mem-4',
    bankId: 'deal-bank-deal-1',
    dealId: 'deal-1',
    type: 'Experience',
    content: 'Alex Morgan promised Pooja Kulkarni a complimentary 24/7 dedicated Technical Account Manager to neutralize budget lock risk before Oct 15.',
    confidence: 0.96,
    timestamp: '2026-09-10T15:10:00Z',
  },
  {
    id: 'mem-5',
    bankId: 'deal-bank-deal-1',
    dealId: 'deal-1',
    type: 'Observation',
    content: 'Competitor Oracle FLEXCUBE sales VP has a meeting booked with Vikram Merchant on September 28.',
    confidence: 0.89,
    timestamp: '2026-09-10T15:10:00Z',
  },
];

function ensureDbDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readDatabase(): DatabaseSchema {
  ensureDbDirectory();
  if (!fs.existsSync(DB_FILE)) {
    const initialDb: DatabaseSchema = {
      deals: INITIAL_DEALS,
      stakeholders: INITIAL_STAKEHOLDERS,
      interactions: INITIAL_INTERACTIONS,
      tasks: INITIAL_TASKS,
      events: INITIAL_EVENTS,
      memories: INITIAL_MEMORIES,
      settings: {
        currency: 'INR',
        hindsightApiKey: process.env.HINDSIGHT_API_KEY || '',
        hindsightBaseUrl: process.env.HINDSIGHT_BASE_URL || 'https://api.hindsight.vectorize.io',
        groqApiKey: process.env.GROQ_API_KEY || '',
        groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        activeWorkspace: 'Enterprise Sales',
      },
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw) as DatabaseSchema;
  } catch (err) {
    console.error('Failed to parse database file, resetting to initial', err);
    const initialDb: DatabaseSchema = {
      deals: INITIAL_DEALS,
      stakeholders: INITIAL_STAKEHOLDERS,
      interactions: INITIAL_INTERACTIONS,
      tasks: INITIAL_TASKS,
      events: INITIAL_EVENTS,
      memories: INITIAL_MEMORIES,
      settings: {
        currency: 'INR',
        hindsightApiKey: process.env.HINDSIGHT_API_KEY || '',
        hindsightBaseUrl: process.env.HINDSIGHT_BASE_URL || 'https://api.hindsight.vectorize.io',
        groqApiKey: process.env.GROQ_API_KEY || '',
        groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        activeWorkspace: 'Enterprise Sales',
      },
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }
}

export function writeDatabase(data: DatabaseSchema): void {
  ensureDbDirectory();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ---------------- CRUD HELPERS ----------------

// DEALS
export function getDeals(): Deal[] {
  return readDatabase().deals;
}

export function getDealById(id: string): Deal | undefined {
  return readDatabase().deals.find(d => d.id === id);
}

export function createDeal(dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Deal {
  const db = readDatabase();
  const id = `deal-${Date.now()}`;
  const now = new Date().toISOString();
  const newDeal: Deal = {
    ...dealData,
    id,
    currency: 'INR',
    createdAt: now,
    updatedAt: now,
  };
  db.deals.unshift(newDeal);
  
  // Add creation event
  db.events.unshift({
    id: `evt-${Date.now()}`,
    dealId: id,
    type: 'stage_change',
    title: `Deal Created in ${newDeal.stage}`,
    description: `Created new deal for ${newDeal.company} valued at ₹${newDeal.value.toLocaleString('en-IN')}`,
    timestamp: now,
  });

  writeDatabase(db);
  return newDeal;
}

export function updateDeal(id: string, updates: Partial<Deal>): Deal | null {
  const db = readDatabase();
  const idx = db.deals.findIndex(d => d.id === id);
  if (idx === -1) return null;

  const previous = db.deals[idx];
  const now = new Date().toISOString();
  const updated: Deal = {
    ...previous,
    ...updates,
    currency: 'INR', // always maintain INR
    updatedAt: now,
  };

  db.deals[idx] = updated;

  // If stage changed, record event
  if (updates.stage && updates.stage !== previous.stage) {
    db.events.unshift({
      id: `evt-${Date.now()}`,
      dealId: id,
      type: 'stage_change',
      title: `Stage Updated: ${updates.stage}`,
      description: `Deal moved from ${previous.stage} to ${updates.stage}`,
      timestamp: now,
    });
  }

  writeDatabase(db);
  return updated;
}

export function deleteDeal(id: string): boolean {
  const db = readDatabase();
  const initialLen = db.deals.length;
  db.deals = db.deals.filter(d => d.id !== id);
  if (db.deals.length === initialLen) return false;

  // Cleanup related records
  db.stakeholders = db.stakeholders.filter(s => s.dealId !== id);
  db.interactions = db.interactions.filter(i => i.dealId !== id);
  db.tasks = db.tasks.filter(t => t.dealId !== id);
  db.events = db.events.filter(e => e.dealId !== id);
  db.memories = db.memories.filter(m => m.dealId !== id);

  writeDatabase(db);
  return true;
}

// STAKEHOLDERS
export function getStakeholders(dealId?: string): Stakeholder[] {
  const db = readDatabase();
  return dealId ? db.stakeholders.filter(s => s.dealId === dealId) : db.stakeholders;
}

export function createStakeholder(data: Omit<Stakeholder, 'id' | 'createdAt' | 'updatedAt'>): Stakeholder {
  const db = readDatabase();
  const now = new Date().toISOString();
  const sh: Stakeholder = {
    ...data,
    id: `sh-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  db.stakeholders.push(sh);

  db.events.unshift({
    id: `evt-${Date.now()}`,
    dealId: data.dealId,
    type: 'stakeholder_change',
    title: `Stakeholder Added: ${sh.name}`,
    description: `${sh.title} added as ${sh.role} (${sh.sentiment} sentiment)`,
    timestamp: now,
  });

  writeDatabase(db);
  return sh;
}

export function updateStakeholder(id: string, updates: Partial<Stakeholder>): Stakeholder | null {
  const db = readDatabase();
  const idx = db.stakeholders.findIndex(s => s.id === id);
  if (idx === -1) return null;

  const updated: Stakeholder = {
    ...db.stakeholders[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  db.stakeholders[idx] = updated;
  writeDatabase(db);
  return updated;
}

export function deleteStakeholder(id: string): boolean {
  const db = readDatabase();
  const prevLen = db.stakeholders.length;
  db.stakeholders = db.stakeholders.filter(s => s.id !== id);
  if (db.stakeholders.length === prevLen) return false;
  writeDatabase(db);
  return true;
}

// INTERACTIONS
export function getInteractions(dealId?: string): Interaction[] {
  const db = readDatabase();
  return dealId 
    ? db.interactions.filter(i => i.dealId === dealId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) 
    : db.interactions;
}

export function createInteraction(data: Omit<Interaction, 'id' | 'createdAt'>): Interaction {
  const db = readDatabase();
  const now = new Date().toISOString();
  const intId = `int-${Date.now()}`;
  const interaction: Interaction = {
    ...data,
    id: intId,
    createdAt: now,
  };
  db.interactions.unshift(interaction);

  // Add event
  db.events.unshift({
    id: `evt-${Date.now()}`,
    dealId: data.dealId,
    type: 'interaction',
    title: `${data.type}: ${data.summary.slice(0, 50)}...`,
    description: `Participants: ${data.participants.join(', ')}`,
    timestamp: data.date || now,
  });

  // Update deal's last contact
  const deal = db.deals.find(d => d.id === data.dealId);
  if (deal) {
    deal.lastContactDaysAgo = 0;
    deal.updatedAt = now;
  }

  writeDatabase(db);
  return interaction;
}

export function deleteInteraction(id: string): boolean {
  const db = readDatabase();
  const prevLen = db.interactions.length;
  db.interactions = db.interactions.filter(i => i.id !== id);
  if (db.interactions.length === prevLen) return false;
  writeDatabase(db);
  return true;
}

// TASKS
export function getTasks(dealId?: string): Task[] {
  const db = readDatabase();
  return dealId ? db.tasks.filter(t => t.dealId === dealId) : db.tasks;
}

export function createTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
  const db = readDatabase();
  const now = new Date().toISOString();
  const task: Task = {
    ...data,
    id: `task-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  db.tasks.unshift(task);
  writeDatabase(db);
  return task;
}

export function updateTask(id: string, updates: Partial<Task>): Task | null {
  const db = readDatabase();
  const idx = db.tasks.findIndex(t => t.id === id);
  if (idx === -1) return null;

  const updated: Task = {
    ...db.tasks[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  db.tasks[idx] = updated;
  writeDatabase(db);
  return updated;
}

export function deleteTask(id: string): boolean {
  const db = readDatabase();
  const prevLen = db.tasks.length;
  db.tasks = db.tasks.filter(t => t.id !== id);
  if (db.tasks.length === prevLen) return false;
  writeDatabase(db);
  return true;
}

// TIMELINE EVENTS
export function getDealEvents(dealId: string): DealEvent[] {
  const db = readDatabase();
  return db.events
    .filter(e => e.dealId === dealId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function addDealEvent(event: Omit<DealEvent, 'id'>): DealEvent {
  const db = readDatabase();
  const newEvt: DealEvent = {
    ...event,
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(7)}`,
  };
  db.events.unshift(newEvt);
  writeDatabase(db);
  return newEvt;
}

// MEMORIES
export function getStoredMemories(dealId?: string): HindsightMemory[] {
  const db = readDatabase();
  return dealId 
    ? db.memories.filter(m => m.dealId === dealId).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    : db.memories;
}

export function storeMemory(memory: Omit<HindsightMemory, 'id'>): HindsightMemory {
  const db = readDatabase();
  const newMem: HindsightMemory = {
    ...memory,
    id: `mem-${Date.now()}-${Math.random().toString(36).substring(7)}`,
  };
  db.memories.unshift(newMem);
  writeDatabase(db);
  return newMem;
}

function getEnvLocalValues(): Record<string, string> {
  const envPath = path.join(process.cwd(), '.env.local');
  const env: Record<string, string> = {};
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf-8');
      content.split('\n').forEach(line => {
        const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (m) env[m[1]] = m[2].trim();
      });
    } catch {
      // ignore
    }
  }
  return env;
}

// SETTINGS
export function getSettings() {
  const db = readDatabase();
  const env = getEnvLocalValues();
  return {
    ...db.settings,
    hindsightApiKey: env.HINDSIGHT_API_KEY || process.env.HINDSIGHT_API_KEY || db.settings.hindsightApiKey || '',
    hindsightBaseUrl: env.HINDSIGHT_BASE_URL || process.env.HINDSIGHT_BASE_URL || db.settings.hindsightBaseUrl || 'https://api.hindsight.vectorize.io',
    groqApiKey: env.GROQ_API_KEY || process.env.GROQ_API_KEY || db.settings.groqApiKey || '',
    groqModel: env.GROQ_MODEL || process.env.GROQ_MODEL || db.settings.groqModel || 'qwen/qwen3.8-27b',
  };
}

export function updateSettings(updates: Partial<DatabaseSchema['settings']>) {
  const db = readDatabase();
  db.settings = { ...db.settings, ...updates };
  writeDatabase(db);
  return db.settings;
}

// RESET DATABASE
export function resetDatabase() {
  const dbFile = DB_FILE;
  if (fs.existsSync(dbFile)) {
    fs.unlinkSync(dbFile);
  }
  return readDatabase();
}
