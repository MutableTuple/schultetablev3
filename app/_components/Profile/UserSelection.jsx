import React from "react";

export default function UserSelection({
  usersWithGames,
  toggleUserSelection,
  selectedIds,
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {usersWithGames.map((u) => (
        <div
          key={u.id}
          onClick={() => toggleUserSelection(u.id)}
          className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center shadow-sm transition ${
            selectedIds.includes(u.id)
              ? "border-primary bg-primary/10"
              : "hover:border-base-300"
          }`}
        >
          <img
            src={u.image}
            alt={u.name}
            className="w-12 h-12 rounded-full border mb-2"
          />
          <div className="text-sm font-medium text-center">{u.name}</div>
        </div>
      ))}
    </div>
  );
}
