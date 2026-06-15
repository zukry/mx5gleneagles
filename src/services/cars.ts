import { supabase } from '../lib/supabase'
import type { Car, CarDetails, ChangeRequest, ChangeLogEntry, DocumentRecord, OriginalityItem, Photo, Registration, Source } from '../types/database'

export type ViewerOwnershipState = {
  signedIn: boolean
  isApprovedOwner: boolean
  hasPendingClaim: boolean
}

export async function fetchCars(): Promise<Car[]> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('registry_id', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function fetchCarBySlug(slug: string): Promise<CarDetails | null> {
  const { data: car, error } = await supabase
    .from('cars')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  if (!car) return null

  const carId = car.id as number

  const [registrations, originality, changeLog, sources, photos, documents] = await Promise.all([
    supabase.from('registrations').select('*').eq('car_id', carId).order('sort_order', { ascending: true }),
    supabase.from('originality_items').select('*').eq('car_id', carId).order('category', { ascending: true }).order('id', { ascending: true }),
    supabase.from('change_log').select('*').eq('car_id', carId).order('change_date', { ascending: false }),
    supabase.from('sources').select('*').eq('car_id', carId).order('source_date', { ascending: false, nullsFirst: false }),
    supabase.from('photos').select('*').eq('car_id', carId).eq('public', true).order('sort_order', { ascending: true }),
    supabase.from('documents').select('*').eq('car_id', carId).eq('public', true).order('created_at', { ascending: false }),
  ])

  const errors = [registrations.error, originality.error, changeLog.error, sources.error, photos.error, documents.error].filter(Boolean)
  if (errors.length) throw errors[0]

  return {
    ...(car as Car),
    registrations: (registrations.data ?? []) as Registration[],
    originality_items: (originality.data ?? []) as OriginalityItem[],
    change_log: (changeLog.data ?? []) as ChangeLogEntry[],
    sources: (sources.data ?? []) as Source[],
    photos: (photos.data ?? []) as Photo[],
    documents: (documents.data ?? []) as DocumentRecord[],
  }
}

export async function fetchViewerOwnershipState(carId: number): Promise<ViewerOwnershipState> {
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) {
    return { signedIn: false, isApprovedOwner: false, hasPendingClaim: false }
  }

  const userId = auth.user.id

  const [ownerLink, pendingClaimBySubmittedBy, pendingClaimByUserId] = await Promise.all([
    supabase
      .from('car_owners')
      .select('id')
      .eq('car_id', carId)
      .eq('user_id', userId)
      .eq('approved', true)
      .eq('current_owner', true)
      .maybeSingle(),
    supabase
      .from('ownership_claims')
      .select('id')
      .eq('car_id', carId)
      .eq('submitted_by', userId)
      .eq('status', 'pending')
      .maybeSingle(),
    supabase
      .from('ownership_claims')
      .select('id')
      .eq('car_id', carId)
      .eq('user_id', userId)
      .eq('status', 'pending')
      .maybeSingle(),
  ])

  const ownerError = ownerLink.error
  const pendingError = pendingClaimBySubmittedBy.error ?? pendingClaimByUserId.error

  if (ownerError) throw ownerError
  if (pendingError) throw pendingError

  return {
    signedIn: true,
    isApprovedOwner: Boolean(ownerLink.data),
    hasPendingClaim: Boolean(pendingClaimBySubmittedBy.data ?? pendingClaimByUserId.data),
  }
}

export async function requestOwnershipClaim(carId: number) {
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) throw new Error('You must be signed in to claim a car.')

  const state = await fetchViewerOwnershipState(carId)
  if (state.isApprovedOwner) throw new Error('This car is already claimed by you.')
  if (state.hasPendingClaim) throw new Error('You already have a pending claim for this car.')

  const { error } = await supabase.from('ownership_claims').insert({
    car_id: carId,
    submitted_by: auth.user.id,
    user_id: auth.user.id,
    submitted_email: auth.user.email,
    claimant_email: auth.user.email,
    claim_notes: 'Claim submitted from car page. Registry admin should contact the user for proof of ownership.',
    status: 'pending',
  })

  if (error) {
    if (error.code === '23505') {
      throw new Error('You already have a pending claim for this car.')
    }
    throw error
  }
}

export async function submitChangeRequest(carId: number, proposedChanges: Record<string, unknown>) {
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) throw new Error('You must be signed in to submit an update.')

  const { error } = await supabase.from('change_requests').insert({
    car_id: carId,
    submitted_by: auth.user.id,
    request_type: 'car_update',
    status: 'pending',
    proposed_changes: proposedChanges,
  })

  if (error) throw error
}

export async function fetchMyChangeRequests(): Promise<ChangeRequest[]> {
  const { data, error } = await supabase
    .from('change_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as ChangeRequest[]
}
