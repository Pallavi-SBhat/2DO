import { useState } from 'react';
import { Plus } from 'lucide-react';

function TodoInput({ onAdd }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onAdd(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-1 px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 active:scale-95 transition-all font-medium flex items-center gap-2 shadow-lg shadow-blue-500/30"
      >
        <Plus className="w-5 h-5" />
        Add Task
      </button>
    </form>
  );
}

export default TodoInput;
