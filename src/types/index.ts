export type Currency = 'INR';

export type DealStage = 
  | 'Qualification' 
  | 'Discovery' 
  | 'Proposal' 
  | 'Negotiation' 
  | 'Closed Won' 
  | 'Closed Lost';

export type DealRisk = 
  | 'Low Risk' 
  | 'Medium Risk' 
  | 'High Risk' 
  | 'Stalled' 
  | 'Silence' 
  | 'Weak Engagement' 
  | 'Won';

export type DealPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Deal {
  id: string;
  name: string;
  company: string;
  value: number; // in INR
  currency: Currency;
  stage: DealStage;
  probability: number; // 0-100
  owner: string;
  ownerAvatar?: string;
  closeDate: string;
  priority: DealPriority;
  health: number; // 0-100
  risk: DealRisk;
  industry: string;
  description: string;
  pipeline: string;
  lastContactDaysAgo: number;
  daysInStage: number;
  createdAt: string;
  updatedAt: string;
}

export type StakeholderInfluence = 'Low' | 'Medium' | 'High' | 'Key Decision Maker';
export type StakeholderSentiment = 'Positive' | 'Neutral' | 'Skeptical' | 'Hostile';

export interface Stakeholder {
  id: string;
  dealId: string;
  name: string;
  role: string; // e.g. Champion, Blocker, Decision Maker, Evaluator
  title: string; // e.g. Chief Technology Officer
  influence: StakeholderInfluence;
  sentiment: StakeholderSentiment;
  decisionRole: string; // e.g. Budget Authority, Security Sign-off
  email: string;
  phone?: string;
  notes: string;
  relationshipStatus: string;
  createdAt: string;
  updatedAt: string;
}

export type InteractionType = 
  | 'Meeting' 
  | 'Call' 
  | 'Email' 
  | 'Note' 
  | 'Demo' 
  | 'Proposal' 
  | 'Follow-up';

export interface Interaction {
  id: string;
  dealId: string;
  date: string;
  type: InteractionType;
  participants: string[];
  summary: string;
  keyPoints: string[];
  objections: string[];
  competitors: string[];
  pricingDiscussion: string;
  customerRequirements: string[];
  commitments: string[];
  nextSteps: string[];
  memoryRetained: boolean;
  memoryBankId: string;
  createdAt: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  dealId: string;
  stakeholderId?: string;
  task: string;
  owner: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export type EventType = 
  | 'interaction' 
  | 'objection' 
  | 'decision' 
  | 'stakeholder_change' 
  | 'stage_change' 
  | 'memory_event' 
  | 'risk_alert';

export interface DealEvent {
  id: string;
  dealId: string;
  type: EventType;
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export type MemoryType = 'World' | 'Experience' | 'Observation';

export interface HindsightMemory {
  id: string;
  bankId: string;
  dealId: string;
  type: MemoryType;
  content: string;
  context?: string;
  sourceInteractionId?: string;
  confidence: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface GroundedIntelligence {
  executiveSummary: string;
  currentSituation: string;
  customerPriorities: string[];
  knownObjections: { text: string; status: 'resolved' | 'active' | 'escalating'; source: string }[];
  competitiveMentions: { name: string; context: string; threatLevel: 'Low' | 'Medium' | 'High' }[];
  stakeholderDynamics: string;
  pricingContext: string;
  relationshipHealth: { score: number; trend: 'improving' | 'stable' | 'deteriorating'; factors: string[] };
  dealRisks: { risk: string; severity: 'High' | 'Medium' | 'Low'; mitigation: string }[];
  positiveSignals: string[];
  missingInformation: string[];
  recentCommitments: { byUs: string[]; byCustomer: string[] };
  recommendedNextActions: { action: string; urgency: 'Immediate' | 'Next 48h' | 'This Week'; owner: string }[];
  grounding: {
    confirmed: string[];
    inferred: string[];
    unknown: string[];
  };
  recalledMemoriesUsed?: HindsightMemory[];
}

export interface MeetingPrepBrief {
  dealSummary: string;
  lastInteractionSummary: string;
  historicalContext: string[];
  openCommitments: string[];
  customerPainPoints: string[];
  objectionsToAnticipate: string[];
  competitivePositioning: string;
  keyStakeholdersToEngage: { name: string; role: string; objective: string }[];
  topRisks: string[];
  suggestedQuestions: string[];
  recommendedAgenda: string[];
  desiredNextAction: string;
  recalledMemories: HindsightMemory[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recalledMemories?: HindsightMemory[];
  groundedFacts?: {
    confirmed: string[];
    inferred: string[];
    unknown: string[];
  };
}
