import express from "express";
import cors from "cors";
import { supabase } from "./supabaseClient.js";

const app = express();
app.use(cors());
app.use(express.json());


// GET todos
app.get("/todos", async (req, res) => {
  const { data, error } = await supabase
    .from("todos")
    .select("*");

  if (error) return res.status(400).json(error);
  res.json(data);
});


// ADD todo
app.post("/todos", async (req, res) => {
  const { text } = req.body;

  const { data, error } = await supabase
    .from("todos")
    .insert([{ text }]);

  if (error) return res.status(400).json(error);
  res.json(data);
});


app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
