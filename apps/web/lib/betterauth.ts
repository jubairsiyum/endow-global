// Lightweight scaffold for BetterAuth adapter utilities.
// Integrate with existing apps/web/lib/auth.ts and Drizzle adapter logic.

export async function linkOrCreateUserFromProvider(provider: string, profile: any) {
  // TODO: implement mapping to `users` and `accounts` tables using Drizzle ORM.
  // This helper should: normalize provider profile, find existing user by email or provider account,
  // create user/account rows if missing, and return the canonical user id and role.

  return {
    userId: null,
    note: 'scaffold - implement mapping to users/accounts using Drizzle',
  };
}
