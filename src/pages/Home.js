"use client";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";
import TaskCard from "../components/TaskCard";
import Navbar from "../components/Navbar";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(results);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto mt-6 p-4 space-y-4">
        <h1 className="text-2xl font-bold">Recent Blog Posts</h1>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <TaskCard key={post.id} post={post} isOwner={false} />
          ))
        )}
      </main>
    </>
  );
}
