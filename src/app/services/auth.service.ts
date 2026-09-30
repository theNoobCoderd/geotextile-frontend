import { Injectable, signal } from '@angular/core';
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

/**
 * Thin wrapper around the Supabase JS auth client, used only by the admin
 * area. The storefront wizard talks to the edge functions with the plain
 * anon key (see PricingApiService) and never needs a signed-in session, so
 * this is the only place the `@supabase/supabase-js` client is instantiated.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly client: SupabaseClient = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

  /** Current session, kept in sync via onAuthStateChange. Null when signed out. */
  readonly session = signal<Session | null>(null);
  readonly initializing = signal(true);

  constructor() {
    this.client.auth.getSession().then(({ data }) => {
      this.session.set(data.session);
      this.initializing.set(false);
    });

    this.client.auth.onAuthStateChange((_event, session) => {
      this.session.set(session);
    });
  }

  async signInWithPassword(email: string, password: string): Promise<{ error: string | null }> {
    const { error } = await this.client.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  async signOut(): Promise<void> {
    await this.client.auth.signOut();
  }

  /** Access token to send as `Authorization: Bearer <token>` to admin edge functions. */
  get accessToken(): string | null {
    return this.session()?.access_token ?? null;
  }

  get isAuthenticated(): boolean {
    return this.session() !== null;
  }
}
