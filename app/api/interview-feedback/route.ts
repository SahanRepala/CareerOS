import { NextResponse } from 'next/server';
import { generateAnswerFeedback } from '@/lib/ai/interview-feedback';
import type { InterviewContext, InterviewQuestion } from '@/lib/interview/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: { question?: InterviewQuestion; answerText?: string; context?: InterviewContext };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  if (!body.question || typeof body.answerText !== 'string') {
    return NextResponse.json({ error: 'Missing question or answer.' }, { status: 400 });
  }

  try {
    const feedback = await generateAnswerFeedback(body.question, body.answerText, body.context ?? {
      profile: null,
      resume: null,
      jobDescription: null,
      github: null,
    });
    return NextResponse.json({ feedback });
  } catch {
    return NextResponse.json({ error: 'Could not generate feedback. Please try again.' }, { status: 502 });
  }
}
