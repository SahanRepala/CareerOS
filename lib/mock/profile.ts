// NOTE: `profiles` in the database only stores the fields surfaced on the
// Profile page (full_name, headline, bio, location, skills, and social
// links) — see supabase/migrations/20260720000002_add_profile_fields.sql.
// There is no `experience` / `education` table yet (that belongs to a
// future resume/experience feature, out of scope here), so those two
// sections keep static placeholder content for now.
export interface ProfileEducation {
  id: string;
  school: string;
  degree: string;
  field: string;
  start: string;
  end: string;
}

export interface ProfileExperience {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  summary: string;
}

export const educationPlaceholder: ProfileEducation[] = [
  {
    id: 'pe1',
    school: 'University of Washington',
    degree: 'B.S.',
    field: 'Computer Science',
    start: '2016',
    end: '2020',
  },
];

export const experiencePlaceholder: ProfileExperience[] = [
  {
    id: 'px1',
    company: 'Linear',
    role: 'Senior Frontend Engineer',
    start: '2022',
    end: 'Present',
    summary: 'Lead the sync and design-system workstreams.',
  },
  {
    id: 'px2',
    company: 'Vercel',
    role: 'Frontend Engineer',
    start: '2020',
    end: '2022',
    summary: 'Shipped dashboard analytics and the edge playground.',
  },
];
