"use client";

import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { auth } from "@/lib/firebase";

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      setError("Firebase config is missing.");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  const signInWithGoogle = async () => {
    setError(null);
    if (!auth) {
      setError("Firebase config is missing.");
      return;
    }
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to sign in.";
      setError(message);
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    setError(null);
    if (!auth) {
      setError("Firebase config is missing.");
      return;
    }
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (displayName?.trim()) {
        await updateProfile(newUser, { displayName: displayName.trim() });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to sign up.";
      setError(message);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setError(null);
    if (!auth) {
      setError("Firebase config is missing.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to sign in.";
      setError(message);
    }
  };

  const signOutUser = async () => {
    setError(null);
    if (!auth) {
      setError("Firebase config is missing.");
      return;
    }
    try {
      await signOut(auth);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to sign out.";
      setError(message);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      signInWithGoogle,
      signUpWithEmail,
      signInWithEmail,
      signOutUser,
      clearError,
    }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
