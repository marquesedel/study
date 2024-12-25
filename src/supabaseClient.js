import { createClient } from '@supabase/supabase-js';

// Substitua pelos valores do seu Supabase
const supabaseUrl = 'https://vmtarnlsouzrkmoolxca.supabase.co'; // Coloque aqui a URL do Supabase
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtdGFybmxzb3V6cmttb29seGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NjcwMDMsImV4cCI6MjA1MDU0MzAwM30.Fp7vizjBY7ymAA23GyLbRZKunbd3zyTZHlWpipE1p00'; // Coloque aqui a chave pública (anon key)

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;