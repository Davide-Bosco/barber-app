#!/usr/bin/env node
/*
Run with environment variables set:
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY  or SUPABASE_SERVICE_ROLE_KEY

Usage:
  NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... node scripts/create_staff_user.js username password

This script will hash the password with bcrypt and insert a row into `staff_users`.
*/

async function main() {
  const [,, username, password] = process.argv
  if (!username || !password) {
    console.error('Usage: node scripts/create_staff_user.js username password')
    process.exit(1)
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY.')
    process.exit(1)
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const bcrypt = await import('bcryptjs')
    const supabase = createClient(SUPABASE_URL.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, ''), SUPABASE_KEY)

    const hashed = bcrypt.hashSync(password, 10)

    const { data, error } = await supabase.from('staff_users').insert({ username, password_hash: hashed }).select()
    if (error) {
      console.error('Supabase error:', error.message || error)
      process.exit(1)
    }

    console.log('Created staff user:', data)
    process.exit(0)
  } catch (e) {
    console.error('Error:', e && e.message ? e.message : e)
    process.exit(1)
  }
}

main()
