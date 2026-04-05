import { AuthProvider as RealAuthProvider, useAuth as useRealAuth } from "@/contexts/AuthContext";

/**
 * Re-exporting from contexts/AuthContext to avoid duplication
 * and ensure all components use the same auth state.
 */
export const AuthProvider = RealAuthProvider;
export const useAuth = useRealAuth;