"use client";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../services/firebase";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const auth = getAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/login");
      else setUser(user);
    });

    return () => unsubscribeAuth();
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "posts"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(results);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async ({ title, content }) => {
    try {
      if (editing) {
        const postRef = doc(db, "posts", editing.id);
        await updateDoc(postRef, { title, content });
        setEditing(null);
      } else {
        await addDoc(collection(db, "posts"), {
          title,
          content,
          uid: user.uid,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error saving post:", error);
      // Optionally, show error to user
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "posts", id));
    } catch (error) {
      console.error("Error deleting post:", error);
      // Optionally, show error to user
    }
  };

  const handleEdit = (post) => {
    setEditing(post);
  };

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto mt-6 p-4 space-y-6">
        <TaskForm onSubmit={handleSubmit} initialData={editing} />
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-gray-500">You haven't written any posts yet.</p>
          ) : (
            posts.map((post) => (
              <TaskCard
                key={post.id}
                post={post}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isOwner
              />
            ))
          )}
        </div>
      </main>
    </>
  );
}
