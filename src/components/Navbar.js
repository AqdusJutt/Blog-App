export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-4 py-2">
      <h1 className="text-xl font-bold">My Blog</h1>
    </nav>
  );
}



"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { app } from "../services/firebase";

export default function Navbar() {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center text-white">
      <Link href="/" className="text-xl font-bold">BlogApp</Link>
      <div className="flex gap-4">
        {!user ? (
          <>
            <Link href="/login" className="hover:underline">Login</Link>
            <Link href="/register" className="hover:underline">Register</Link>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
