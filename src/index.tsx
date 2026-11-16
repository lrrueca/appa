import { serveStatic } from "@hono/node-server/serve-static";
import { desc, eq, isNull } from "drizzle-orm";
import { Hono } from "hono";
import { TodoEditItem, TodoItem, TodoList } from "./components/Todo.js";
import { db } from "./lib/db/index.js";
import { todoTable } from "./lib/db/schema.js";
import { renderer } from "./renderer.js";

const app = new Hono<HonoEnv>();
app.use("/public/*", serveStatic({ root: "./public" }));
app.use("*", renderer);

app.get("/", async (c) => {
  const todos = await db
    .select()
    .from(todoTable)
    .where(isNull(todoTable.deleted_at))
    .orderBy(desc(todoTable.created_at));

  return c.render(
    <div class="grid grid-cols-2 grid-rows-[100px_1fr] items-center w-[80%] mx-auto">
      {/* header section */}
      <h1 class="col-1 row-1 mx-auto text-lg font-bold">Todo</h1>

      {/* todo list section */}
      <div class="col-1 row-2">
        <TodoList todos={todos} />
      </div>

      {/* form section */}
      <div class="mx-auto row-span-full">
        <form
          hx-post="/todos"
          hx-target="#todo-list"
          hx-swap="beforeend"
          hx-on--after-request="if(event.detail.successful) this.reset()"
        >
          <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend class="fieldset-legend">New Task</legend>

            <label for="task" class="label">
              Task
            </label>
            <input
              id="task"
              name="task"
              type="text"
              class="input"
              placeholder="Task"
            />

            <label for="remarks" class="label">
              Remarks
            </label>
            <textarea
              id="remarks"
              name="remarks"
              placeholder="Remarks"
              class="textarea"
            />

            <button class="btn btn-neutral mt-4">Submit</button>
          </fieldset>
        </form>
      </div>
    </div>,
    { title: "Todo" },
  );
});

app.post("/todos", async (c) => {
  const body = await c.req.parseBody();
  const task = String(body.task || "").trim();
  const remarks = String(body.remarks || "").trim() || null;

  const [newTodo] = await db
    .insert(todoTable)
    .values({ task, remarks })
    .returning();
  c.header("content-type", "text/html; charset=utf-8");
  return c.html(<TodoItem todo={newTodo} />);
});

// Fetch a single read-only TodoItem (used by the Cancel button)
app.get("/todos/:id", async (c) => {
  const id = c.req.param("id");
  const [todo] = await db.select().from(todoTable).where(eq(todoTable.id, id));

  return c.html(<TodoItem todo={todo} />);
});

// Return the inline edit form for a specific task
app.get("/todos/:id/edit", async (c) => {
  const id = c.req.param("id");
  const [todo] = await db.select().from(todoTable).where(eq(todoTable.id, id));

  return c.html(<TodoEditItem todo={todo} />);
});

// Update task & remarks in PostgreSQL and return the updated TodoItem
app.put("/todos/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.parseBody();
  const task = String(body.task || "").trim();
  const remarks = String(body.remarks || "").trim() || null;

  const [updatedTodo] = await db
    .update(todoTable)
    .set({ task, remarks })
    .where(eq(todoTable.id, id))
    .returning();

  return c.html(<TodoItem todo={updatedTodo} />);
});

app.delete("/todos/:id", async (c) => {
  const id = c.req.param("id");

  await db
    .update(todoTable)
    .set({ deleted_at: new Date() })
    .where(eq(todoTable.id, id));

  return c.body(null, 200);
});

export default app;
