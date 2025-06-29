import React from "react";

export default function PaginationForList({ page, totalPages, setPage }) {
  return (
    <div className="flex justify-center pt-4">
      <div className="join">
        <button
          className="join-item btn btn-sm"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          ⬅️ Prev
        </button>
        <button className="join-item btn btn-sm btn-disabled">
          Page {page} / {totalPages}
        </button>
        <button
          className="join-item btn btn-sm"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
}
