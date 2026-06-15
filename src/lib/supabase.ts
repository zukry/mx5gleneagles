import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://rsioukhprtsnxckyigan.supabase.co'
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'sb_publishable_bkcuzxtMB2hnESyj25wveg_7mjTMMMt'

export const supabase = createClient(supabaseUrl, supabasePublishableKey)
