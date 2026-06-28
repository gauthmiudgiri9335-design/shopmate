const SUPABASE_URL = "https://ybmlkhbiduzzusrlxwyl.supabase.co";
const SUPABASE_KEY = "sb_publishable_mwn3ln12gocjsx5BnSUsdQ_ESWs0bnT";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

window.db = supabaseClient;