export type Car = {
  id: number
  registry_id: string
  slug: string
  registration: string | null
  registration_visibility: string | null
  partial_vin: string | null
  colour: string | null
  interior: string | null
  country: string | null
  status: string | null
  owner_count: number | null
  current_owner_since: number | null
  ownership_status: string | null
  entry_type: string | null
  summary: string | null
  data_confidence: string | null
  originality_rating: string | null
  photo_count: number | null
  document_count: number | null
  created_at: string | null
  updated_at: string | null
  updated_by: string | null
}

export type Registration = {
  id: number
  car_id: number
  registration: string
  start_year: number | null
  end_year: number | null
  current_registration: boolean | null
  sort_order: number | null
  notes: string | null
}

export type OriginalityItem = {
  id: number
  car_id: number
  category: string
  item_name: string
  status: string
  notes: string | null
}

export type ChangeLogEntry = {
  id: number
  car_id: number
  change_date: string | null
  updated_by: string | null
  change_text: string
}

export type Source = {
  id: number
  car_id: number
  source_type: string | null
  source_name: string | null
  source_url: string | null
  source_date: string | null
  notes: string | null
  public: boolean | null
}

export type Photo = {
  id: number
  car_id: number
  image_url: string
  caption: string | null
  public: boolean | null
  sort_order: number | null
  created_at: string | null
}

export type DocumentRecord = {
  id: number
  car_id: number
  name: string
  document_url: string | null
  public: boolean | null
  notes: string | null
  created_at: string | null
}

export type CarDetails = Car & {
  registrations: Registration[]
  originality_items: OriginalityItem[]
  change_log: ChangeLogEntry[]
  sources: Source[]
  photos: Photo[]
  documents: DocumentRecord[]
}

export type ChangeRequest = {
  id: number
  car_id: number
  submitted_by: string
  request_type: string
  status: string
  proposed_changes: Record<string, unknown>
  admin_notes: string | null
  created_at: string | null
  reviewed_at: string | null
}
