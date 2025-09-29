export interface Version {
  version: number;
  date: string;
  content: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  versions: Version[];
  draftContent?: string | null;
}

export interface Risk {
  id: string;
  riskLevel: 'High' | 'Medium' | 'Low' | 'Info';
  description: string;
  clause: string;
  recommendation: string;
}

export interface PIIConcern {
  id: string;
  pii: string;
  concern: string;
  recommendation: string;
}

export interface Summary {
    executive: string;
    keyClauses: { title: string; detail: string }[];
}

export interface QnAResponse {
    answer: string;
    quote: string;
}

export enum AnalysisType {
    SUMMARY = 'summary',
    RISK_ANALYSIS = 'risk_analysis',
    CLAUSE_EXTRACTION = 'clause_extraction',
    TRANSLATION = 'translation',
    QNA = 'qna',
    REDACT_PII = 'redact_pii',
}