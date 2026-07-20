'use client';

import { useEffect, useState, type KeyboardEvent } from 'react';
import {
  Briefcase,
  Github,
  GraduationCap,
  Globe,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ErrorState } from '@/components/shared/error-state';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-profile';
import { educationPlaceholder, experiencePlaceholder } from '@/lib/mock/profile';
import { getInitials } from '@/lib/utils';

type FormState = {
  full_name: string;
  headline: string;
  email: string;
  location: string;
  bio: string;
  github_url: string;
  linkedin_url: string;
  portfolio_url: string;
};

const emptyForm: FormState = {
  full_name: '',
  headline: '',
  email: '',
  location: '',
  bio: '',
  github_url: '',
  linkedin_url: '',
  portfolio_url: '',
};

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, loading, error, refetch, updateProfile } = useProfile();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);

  // Seed the editable form once the real profile has loaded. Only runs once
  // per profile load so it doesn't clobber in-progress edits.
  useEffect(() => {
    if (!profile || initialized) return;
    setForm({
      full_name: profile.full_name ?? '',
      headline: profile.headline ?? '',
      email: user?.email ?? '',
      location: profile.location ?? '',
      bio: profile.bio ?? '',
      github_url: profile.github_url ?? '',
      linkedin_url: profile.linkedin_url ?? '',
      portfolio_url: profile.portfolio_url ?? '',
    });
    setSkills(profile.skills ?? []);
    setInitialized(true);
  }, [profile, initialized, user]);

  const updateField = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const addSkill = (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    setSkills((prev) => (prev.some((s) => s.toLowerCase() === value.toLowerCase()) ? prev : [...prev, value]));
    setSkillInput('');
  };

  const removeSkill = (value: string) => {
    setSkills((prev) => prev.filter((s) => s !== value));
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const save = async () => {
    setSaving(true);
    const { error: saveError } = await updateProfile({
      full_name: form.full_name || null,
      headline: form.headline || null,
      bio: form.bio || null,
      location: form.location || null,
      github_url: form.github_url || null,
      linkedin_url: form.linkedin_url || null,
      portfolio_url: form.portfolio_url || null,
      skills,
    });
    setSaving(false);

    if (saveError) {
      toast.error('Could not save profile', { description: saveError });
      return;
    }
    toast.success('Profile saved');
  };

  if (loading) {
    return (
      <>
        <DashboardHeader title="Profile" subtitle="Your public profile and resume details." />
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border py-24 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-sm">Loading your profile…</p>
        </div>
      </>
    );
  }

  if (error && !profile) {
    return (
      <>
        <DashboardHeader title="Profile" subtitle="Your public profile and resume details." />
        <ErrorState
          title="Couldn't load your profile"
          description={error}
          onRetry={refetch}
          className="mt-2"
        />
      </>
    );
  }

  const displayName = form.full_name || user?.email || 'Your profile';

  return (
    <>
      <DashboardHeader title="Profile" subtitle="Your public profile and resume details." />

      {/* Header card */}
      <Card className="overflow-hidden shadow-card">
        <div className="h-28 bg-gradient-to-r from-primary via-primary to-secondary" />
        <CardContent className="relative -mt-12 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-background bg-gradient-to-br from-primary to-secondary text-2xl font-semibold text-white shadow-card">
                {getInitials(displayName)}
              </div>
              <div className="pb-1">
                <h2 className="text-xl font-semibold text-foreground">{displayName}</h2>
                <p className="text-sm text-muted-foreground">{form.headline || 'Add a headline'}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-lg">
              <Upload className="mr-1.5 h-3.5 w-3.5" />
              Change photo
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Personal info */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Personal information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" value={form.full_name} onChange={updateField('full_name')} />
            <Field label="Headline" value={form.headline} onChange={updateField('headline')} />
            <Field label="Email" value={form.email} icon={Mail} disabled />
            <Field
              label="Location"
              value={form.location}
              onChange={updateField('location')}
              icon={MapPin}
            />
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-xs">Bio</Label>
              <Textarea
                value={form.bio}
                onChange={updateField('bio')}
                rows={3}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social links */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Social links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <SocialField icon={Github} label="GitHub" value={form.github_url} onChange={updateField('github_url')} />
            <SocialField
              icon={Linkedin}
              label="LinkedIn"
              value={form.linkedin_url}
              onChange={updateField('linkedin_url')}
            />
            <SocialField
              icon={Globe}
              label="Portfolio"
              value={form.portfolio_url}
              onChange={updateField('portfolio_url')}
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* Experience */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Briefcase className="h-4 w-4 text-primary" /> Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {experiencePlaceholder.map((e) => (
              <div key={e.id} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{e.role}</p>
                  <span className="text-xs text-muted-foreground">
                    {e.start} – {e.end}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{e.company}</p>
                <p className="mt-1.5 text-xs text-muted-foreground">{e.summary}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="h-4 w-4 text-secondary" /> Education
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {educationPlaceholder.map((e) => (
              <div key={e.id} className="rounded-xl border border-border p-4">
                <p className="text-sm font-semibold text-foreground">{e.school}</p>
                <p className="text-xs text-muted-foreground">
                  {e.degree} · {e.field}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {e.start} – {e.end}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Skills */}
      <Card className="mt-4 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-accent" /> Skills
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <Badge key={s} variant="outline" className="gap-1.5 py-1.5 pl-2.5 pr-1.5 font-normal">
                {s}
                <button
                  type="button"
                  onClick={() => removeSkill(s)}
                  aria-label={`Remove ${s}`}
                  className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {skills.length === 0 && (
              <p className="text-xs text-muted-foreground">No skills added yet.</p>
            )}
          </div>
          <div className="flex gap-2 sm:max-w-xs">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="Add a skill and press Enter"
              className="h-9"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 rounded-lg"
              onClick={() => addSkill(skillInput)}
            >
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-5 flex justify-end">
        <Button onClick={save} className="rounded-xl" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {saving ? 'Saving…' : 'Save profile'}
        </Button>
      </div>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  icon: Icon,
  disabled,
}: {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={Icon ? 'pl-9' : ''}
        />
      </div>
    </div>
  );
}

function SocialField({
  icon: Icon,
  label,
  value,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={value} onChange={onChange} className="pl-9" />
      </div>
    </div>
  );
}
