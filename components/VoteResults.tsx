{/* LIST */}
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {votes.length === 0 ? (
    <p className="text-gray-300">No votes yet</p>
  ) : (
    votes.map((vote) => {
      const isOpen = expanded === vote.id;

      return (
        <div
          key={vote.id}
          onClick={() => setExpanded(isOpen ? null : vote.id)}
          className="cursor-pointer rounded-xl bg-slate-800 p-4 transition hover:bg-slate-700"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <h3 className="font-bold">
              {vote.name ?? "Anonymous"}
            </h3>

            <span
              className={
                vote.vote === "YES"
                  ? "text-green-400"
                  : vote.vote === "NO"
                  ? "text-red-400"
                  : "text-gray-400"
              }
            >
              {vote.vote || "Pending"}
            </span>
          </div>

          {/* MESSAGE (COLLAPSIBLE) */}
          <p
            className={`mt-2 text-gray-300 transition-all duration-300 ${
              isOpen ? "" : "line-clamp-2"
            }`}
          >
            {vote.message ?? "No message"}
          </p>

          {/* HINT */}
          <p className="mt-2 text-xs text-gray-500">
            {isOpen ? "Click to collapse" : "Click to expand"}
          </p>
        </div>
      );
    })
  )}
</div>