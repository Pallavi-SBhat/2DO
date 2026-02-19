import { Trash2, Check, Circle } from 'lucide-react';

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className="group p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onToggle(todo.id, !todo.completed)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            todo.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-blue-500'
          }`}
        >
          {todo.completed && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
        </button>

        <span
          className={`flex-1 text-lg transition-all ${
            todo.completed
              ? 'text-gray-400 line-through'
              : 'text-gray-800'
          }`}
        >
          {todo.title}
        </span>

        <button
          onClick={() => onDelete(todo.id)}
          className="flex-shrink-0 p-2 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg transition-all"
          title="Delete task"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
