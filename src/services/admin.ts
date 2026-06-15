import { supabase } from '../lib/supabase'

export type PendingChangeRequest = {
  id: number
  car_id: number
  request_type: string
  status: string
  proposed_changes: Record<string, unknown>
  admin_notes: string | null
  created_at: string | null
  cars?: {
    registry_id: string
    registration: string | null
    slug: string
  } | null
}

export type PendingOwnershipClaim = {
  id: number
  car_id: number
  submitted_by: string
  submitted_email: string | null
  claim_notes: string | null
  status: string
  created_at: string | null
  cars?: {
    registry_id: string
    registration: string | null
    slug: string
  } | null
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) return false

  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', auth.user.id)
    .maybeSingle()

  if (error) return false
  return Boolean(data)
}

export async function fetchPendingChangeRequests(): Promise<PendingChangeRequest[]> {
  const { data, error } = await supabase
    .from('change_requests')
    .select('*, cars(registry_id, registration, slug)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as PendingChangeRequest[]
}

export async function fetchPendingOwnershipClaims(): Promise<PendingOwnershipClaim[]> {
  const { data, error } = await supabase
    .from('ownership_claims')
    .select('*, cars(registry_id, registration, slug)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as PendingOwnershipClaim[]
}

export async function reviewChangeRequest(id: number, status: 'approved' | 'rejected', adminNotes: string) {
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) throw new Error('You must be signed in.')

  const { error } = await supabase
    .from('change_requests')
    .update({ status, admin_notes: adminNotes, reviewed_at: new Date().toISOString(), reviewed_by: auth.user.id })
    .eq('id', id)

  if (error) throw error
}

export async function reviewOwnershipClaim(id: number, status: 'approved' | 'rejected', adminNotes: string) {
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) throw new Error('You must be signed in.')

  const { data: claim, error: claimError } = await supabase
    .from('ownership_claims')
    .select('id, car_id, submitted_by, user_id')
    .eq('id', id)
    .single()

  if (claimError) throw claimError

  const ownerUserId = claim.user_id ?? claim.submitted_by

  if (status === 'approved') {
    if (!ownerUserId) {
      throw new Error('This claim does not have a user ID attached.')
    }

    const { error: ownerError } = await supabase
      .from('car_owners')
      .upsert(
        {
          car_id: claim.car_id,
          user_id: ownerUserId,
          role: 'owner',
          current_owner: true,
          approved: true,
        },
        { onConflict: 'car_id,user_id' },
      )

    if (ownerError) throw ownerError

    const { error: carError } = await supabase
      .from('cars')
      .update({ ownership_status: 'claimed', updated_at: new Date().toISOString(), updated_by: 'Registry administrator' })
      .eq('id', claim.car_id)

    if (carError) throw carError
  }

  const { error } = await supabase
    .from('ownership_claims')
    .update({ status, admin_notes: adminNotes, reviewed_at: new Date().toISOString(), reviewed_by: auth.user.id })
    .eq('id', id)

  if (error) throw error
}
