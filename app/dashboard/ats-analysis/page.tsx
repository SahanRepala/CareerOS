'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Save,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ScoreRing } from '@/components/shared/score-ring';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import { createJobDescription } from '@/lib/db/job-descriptions';
import { createAtsResult } from '@/lib/db/ats-results';
import { cn } from '@/lib/utils';
import {
    PolarAngleAxis,
    PolarGrid,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import type { AtsResult } from '@/lib/db/types';

export default function AtsAnalysisPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [jdText, setJdText] = useState('');
  const [analysisData, setAnalysisData] = useState<AtsResult | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Real data derived from analysisData, or defaults if null
  const details = (analysisData?.details as any) || { keywordMatch: 0, formatting: 0, experience: 0, readability: 0, actionVerbs: 0 };
  const radarData = [
      { metric: 'Keyword Match', value: details.keywordMatch || 0 },
      { metric: 'Formatting', value: details.formatting || 0 },
      { metric: 'Experience', value: details.experience || 0 },
      { metric: 'Readability', value: details.readability || 0 },
      { metric: 'Action Verbs', value: details.actionVerbs || 0 },
  ];

  const metricCards = [
      { id: 'keyword', label: 'Keyword Match', value: details.keywordMatch || 0 },
      { id: 'format', label: 'Formatting', value: details.formatting || 0 },
      { id: 'experience', label: 'Experience', value: details.experience || 0 },
      { id: 'readability', label: 'Readability', value: details.readability || 0 },
      { id: 'action', label: 'Action Verbs', value: details.actionVerbs || 0 },
  ] as const;

  const runAnalysis = async (resumeVersion: any, jobDescription: any) => {
    if (!user) return;
    
    // 2. Run analysis
    const response = await fetch('http://localhost:8000/api/analyze-ats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: resumeVersion.content, jd: jobDescription.structured_content }),
    });
    
    if (!response.ok) throw new Error('Analysis failed');
    const { data: report } = await response.json();

    // 3. Store result
    const { data: newResult, error } = await createAtsResult(supabase, {
        user_id: user.id,
        resume_version_id: resumeVersion.id,
        job_description_id: jobDescription.id,
        score: report.score,
        details: report.details
    });

    if (error) throw new Error(error);
    setAnalysisData(newResult);
  };

  const handleJDUpload = async (file?: File, pastedText?: string) => {
    if (!user) return;
    setUploading(true);
    try {
      const formData = new FormData();
      if (file) {
        if (file.size > 5 * 1024 * 1024) throw new Error('File too large');
        formData.append('file', file);
      } else if (pastedText) {
        formData.append('text', pastedText);
      }
      
      const response = await fetch('http://localhost:8000/api/parse-jd', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Parsing failed');
      const { data: parsedData } = await response.json();
      
      // Store result
      const { data: jd, error } = await createJobDescription(supabase, {
        user_id: user.id,
        title: parsedData.title || 'Untitled JD',
        company: parsedData.company,
        description: pastedText || (file ? await file.text() : ''),
        structured_content: parsedData
      });

      if (error || !jd) throw new Error(error || 'Failed to create job description');

      // Trigger analysis - assuming latest resume version
      const { data: resumeVersion } = await supabase
        .from('resume_versions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', {ascending: false})
        .limit(1)
        .maybeSingle();

      if (resumeVersion) {
          await runAnalysis(resumeVersion, jd);
      }

      setJdText(jd.description || '');
      toast.success('Job description uploaded and parsed.');
      } catch (e) {
      toast.error('Upload failed', { description: e instanceof Error ? e.message : 'Unknown error' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <DashboardHeader
        title="ATS Analysis"
        subtitle="How your resume scores against real applicant tracking systems."
      />

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <Card className="shadow-card lg:col-span-3">
            <CardHeader>
                <CardTitle className="text-base">Target Job Description</CardTitle>
                <CardDescription>Upload or paste a JD to score your resume.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="Paste job description here..."
                    rows={6}
                />
                <div className="flex gap-2">
                    <Button onClick={() => handleJDUpload(undefined, jdText)} disabled={uploading}>
                        {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Job Description
                    </Button>
                    <input type="file" onChange={(e) => e.target.files && handleJDUpload(e.target.files[0])} className="hidden" id="jd-upload" />
                    <Button asChild variant="outline">
                        <label htmlFor="jd-upload">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload File (PDF/TXT)
                        </label>
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-base">Overall ATS Score</CardTitle>
            <CardDescription>Recruiter-grade</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 items-center justify-center pb-8">
            <ScoreRing value={analysisData?.score || 0} size={170} label="out of 100" />
          </CardContent>
        </Card>

        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Score breakdown</CardTitle>
            <CardDescription>Six dimensions recruiters and ATS parse</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius={100}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  />
                  <Radar
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {metricCards.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="shadow-card">
              <CardContent className="p-5">
                <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{m.value}%</p>
                <Progress value={m.value} className="mt-3 h-1.5" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Section scores</CardTitle>
            <CardDescription>Per-section parse reliability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Detailed section scores are not currently available.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
