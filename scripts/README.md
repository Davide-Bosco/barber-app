Create a staff user

Usage:

```bash
# Provide your Supabase URL and a key with insert permissions (service role or anon if permitted):
NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... node scripts/create_staff_user.js myuser mypassword
```

The script hashes the password with bcrypt and inserts into the `staff_users` table.
