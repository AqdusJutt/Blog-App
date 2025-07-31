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
import TaskForm from "../components/Taskform";
import TaskCard from "../components/TaskCard";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const auth = getAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/login");
      else setUser(user);
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError("");
    const q = query(
      collection(db, "posts"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(results);
        setLoading(false);
      },
      (err) => {
        setError("Failed to fetch posts.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async ({ title, content }) => {
    try {
      setError("");
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
      setError("Error saving post.");
      console.error("Error saving post:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await deleteDoc(doc(db, "posts", id));
    } catch (error) {
      setError("Error deleting post.");
      console.error("Error deleting post:", error);
    }
  };

  const handleEdit = (post) => {
    setEditing(post);
  };

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto mt-6 p-4 space-y-6">
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
        )}
        <TaskForm onSubmit={handleSubmit} initialData={editing} />
        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : posts.length === 0 ? (
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
