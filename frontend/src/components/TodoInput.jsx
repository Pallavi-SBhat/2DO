import { useState } from "react";
import { Plus } from "lucide-react";

function TodoInput({ onAdd }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onAdd(input.trim());
      setInput("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-4 items-center"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="What needs to be done?"
        className="
          flex-1
          px-5 py-3
          text-lg
          text-gray-800
          bg-white
          placeholder-gray-400
          border border-gray-300
          rounded-2xl
          shadow-sm
          focus:outline-none
          focus:ring-2
          focus:ring-indigo-500
          focus:border-indigo-500
          transition
        "
      />

      <button
        type="submit"
        className="
          flex items-center gap-2
          px-6 py-3
          bg-gradient-to-r from-indigo-600 to-purple-600
          text-white
          font-semibold
          rounded-2xl
          shadow-lg
          hover:scale-105
          hover:shadow-xl
          active:scale-95
          transition-all
        "
      >
        <Plus size={18} />
        Add
      </button>
    </form>
  );
}

export default TodoInput;