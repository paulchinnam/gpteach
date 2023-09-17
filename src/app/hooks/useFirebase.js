"use client";

import React, { useState, useContext, createContext, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";

import { useRouter } from "next/navigation";

const firebaseConfig = require("../firebaseConfig.json");
//import a bunch of stuff

const FirebaseContext = createContext();
const FirestoreContext = createContext();
const FirebaseUserContext = createContext();

function getUserProperties(user) {
  if (!user) return null;

  const { displayName, uid, email, photoURL } = user;
  const userData = {
    uid,
    email,
    photoURL,
  };

  if (displayName) userData.displayName = displayName;

  return userData;
}

export function FirebaseProvider({ children }) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore();
  const auth = getAuth();

  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      console.log("auth state changed \n user: ", user);
      const userData = getUserProperties(user);
      setUser(userData || null);
    });
  }, [db]);

  return (
    <FirebaseContext.Provider value={app}>
      <FirestoreContext.Provider value={db}>
        <FirebaseUserContext.Provider value={user}>
          {children}
        </FirebaseUserContext.Provider>
      </FirestoreContext.Provider>
    </FirebaseContext.Provider>
  );
}

export function useAuth() {
  const auth = getAuth();
  const context = useContext(FirebaseUserContext);
  const router = useRouter();

  if (context === undefined) {
    throw new Error("useAuth must be used inside of a FirebaseProvider!");
  }

  return {
    user: context,
    signInWithPopup: () => {
      const googleProvider = new GoogleAuthProvider();
      return signInWithPopup(auth, googleProvider).then(() =>
        router.push("/dashboard")
      );
    },
    signOut: () => signOut(auth),
    createUserWithEmailAndPassword: (email, password) => {
      return createUserWithEmailAndPassword(auth, email, password).then(() =>
        router.push("/dashboard")
      );
    },
    signInWithEmailAndPassword: (email, password) => {
      return signInWithEmailAndPassword(auth, email, password).then(() =>
        router.push("/dashboard")
      );
    },
  };
}

export function useFirestore() {
  const context = React.useContext(FirestoreContext);
  if (context === undefined) {
    throw new Error("useFirestore must be used within a FirebaseProvider");
  }
  return context;
}

export function useFirebase() {
  const context = React.useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}
