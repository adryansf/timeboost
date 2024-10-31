"use client";
import { useRef, FormEvent, useState } from "react";
import { XIcon, CirclePlusIcon } from "lucide-react";
import { toast } from "react-toastify";

// Services
import LevelsAPI from "@/services/levels";

// Errors
import { handleError } from "@/errors/handleError";

export default function CreateLevelButtonDialog() {
  const [open, setIsOpen] = useState(false);

  const nameInput = useRef<HTMLInputElement>(null);
  const pointsRequiredInput = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = nameInput.current?.value;
    const pointsRequired = Number(pointsRequiredInput.current?.value);

    if (!name || name.length < 3) {
      return toast.error("O nome deve ter no mínimo 3 caracteres");
    }

    if (!pointsRequired || pointsRequired < 0) {
      return toast.error(
        "A quantidade de pontos necessários deve ser maior que 0 (zero)"
      );
    }

    const response = await LevelsAPI.create({
      name,
      pointsRequired,
    });

    if (!response.ok) return handleError(response);

    toast.success("Level criado com sucesso!");
    handleClose();
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Button */}
      <button
        onClick={handleOpen}
        className="bg-green-500 text-white font-bold p-2 rounded-md"
        title="Criar Level"
      >
        <CirclePlusIcon />
      </button>

      {/* Dialog */}
      <dialog
        className="fixed h-screen w-full bg-black/50 z-10 top-0 left-0 flex justify-center items-center data-[open='false']:hidden"
        data-open={String(open)}
        data-testid={"create-level-dialog"}
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col p-5 bg-white rounded-md gap-5 max-w-xs"
          data-testid="create-level-form"
        >
          <span className="flex items-center">
            <h1 className="flex-grow text-lg font-bold text-primary">
              Criar Level
            </h1>
            <button type="button" title="Fechar" onClick={handleClose}>
              <XIcon className="w-5 h-5 text-gray-400" />
            </button>
          </span>
          <span>
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              name="name"
              minLength={3}
              required
              ref={nameInput}
              placeholder="Ex: Mestre"
              className="text-primary border-b-2 border-primary p-2 w-full"
            />
          </span>

          <span>
            <label htmlFor="pointsRequired">Pontos necessários</label>
            <input
              name="pointsRequired"
              min={0}
              type="number"
              required
              ref={pointsRequiredInput}
              placeholder="Ex: 10"
              className="text-primary border-b-2 border-primary p-2 w-full"
            />
          </span>

          <span className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-white border-2 border-green-500 text-green-500 font-bold text-lg rounded-md opacity-80 hover:opacity-100 hover:bg-green-500 hover:text-white transition-all"
            >
              Criar
            </button>
          </span>
        </form>
      </dialog>
    </>
  );
}
