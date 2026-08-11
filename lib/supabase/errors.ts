/**
 * Maps Supabase Auth errors (and raw network/fetch failures) to short,
 * user-facing messages. Falls back to the original message when we don't
 * recognize the shape, so nothing is silently swallowed.
 */
export function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'Something went wrong. Please try again.';
  }

  const message = error.message.toLowerCase();

  if (
    message.includes('failed to fetch') ||
    message.includes('networkerror') ||
    message.includes('load failed') ||
    message.includes('network request failed')
  ) {
    return "Couldn't reach the server. Check your connection and try again.";
  }

  if (message.includes('invalid login credentials')) {
    return 'Incorrect email or password.';
  }

  if (message.includes('email not confirmed')) {
    return 'Please confirm your email address before signing in.';
  }

  if (message.includes('user already registered') || message.includes('already registered')) {
    return 'An account with this email already exists. Try signing in instead.';
  }

  if (message.includes('password') && (message.includes('weak') || message.includes('at least') || message.includes('should be'))) {
    return 'That password is too weak. Use at least 6 characters, mixing letters and numbers.';
  }

  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }

  return error.message;
}
