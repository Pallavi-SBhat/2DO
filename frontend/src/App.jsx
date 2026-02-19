import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase.js';
import { Plus, Trash2, Check, Circle } from 'lucide-react';
import TodoItem from './components/TodoItem.jsx';
import TodoInput from './components/TodoInput.jsx';

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching todos:', error);
    } else {
      setTodos(data || []);
    }
    setLoading(false);
  };

  const addTodo = async (title) => {
    const { data, error } = await supabase
      .from('todos')
      .insert([{ title, completed: false }])
      .select()
      .single();

    if (error) {
      console.error('Error adding todo:', error);
    } else if (data) {
      setTodos([data, ...todos]);
    }
  };

  const toggleTodo = async (id, completed) => {
    const { error } = await supabase
      .from('todos')
      .update({ completed })
      .eq('id', id);

    if (error) {
      console.error('Error updating todo:', error);
    } else {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed } : todo
      ));
    }
  };

  const deleteTodo = async (id) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting todo:', error);
    } else {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  const clearCompleted = async () => {
    const completedIds = todos.filter(todo => todo.completed).map(todo => todo.id);

    const { error } = await supabase
      .from('todos')
      .delete()
      .in('id', completedIds);

    if (error) {
      console.error('Error clearing completed todos:', error);
    } else {
      setTodos(todos.filter(todo => !todo.completed));
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">My Tasks</h1>
          <p className="text-gray-600">Organize your day, one task at a time</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <TodoInput onAdd={addTodo} />
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === 'all'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({todos.length})
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === 'active'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Active ({activeTodosCount})
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === 'completed'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Completed ({completedTodosCount})
                </button>
              </div>
              {completedTodosCount > 0 && (
                <button
                  onClick={clearCompleted}
                  className="px-4 py-2 rounded-lg font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                >
                  Clear Completed
                </button>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4">Loading tasks...</p>
              </div>
            ) : filteredTodos.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Circle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">
                  {filter === 'completed'
                    ? 'No completed tasks yet'
                    : filter === 'active'
                    ? 'No active tasks. Time to relax!'
                    : 'No tasks yet. Add one to get started!'}
                </p>
              </div>
            ) : (
              filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))
            )}
          </div>
        </div>

        {todos.length > 0 && (
          <div className="text-center mt-6 text-sm text-gray-600">
            {activeTodosCount === 0 ? (
              <p className="font-medium text-green-600">All tasks completed!</p>
            ) : (
              <p>
                {activeTodosCount} {activeTodosCount === 1 ? 'task' : 'tasks'} remaining
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
