"use client";
import React from "react";

export default function TaskCard({ post, onEdit, onDelete, isOwner }) {
  return (
    <div className="bg-white p-4 rounded shadow-md space-y-2">
      <h3 className="text-xl font-bold">{post.title}</h3>
      <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>

      {isOwner && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onEdit(post)}
            className="text-blue-600 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
