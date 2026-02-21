import { Check, Trash2 } from "lucide-react";

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className="
  flex items-center justify-between px-6 py-4
  hover:bg-gray-50 dark:hover:bg-gray-700
  transition-all duration-200 group
">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">

        {/* CLEAR CHECKBOX STYLE */}
        <button
          onClick={() => onToggle(todo.id, !todo.completed)}
          className={`
            w-7 h-7 flex items-center justify-center
            rounded-md border-2 cursor-pointer
            transition-all duration-200
            ${
              todo.completed
                ? "bg-green-500 border-green-500"
                : "border-gray-400 hover:border-indigo-500 hover:bg-indigo-50"
            }
          `}
        >
          {todo.completed && (
            <Check
              size={18}
              className="text-white"
              strokeWidth={3}
            />
          )}
        </button>

        {/* TASK TEXT */}
        <span
  className={`
    text-lg transition-all
    ${
      todo.completed
        ? "line-through text-gray-400 dark:text-gray-500"
        : "text-gray-800 dark:text-white"
    }
  `}
>
  {todo.title}
</span>
      </div>

      {/* DELETE BUTTON */}
      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

export default TodoItem;