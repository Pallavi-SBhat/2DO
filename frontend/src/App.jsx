import { useState, useEffect } from "react";
import { Circle } from "lucide-react";
import TodoItem from "./components/TodoItem.jsx";
import TodoInput from "./components/TodoInput.jsx";

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);


    // FETCH TODOS
 
  useEffect(() => {
    fetchTodos();
  }, []);

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

  /* =========================
     TOGGLE TODO
  ========================= */
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

  /* =========================
     DELETE TODO
  ========================= */
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

  /* =========================
     CLEAR COMPLETED
  ========================= */
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

  /* =========================
     FILTER LOGIC
  ========================= */
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter((todo) => !todo.completed).length;
  const completedTodosCount = todos.filter((todo) => todo.completed).length;

 return (
  <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-white to-purple-100 py-12 px-6">
    <div className="w-full max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          ✨ 2DO-List
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Stay productive. Stay organized.
        </p>
      </div>

      {/* INPUT CARD */}
      <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl p-6 mb-6 border border-gray-100">
        <TodoInput onAdd={addTodo} />
      </div>

      {/* TODO LIST CARD */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

        {/* FILTER SECTION */}
        <div className="p-5 border-b bg-gray-50 flex flex-wrap justify-between items-center gap-3">

          <div className="flex gap-2">
            {["all", "active", "completed"].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  filter === type
                    ? "bg-indigo-600 text-white shadow-lg scale-105"
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
            <div className="p-10 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading tasks...</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              <p className="text-lg font-medium">
                No tasks found 🚀
              </p>
              <p className="text-sm mt-1">
                Add a task to get started
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

      {/* FOOTER STATUS */}
      {todos.length > 0 && (
        <div className="text-center mt-6 text-gray-600 text-sm">
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