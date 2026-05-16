const { createClient } = require('@supabase/supabase-js');

const env = Object.fromEntries(
  require('fs').readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split('='))
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStaffUsers() {
  try {
    const { data, error } = await supabase
      .from('staff_users')
      .select('*');

    if (error) {
       console.error('Error fetching staff_users:', error.message);
       if (error.code === '42P01') {
         console.log('The table "staff_users" does not exist.');
       }
    } else {
      console.log('Table "staff_users" exists.');
      console.log('Users in it:', JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkStaffUsers();
