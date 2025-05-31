// auth.js

const supabaseUrl = 'https://hekbaoeuknlzpelqbkmy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhla2Jhb2V1a25senBlbHFia215Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MjQ2NTksImV4cCI6MjA2NDIwMDY1OX0.eip0nBkXozALbCF3wr2TuKJCalBzn-6gP7Hw0cMWq2k';
export const supabase = createClient(supabaseUrl, supabaseKey);

export async function checkAuthAndUpdateNav() {
  const { data: { session } } = await supabase.auth.getSession();

  const loginNav = document.getElementById('login-nav');
  const profileNav = document.getElementById('profile-nav');
  const profileName = document.getElementById('profile-name');
  const navXP = document.getElementById('nav-xp');

  if (session && session.user) {
    // Logged in
    loginNav.style.display = 'none';
    profileNav.style.display = 'flex';

    // Optionally show user's email
    profileName.textContent = `${session.user.email} ▼`;

    // Load XP
    try {
      const { data, error } = await supabase
        .from('xp')
        .select('value')
        .eq('user_id', session.user.id)
        .single();

      if (!error && data) {
        navXP.textContent = data.value;
      } else {
        navXP.textContent = '0';
      }
    } catch (err) {
      console.error("XP fetch error:", err);
    }
  } else {
    // Logged out
    loginNav.style.display = 'block';
    profileNav.style.display = 'none';
  }
}
