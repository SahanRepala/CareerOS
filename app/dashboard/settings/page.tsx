'use client';

import { useState } from 'react';
import { Bell, Globe, Lock, Moon, Palette, Shield, Sun, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

const themes = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Palette },
] as const;

export default function SettingsPage() {
  const [theme, setTheme] = useState<(typeof themes)[number]['id']>('light');
  const [notifications, setNotifications] = useState({
    email: true,
    product: false,
    weekly: true,
    security: true,
  });

  return (
    <>
      <DashboardHeader title="Settings" subtitle="Manage your account and preferences." />

      <div className="space-y-4">
        {/* Theme */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-4 w-4 text-primary" /> Theme
            </CardTitle>
            <CardDescription>How CareerOS looks on this device.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              {themes.map((t) => {
                const Icon = t.icon;
                const active = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      toast.success(`Theme set to ${t.label}`);
                    }}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5',
                      active
                        ? 'border-primary bg-primary/5 shadow-card'
                        : 'border-border bg-card hover:shadow-card'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg',
                        active ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.id === 'system' ? 'Match OS' : t.id === 'dark' ? 'For night' : 'Default'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-secondary" /> Notifications
            </CardTitle>
            <CardDescription>Choose what we email you about.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <ToggleRow
              title="Application reminders"
              description="Deadlines and follow-ups for your tracked applications."
              checked={notifications.email}
              onChange={(v) => setNotifications((n) => ({ ...n, email: v }))}
            />
            <ToggleRow
              title="Weekly progress report"
              description="A Sunday digest of your ATS score, prep, and applications."
              checked={notifications.weekly}
              onChange={(v) => setNotifications((n) => ({ ...n, weekly: v }))}
            />
            <ToggleRow
              title="Product updates"
              description="New features and improvements as they ship."
              checked={notifications.product}
              onChange={(v) => setNotifications((n) => ({ ...n, product: v }))}
            />
            <ToggleRow
              title="Security alerts"
              description="Sign-in attempts and account changes."
              checked={notifications.security}
              onChange={(v) => setNotifications((n) => ({ ...n, security: v }))}
            />
          </CardContent>
        </Card>

        {/* Language */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4 text-accent" /> Language
            </CardTitle>
            <CardDescription>Interface and resume language.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Interface language</Label>
              <Select defaultValue="en">
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Resume language</Label>
              <Select defaultValue="en">
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English (US)</SelectItem>
                  <SelectItem value="en-gb">English (UK)</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Account */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-primary" /> Account
            </CardTitle>
            <CardDescription>Update your sign-in details.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input defaultValue="avery.mitchell@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">New password</Label>
              <Input type="password" placeholder="Leave blank to keep current" />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button className="rounded-lg" onClick={() => toast.success('Account updated')}>
                Save changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4 text-secondary" /> Privacy
            </CardTitle>
            <CardDescription>Control how your data is used.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <ToggleRow
              title="Use my resume to improve AI suggestions"
              description="We never share your data with recruiters or third parties."
              checked
              defaultChecked
            />
            <ToggleRow
              title="Anonymous usage analytics"
              description="Help us improve CareerOS with aggregated, non-identifying data."
              checked
              defaultChecked
            />
            <ToggleRow
              title="Show profile in hiring directory"
              description="Opt in to be discoverable by partner companies."
              checked={false}
              defaultChecked={false}
            />
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-rose-200 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-rose-600">
              <Lock className="h-4 w-4" /> Danger zone
            </CardTitle>
            <CardDescription>Irreversible actions. Proceed with caution.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50/40 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Delete account</p>
                <p className="text-xs text-muted-foreground">
                  Permanently delete your account, resumes, and applications.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="rounded-lg">
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Delete account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete your CareerOS account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your resumes, applications, and prep
                      history. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => toast.error('Account deletion is disabled in this demo')}
                    >
                      Yes, delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl px-2 py-3 transition-colors hover:bg-muted/50">
      <div className="pr-4">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
