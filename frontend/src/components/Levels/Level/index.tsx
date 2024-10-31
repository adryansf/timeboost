import { TrashIcon } from "lucide-react";
import { toast } from "react-toastify";

// Components
import EditLevelButtonDialog from "../EditLevelButtonDialog";

// Services
import LevelsAPI from "@/services/levels";

// Types
import { ILevel } from "@/services/levels";

// Errors
import { handleError } from "@/errors/handleError";

interface Props {
  level: ILevel;
}

export default function Level({ level }: Props) {
  const handleDelete = async () => {
    const response = await LevelsAPI.delete(level.id);

    if (!response.ok) return handleError(response);
    toast.success("Level deletado com sucesso!");
  };

  return (
    <div className="max-w-xs w-full flex flex-col bg-primary p-5 rounded-md shadow-xl items-center  text-white">
      <div className="flex w-full justify-between">
        <p>
          <strong>ID:</strong> {level.id}
        </p>
        <div className="flex gap-2">
          {/* Edit Level Button Dialog */}
          <EditLevelButtonDialog level={level} />
          {/* Botão Deletar Usuário */}
          <button
            className="opacity-80 hover:opacity-100 transition-all"
            title="Deletar level"
            onClick={handleDelete}
          >
            <TrashIcon className="text-red-500" />
          </button>
        </div>
      </div>

      <hr className="my-2 text-white bg-white w-full" />

      <div>
        <p>
          <strong>Nome:</strong> {level.name}
        </p>
        <p>
          <strong>Pontos Necessários:</strong> {level.pointsRequired}
        </p>
      </div>
    </div>
  );
}
