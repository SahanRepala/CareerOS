import { NextResponse } from 'next/server';
import { generateInterviewQuestions } from '@/lib/ai/interview-questions';
import type { InterviewContext } from '@/lib/interview/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: { context?: InterviewContext };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  if (!body.context) {
    return NextResponse.json({ error: 'Missing interview context.' }, { status: 400 });
  }

  try {
    const questions = await generateInterviewQuestions(body.context);
    return NextResponse.json({ questions });
  } catch {
    return NextResponse.json({ error: 'Could not generate interview questions. Please try again.' }, { status: 502 });
  }
}
