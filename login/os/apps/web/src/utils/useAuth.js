import { useCallback } from 'react';
import { authenticateUser, clearAuthData, storeAuthData } from './clientAuth';

function useAuth() {
  const signInWithCredentials = useCallback(async (options) => {
    const { email, password, callbackUrl, redirect } = options;

    const result = await authenticateUser(email, password);

    if (result.success) {
      // Store token
      storeAuthData(result.user, result.token);

      if (redirect && callbackUrl && typeof window !== 'undefined') {
        window.location.href = callbackUrl;
      }
      return result;
    } else {
      throw new Error(result.error || 'Authentication failed');
    }
  }, []);

  const signOut = useCallback(() => {
    clearAuthData();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }, []);

  // Mock other providers for now
  const signInWithGoogle = useCallback(() => console.log("Google login not implemented"), []);
  const signInWithFacebook = useCallback(() => console.log("Facebook login not implemented"), []);
  const signInWithTwitter = useCallback(() => console.log("Twitter login not implemented"), []);
  const signUpWithCredentials = useCallback(() => console.log("Sign up not implemented"), []);

  return {
    signInWithCredentials,
    signUpWithCredentials,
    signInWithGoogle,
    signInWithFacebook,
    signInWithTwitter,
    signOut,
  }
}

export default useAuth;