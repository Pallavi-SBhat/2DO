import supabase from "../supabaseClient.js";

export const getTodos = async (req, res) => {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error });
  res.json(data);
};

export const addTodo = async (req, res) => {
  const { title } = req.body;

  const { data, error } = await supabase
    .from("todos")
    .insert([{ title, completed: false }])
    .select()
    .single();

  if (error) return res.status(500).json({ error });
  res.json(data);
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  const { error } = await supabase
    .from("todos")
    .update({ completed })
    .eq("id", id);

  if (error) return res.status(500).json({ error });

  res.json({ message: "Updated" });
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error });

  res.json({ message: "Deleted" });
};