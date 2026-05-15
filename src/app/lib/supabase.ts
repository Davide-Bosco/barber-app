import { createClient } from '@supabase/supabase-js';

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey =
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
	process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseAnonKey) {
	throw new Error('Missing Supabase key. Set NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.')
}

// Accept both project URL and /rest/v1 URL from env, then normalize to project root.
const supabaseUrl = rawSupabaseUrl
	.replace(/\/rest\/v1\/?$/, '')
	.replace(/\/$/, '');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
