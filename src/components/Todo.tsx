import { todoTable } from "@/lib/db/schema.js";
import type { FC } from "hono/jsx";

type TodoRow = typeof todoTable.$inferSelect;

export const TodoItem: FC<{ todo: TodoRow }> = ({ todo }) => {
  return (
    <li
      id={`todo-${todo.id}`}
      class="not-last:border-b border-gray-200 py-2 flex items-center justify-between gap-2"
    >
      <div>
        <span class="font-medium">{todo.task}</span>
      </div>
      <div class="flex flex-row gap-2">
        <button type="button" class="btn btn-outline btn-xs">
          Details
        </button>
        <button
          type="button"
          class="btn btn-xs btn-outline"
          hx-get={`/todos/${todo.id}/edit`}
          hx-target={`#todo-${todo.id}`}
          hx-swap="outerHTML"
        >
          Edit
        </button>
        <button
          class="btn btn-outline btn-xs"
          hx-delete={`/todos/${todo.id}`}
          hx-target={`#todo-${todo.id}`}
          hx-swap="outerHTML"
          hx-confirm={`Delete "${todo.task}"?`}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export const TodoEditItem: FC<{ todo: TodoRow }> = ({ todo }) => {
  return (
    <li id={`todo-${todo.id}`} class="not-last:border-b border-gray-200 py-2">
      <form
        hx-put={`/todos/${todo.id}`}
        hx-target={`#todo-${todo.id}`}
        hx-swap="outerHTML"
        class="flex flex-col gap-2 bg-base-200 p-3 rounded-box"
      >
        <input
          type="text"
          name="task"
          value={todo.task}
          class="input input-sm w-full"
          required
        />
        <textarea
          name="remarks"
          class="textarea textarea-sm w-full"
          placeholder="Optional remarks..."
        >
          {todo.remarks ?? ""}
        </textarea>

        <div class="flex justify-end gap-2">
          {/* Cancel fetches the read-only TodoItem back without saving */}
          <button
            type="button"
            class="btn btn-xs btn-ghost"
            hx-get={`/todos/${todo.id}`}
            hx-target={`#todo-${todo.id}`}
            hx-swap="outerHTML"
          >
            Cancel
          </button>
          <button type="submit" class="btn btn-xs btn-neutral">
            Save
          </button>
        </div>
      </form>
    </li>
  );
};

export const TodoList: FC<{ todos: TodoRow[] }> = ({ todos }) => {
  return (
    <div class="justify-self-start self-start w-full">
      <ul id="todo-list" class="leading-10">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};
