/**
 * contracts/domain/cover-letter.contract.ts
 */

export interface CoverLetter {
  greeting: string;
  openingParagraph: string;
  bodyParagraphs: string[];
  closingParagraph: string;
  signOff: string;
  tone: 'formal' | 'conversational' | 'enthusiastic';
  wordCount: number;
}
