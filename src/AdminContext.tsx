import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

interface AdminContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType>({ user: null, isAdmin: false, loading: true });

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Double check against admins collection OR email
        const adminDoc = await getDoc(doc(db, 'admins', u.uid));
        const isWhitelisted = adminDoc.exists() || u.email === 'pixelpilots2013@gmail.com';
        setIsAdmin(isWhitelisted);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
  }, []);

  return (
    <AdminContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
