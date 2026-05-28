"use client";

import { Search, FileX } from "lucide-react";

interface EmptyStateProps {
  type: "empty" | "not-found";
  title: string;
  description: string;
  icon?: "search" | "file";
}

export default function EmptyState({ type, title, description, icon = "search" }: EmptyStateProps) {
  const IconComponent = icon === "search" ? Search : FileX;
  
  return (
    <div className="card text-center py-12">
      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
        type === "empty" ? "bg-gray-100" : "bg-red-100"
      }`}>
        <IconComponent className={`h-8 w-8 ${
          type === "empty" ? "text-gray-400" : "text-red-500"
        }`} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mx-auto">{description}</p>
    </div>
  );
}