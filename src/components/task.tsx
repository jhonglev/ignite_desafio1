import { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import classNames from "classnames";
import { Button } from "./ui/button";
import trash from "../assets/trash.png";

interface TaskProps {
  id: string;
  description: string;
  onStateChange: (value: boolean, id: string) => void;
  onDelete: (id: string) => void;
}

export const Task = ({
  id,
  description,
  onStateChange,
  onDelete,
}: TaskProps) => {
  const [complete, setComplete] = useState<boolean>(false);

  const handleChange = (checked: boolean) => {
    setComplete(checked);
    onStateChange(checked, id);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
  };

  return (
    <>
      <div className="box-border flex w-full items-start gap-2.5">
        <Checkbox
          onCheckedChange={(event) => handleChange(Boolean(event))}
          className={classNames("rounded-full border-2 border-cyan-300", {
            "border-purple-400 data-[state=checked]:bg-purple-400 data-[state=checked]:text-white":
              complete,
          })}
        />
        <span
          className={classNames(
            "line-clamp-2 h-full break-all leading-none [display:-webkit-box]",
            {
              "line-through": complete,
            },
          )}
        >
          {description}
        </span>
      </div>
      <div className="h-full w-7">
        <Button
          onClick={() => handleDelete(id)}
          variant="ghost"
          className="flex items-start p-0 hover:bg-transparent"
        >
          <img src={trash} />
        </Button>
      </div>
    </>
  );
};
