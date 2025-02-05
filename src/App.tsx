import { PlusCircle } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import logo from "./assets/logo.png";
import clipboard from "./assets/clipboard.png";
import { useState } from "react";
import { Task } from "./components/task";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./components/ui/form";
import classNames from "classnames";

interface Task {
  id: string;
  description: string;
}

const FormSchema = z.object({
  description: z.string().min(1, {
    message: "Descrição é obrigatória.",
  }),
});

type FormType = z.infer<typeof FormSchema>;

function App() {
  const [completeTasksIds, setCompleteTasksIds] = useState<Array<string>>([]);
  const [tasks, setTasks] = useState<Array<Task>>([]);

  const form = useForm<FormType>({
    defaultValues: {
      description: "",
    },
    resolver: zodResolver(FormSchema),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = form;

  const createTask = (values: FormType) => {
    const { description } = values;
    const newTask: Task = {
      id: crypto.randomUUID(),
      description,
    };
    setTasks((data) => [...data, newTask]);
    reset();
  };

  const handleTaskStateChange = (complete: boolean, id: string) => {
    if (complete)
      setCompleteTasksIds((values) => [...values, id]);
    else
      setCompleteTasksIds((values) => values.filter((value) => value !== id))
  };

  const handleDeleteTask = (id: string) => {
    setTasks((values) => values.filter((value) => value.id !== id));
    setCompleteTasksIds((values) => values.filter((value) => value !== id))
  };

  return (
    <>
      <div className="min-w-screen min-h-screen bg-primary">
        <div className="flex h-[200px] w-full items-center justify-center bg-card">
          <img src={logo} />
        </div>
        <div className="flex w-full justify-center">
          <div className="-mt-6 flex w-[736px] flex-col">
            <Form {...form}>
              <form
                onSubmit={handleSubmit(createTask)}
                className="flex h-12 gap-2"
              >
                <Input
                  className={classNames("h-full rounded bg-input", {
                    "border-2 border-red-900 placeholder:text-red-900 focus-visible:ring-0":
                      errors.description,
                  })}
                  placeholder="Adicione uma nova tarefa"
                  {...register("description")}
                />
                <Button
                  type="submit"
                  className="h-full w-[90px] rounded bg-button text-white"
                >
                  Criar <PlusCircle />
                </Button>
              </form>
            </Form>
            {errors?.description && (
              <span className="ml-1 mt-1 text-red-900">
                {String(errors.description.message)}
              </span>
            )}
            <div className="mt-12 flex justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-cyan-300">
                  Tarefas criadas
                </p>
                <span className="flex h-5 w-6 items-center justify-center rounded-xl bg-span text-xs font-medium">
                  {tasks.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-purple-400">
                  Concluídas
                </p>
                <span className="flex h-5 w-auto items-center justify-center rounded-xl bg-span px-2 text-xs font-medium">
                  {(tasks.length > 0 &&
                    completeTasksIds.length + ` de ${tasks.length}`) ||
                    tasks.length}
                </span>
              </div>
            </div>
            {(!tasks.length && (
              <div className="d-none mt-4 flex h-64 justify-center rounded-t-xl border-t-2 border-secondary">
                <div className="flex h-full flex-col items-center justify-center">
                  <div className="mb-4 flex justify-center">
                    <img src={clipboard} />
                  </div>
                  <span className="text-md font-bold text-muted-foreground">
                    Você ainda não tem tarefas cadastradas
                  </span>
                  <span className="text-md text-muted-foreground">
                    Crie tarefas e organize seus itens a fazer
                  </span>
                </div>
              </div>
            )) || (
              <div className="my-4 flex max-h-[400px] flex-col gap-2.5 overflow-y-auto">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex h-[72px] max-h-[72px] min-h-[72px] justify-between gap-4 rounded-xl bg-input p-5"
                  >
                    <Task
                      id={task.id}
                      onStateChange={handleTaskStateChange}
                      onDelete={handleDeleteTask}
                      description={task.description}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
