import { useRef, FormEvent, useEffect, useState } from "react";
import { XIcon, UserPenIcon } from "lucide-react";
import { toast } from "react-toastify";

// Services
import UsersAPI from "@/services/users";

// Errors
import { handleError } from "@/errors/handleError";

// Types
import { IUser } from "@/services/users";

interface Props {
  user: IUser;
}

export default function EditUserDialog({ user }: Props) {
  const [open, setIsOpen] = useState(false);

  const usernameInput = useRef<HTMLInputElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const username = usernameInput.current?.value;
    const email = emailInput.current?.value;

    if (!username || username.length < 3) {
      return toast.error("O username deve ter no mínimo 3 caracteres");
    }

    if (!email) {
      return toast.error("Informe um email válido");
    }

    const response = await UsersAPI.update(user.id, { username, email });

    if (!response.ok) return handleError(response);

    toast.success("Usuário salvo com sucesso!");
    handleClose();
  };

  return (
    <>
      <button
        className="hover:bg-white/50 transition-all p-1 rounded-full"
        title="Editar usuário"
        onClick={handleOpen}
      >
        <UserPenIcon className="w-4 h-4 text-secondary" />
      </button>

      <dialog
        data-open={String(open)}
        className="fixed h-screen w-full bg-black/50 z-10 top-0 left-0 flex justify-center items-center data-[open='false']:hidden"
        data-testid="edit-user-dialog"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col p-5 bg-white rounded-md gap-5 max-w-xs"
          data-testid="edit-user-form"
        >
          <span className="flex items-center">
            <h1 className="flex-grow text-lg font-bold text-primary">
              Editar Usuário
            </h1>
            <button type="button" title="Fechar" onClick={handleClose}>
              <XIcon className="w-5 h-5 text-gray-400" />
            </button>
          </span>
          <span>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              minLength={3}
              required
              ref={usernameInput}
              placeholder="Seu melhor username"
              className="text-primary border-b-2 border-primary p-2 w-full"
              defaultValue={user?.username || ""}
            />
          </span>

          <span>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              name="email"
              required
              ref={emailInput}
              placeholder="Seu melhor email"
              className="text-primary border-b-2 border-primary p-2 w-full"
              defaultValue={user?.email || ""}
            />
          </span>

          <span className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-white border-2 border-primary text-primary-500 font-bold text-lg rounded-md opacity-80 hover:opacity-100 hover:bg-primary-500 hover:text-secondary transition-all"
            >
              Salvar
            </button>
          </span>
        </form>
      </dialog>
    </>
  );
}
