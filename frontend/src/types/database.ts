export type UserRole = 'student' | 'family' | 'tutor' | 'company' | 'admin'

export interface Profile {
  id: string
  role: UserRole
  center_id: string | null
  first_name: string
  last_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  is_active: boolean
  email_verified: boolean
  onboarding_completed: boolean
  notification_preferences: {
    email: boolean
    push: boolean
  }
  created_at: string
  updated_at: string
  last_login_at: string | null
}

export interface Center {
  id: string
  name: string
  code: string | null
  type: 'secondary' | 'vocational' | 'mixed'
  address: string | null
  city: string | null
  province: string | null
  postal_code: string | null
  autonomous_community: string | null
  email: string | null
  phone: string | null
  website: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  profile_id: string
  center_id: string
  current_grade: string
  academic_year: string
  group_name: string | null
  interests: string[]
  interest_scores: Record<string, number> | null
  preferred_path: string | null
  preferred_families: string[]
  questionnaire_completed: boolean
  questionnaire_completed_at: string | null
  assigned_tutor_id: string | null
  created_at: string
  updated_at: string
}

export interface GuardianLink {
  id: string
  guardian_id: string
  student_id: string
  relationship: 'father' | 'mother' | 'legal_guardian' | 'other'
  status: 'pending' | 'approved' | 'rejected'
  approved_by: string | null
  approved_at: string | null
  rejection_reason: string | null
  link_method: 'code' | 'manual' | 'invitation'
  link_code: string | null
  created_at: string
  updated_at: string
}

export interface Plan {
  id: string
  student_id: string
  center_id: string
  created_by: string
  title: string
  description: string | null
  objective: string | null
  start_date: string | null
  target_end_date: string | null
  status: 'draft' | 'active' | 'completed' | 'archived'
  progress_percentage: number
  created_at: string
  updated_at: string
}

export interface PlanItem {
  id: string
  plan_id: string
  title: string
  description: string | null
  position: number
  due_date: string | null
  completed_at: string | null
  status: 'pending' | 'in_progress' | 'completed'
  created_at: string
  updated_at: string
}

export interface PlanTask {
  id: string
  plan_item_id: string
  title: string
  description: string | null
  task_type: 'general' | 'reading' | 'questionnaire' | 'event' | 'deliverable' | 'meeting'
  linked_resource_id: string | null
  linked_event_id: string | null
  position: number
  status: 'pending' | 'in_progress' | 'completed'
  completed_at: string | null
  completed_by: string | null
  evidence_url: string | null
  evidence_notes: string | null
  tutor_feedback: string | null
  tutor_feedback_at: string | null
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  center_id: string | null
  company_id: string | null
  created_by: string
  title: string
  description: string | null
  event_type: 'talk' | 'workshop' | 'visit' | 'open_day' | 'fair' | 'tutoring'
  start_datetime: string
  end_datetime: string
  location: string | null
  is_online: boolean
  online_url: string | null
  max_attendees: number | null
  registration_deadline: string | null
  target_grades: string[]
  target_interests: string[]
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'published' | 'cancelled' | 'completed'
  approval_notes: string | null
  approved_by: string | null
  approved_at: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface EventRegistration {
  id: string
  event_id: string
  student_id: string
  status: 'registered' | 'waitlist' | 'cancelled' | 'attended' | 'no_show'
  waitlist_position: number | null
  attended: boolean | null
  attended_marked_by: string | null
  attended_marked_at: string | null
  created_at: string
  updated_at: string
  cancelled_at: string | null
}

export interface Resource {
  id: string
  center_id: string | null
  company_id: string | null
  created_by: string
  title: string
  slug: string | null
  summary: string | null
  content: string | null
  resource_type: 'guide' | 'article' | 'video' | 'infographic' | 'faq' | 'external_link'
  audience: 'all' | 'students' | 'families' | 'tutors'
  featured_image_url: string | null
  video_url: string | null
  attachment_url: string | null
  external_url: string | null
  status: 'draft' | 'pending_approval' | 'approved' | 'published' | 'archived'
  approved_by: string | null
  approved_at: string | null
  view_count: number
  created_at: string
  updated_at: string
  published_at: string | null
}

export interface Company {
  id: string
  profile_id: string
  company_name: string
  trade_name: string | null
  cif: string | null
  sector: string | null
  description: string | null
  website: string | null
  logo_url: string | null
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  approved_by: string | null
  approved_at: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
}

export interface FormativeOption {
  id: string
  category: 'bachillerato' | 'fp_basica' | 'fp_medio' | 'fp_superior' | 'university' | 'other'
  family: string | null
  name: string
  official_code: string | null
  description: string | null
  duration: string | null
  access_requirements: string | null
  minimum_grade: string | null
  career_opportunities: string[] | null
  further_studies: string[] | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Thread {
  id: string
  subject: string | null
  context_type: 'general' | 'plan' | 'event' | 'proposal' | null
  context_id: string | null
  is_archived: boolean
  created_at: string
  updated_at: string
  last_message_at: string | null
}

export interface Message {
  id: string
  thread_id: string
  sender_id: string
  content: string
  attachments: Array<{
    name: string
    url: string
    type: string
    size: number
  }>
  is_edited: boolean
  edited_at: string | null
  created_at: string
}

export interface Invitation {
  id: string
  email: string | null
  role: 'student' | 'family' | 'tutor'
  center_id: string
  code: string
  created_by: string
  status: 'pending' | 'accepted' | 'expired' | 'revoked'
  expires_at: string
  accepted_at: string | null
  accepted_by: string | null
  created_at: string
}
