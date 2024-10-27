import { useRef, FormEvent, useState } from "react";
import { XIcon, UserPlusIcon } from "lucide-react";
import { toast } from "react-toastify";

// Services
import UsersAPI from "@/services/users";

// Errors
import { handleError } from "@/errors/handleError";

export default function CreateUserButtonDialog() {
  const [open, setIsOpen] = useState(false);

  const usernameInput = useRef<HTMLInputElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const username = usernameInput.current?.value;
    const email = emailInput.current?.value as string;
    const password = passwordInput.current?.value;

    if (!username || username.length < 3) {
      return toast.error("O username deve ter no mínimo 3 caracteres");
    }

    if (!password || password.length < 8) {
      return toast.error("A senha deve ter no mínimo 8 caracteres");
    }

    const response = await UsersAPI.create({ username, email, password });

    if (!response.ok) return handleError(response);

    toast.success("Usuário criado com sucesso!");
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
        title="Adicionar Usuário"
      >
        <UserPlusIcon />
      </button>

      {/* Dialog */}
      <dialog
        className="fixed h-screen w-full bg-black/50 z-10 top-0 left-0 flex justify-center items-center data-[open='false']:hidden"
        data-open={String(open)}
        data-testid={"create-user-dialog"}
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col p-5 bg-white rounded-md gap-5 max-w-xs"
        >
          <span className="flex items-center">
            <h1 className="flex-grow text-lg font-bold text-primary">
              Cadastrar Usuário
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
            />
          </span>

          <span>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              name="password"
              required
              ref={passwordInput}
              placeholder="Digite uma senha"
              className="text-primary border-b-2 border-primary p-2 w-full"
              minLength={8}
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
