'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Save,
  Loader2,
  PieChart as PieChartIcon,
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
import {
  atsOverview,
  atsPie,
  atsRadar,
  atsSectionScores,
} from '@/lib/mock/ats';
import { cn } from '@/lib/utils';
import {
    Pie,
    PieChart,
    PolarAngleAxis,
    PolarGrid,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid hsl(var(--border))',
  background: 'hsl(var(--card))',
  boxShadow: '0 8px 32px rgba(15,23,42,0.10)',
  fontSize: 12,
};

const metricCards = [
  { id: 'keyword', label: 'Keyword Match', value: atsOverview.keywordMatch, accent: 'primary' },
  { id: 'format', label: 'Formatting', value: atsOverview.formatting, accent: 'secondary' },
  { id: 'experience', label: 'Experience', value: atsOverview.experience, accent: 'accent' },
  { id: 'readability', label: 'Readability', value: atsOverview.readability, accent: 'primary' },
  { id: 'action', label: 'Action Verbs', value: atsOverview.actionVerbs, accent: 'secondary' },
] as const;

export default function AtsAnalysisPage() {
  const { user } = useAuth();
  const [jdText, setJdText] = useState('');
  const [analysisData, setAnalysisData] = useState<any>(null);

  const runAnalysis = async (resumeVersion: any, jobDescription: any) => {
    // 1. Check for cached result
    const { data: cachedResult } = await supabase
        .from('ats_results')
        .select('*')
        .eq('resume_version_id', resumeVersion.id)
        .eq('job_description_id', jobDescription.id)
        .maybeSingle();

    if (cachedResult) {
        setAnalysisData(cachedResult);
        return;
    }

    // 2. If no cache, run analysis
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
        details: report.details as any
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
        structured_content: parsedData as any
      });

      if (error) throw new Error(error);

      // Trigger analysis - we need resumeVersionId, assuming latest for now.
      const { data: resumeVersion } = await supabase.from('resume_versions').select('*').eq('user_id', user.id).order('created_at', {ascending: false}).limit(1).single();

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

      {/* Overview + radar */}
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
                <RadarChart data={atsRadar} outerRadius={100}>
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
                  <Tooltip contentStyle={tooltipStyle} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metric cards */}
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

      {/* Section scores */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Section scores</CardTitle>
            <CardDescription>Per-section parse reliability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {atsSectionScores.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{s.label}</span>
                  <span className="font-semibold text-foreground">{s.score}</span>
                </div>
                <Progress
                  value={s.score}
                  className="h-2"
                  indicatorClassName={
                    s.score >= 90
                      ? 'bg-emerald-500'
                      : s.score >= 75
                      ? 'bg-primary'
                      : 'bg-amber-500'
                  }
                />
                <p className="text-xs text-muted-foreground">{s.detail}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
