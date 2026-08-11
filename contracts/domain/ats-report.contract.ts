/**
 * contracts/domain/ats-report.contract.ts
 */

export interface AtsKeywordMatch {
  keyword: string;
  foundInResume: boolean;
  importance: 'must-have' | 'nice-to-have';
}

export interface AtsReport {
  overallScore: number; // 0-100
  keywordMatches: AtsKeywordMatch[];
  missingKeywords: string[];
  formattingIssues: string[];
  recommendations: string[];
}

export interface RecruiterFeedbackItem {
  category: 'clarity' | 'impact' | 'formatting' | 'relevance' | 'red-flag';
  severity: 'low' | 'medium' | 'high';
  note: string;
  relatedBulletId?: string;
}

export interface RecruiterFeedbackReport {
  overallImpression: string;
  sixSecondScanScore: number; // 0-100
  items: RecruiterFeedbackItem[];
}
