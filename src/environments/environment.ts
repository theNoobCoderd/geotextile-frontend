/**
 * Development environment config.
 * The Supabase anon/publishable key is safe to ship to the browser — it's
 * the public client key, not a service-role secret. All privileged checks
 * happen server-side in the edge functions / RLS policies.
 */
export const environment = {
  production: false,
  supabaseUrl: 'https://fjqgiobjywtojvmbgtwo.supabase.co',
  supabaseAnonKey: 'sb_publishable_A3rrnQySpFypY-aVlnWQCQ_wR8kNuzb',
  functionsUrl: 'https://fjqgiobjywtojvmbgtwo.supabase.co/functions/v1',
};
