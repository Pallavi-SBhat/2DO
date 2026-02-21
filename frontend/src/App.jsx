import { useState, useEffect } from "react";
import { Circle } from "lucide-react";
import TodoItem from "./components/TodoItem.jsx";
import TodoInput from "./components/TodoInput.jsx";

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

    // FETCH TODOS
 
  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}, [darkMode]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/todos");
      const data = await res.json();
      setTodos(data || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };


    //  ADD TODO
 
  const addTodo = async (title) => {
    try {
      const res = await fetch("http://localhost:4000/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  
    //  TOGGLE TODO
  
  const toggleTodo = async (id, completed) => {
    try {
      await fetch(`http://localhost:4000/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });

      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed } : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  
    //  DELETE TODO

  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:4000/api/todos/${id}`, {
        method: "DELETE",
      });

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };


    //  CLEAR COMPLETED
 
  const clearCompleted = async () => {
    const completedTodos = todos.filter((todo) => todo.completed);

    try {
      for (let todo of completedTodos) {
        await fetch(`http://localhost:4000/api/todos/${todo.id}`, {
          method: "DELETE",
        });
      }

      setTodos(todos.filter((todo) => !todo.completed));
    } catch (error) {
      console.error("Error clearing completed todos:", error);
    }
  };
    //  FILTER LOGIC
  
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter((todo) => !todo.completed).length;
  const completedTodosCount = todos.filter((todo) => todo.completed).length;

 return (
   <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-14 px-6 transition-colors duration-500">
    <div className="w-full max-w-5xl mx-auto">

      {/* HEADER */}
  {/* HEADER */}
{/* HEADER */}
<div className="relative mb-12 text-center">

  {/* Dark Mode Button */}
  <div className="absolute right-0 top-0">
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white transition"
    >
      {darkMode ? "☀️ Light" : "🌙 Dark"}
    </button>
  </div>

  {/* Centered Title */}
  <h1 className="text-6xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
    2DoList
  </h1>

  <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg">
    Plan it. Do it. Complete it.
  </p>

</div>

      {/* INPUT CARD */}
      <div className="bg-white/70 dark:bg-gray-800 backdrop-blur-lg rounded-3xl shadow-xl p-6 mb-8 border border-white/40">
        <TodoInput onAdd={addTodo} />
      </div>

      {/* PROGRESS BAR */}
      {todos.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>
              {completedTodosCount}/{todos.length} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-3 transition-all duration-500"
              style={{
                width: `${(completedTodosCount / todos.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* MAIN CARD */}
      <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 dark:border-gray-700">
        {/* FILTERS */}
<div className="p-5 border-b bg-gray-50 dark:bg-gray-900 flex justify-between flex-wrap gap-4">
          <div className="flex gap-3">
            {["all", "active", "completed"].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  filter === type
                    ? "bg-indigo-600 text-white shadow-md scale-105"
                    : "bg-white text-gray-600 hover:bg-gray-200"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {completedTodosCount > 0 && (
            <button
              onClick={clearCompleted}
              className="text-sm font-medium text-red-500 hover:text-red-600 transition"
            >
              Clear Completed
            </button>
          )}
        </div>

        {/* LIST */}
        <div className="divide-y">

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-500 dark:text-gray-300">Loading tasks...</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="p-12 text-center text-gray-400 dark:text-gray-400">
              <p className="text-xl font-semibold">
                No tasks yet 🚀
              </p>
              <p className="text-sm mt-2">
                Add your first task above
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

      {/* FOOTER */}
      {todos.length > 0 && (
        <div className="text-center mt-8 text-gray-600 dark:text-gray-300 text-sm">
          {activeTodosCount === 0 ? (
            <span className="text-green-600 font-semibold">
              🎉 All tasks completed!
            </span>
          ) : (
            <span>
              {activeTodosCount} task
              {activeTodosCount !== 1 && "s"} remaining
            </span>
          )}
        </div>
      )}

    </div>
  </div>
);
}

export default App;