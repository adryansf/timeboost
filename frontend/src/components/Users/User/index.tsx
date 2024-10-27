import Image from "next/image";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TrashIcon } from "lucide-react";
import { toast } from "react-toastify";

// Components
import EditUserButtonDialog from "../EditUserButtonDialog";

// Services
import UsersApi from "@/services/users";

// Errors
import { handleError } from "@/errors/handleError";

// Types
import { IUser } from "@/services/users";

interface Props {
  user: IUser;
}

export default function User({ user }: Props) {
  const handleDelete = async () => {
    const response = await UsersApi.delete(user.id);

    if (!response.ok) return handleError(response);

    toast.success("Usuário deletado com sucesso!");
  };

  return (
    <>
      <div className="flex justify-end w-full gap-2">
        {/* Editar Usuário */}
        <EditUserButtonDialog user={user} />

        {/* Botão Deletar Usuário */}
        <button
          className="hover:bg-white/50 transition-all p-1 rounded-full"
          title="Deletar usuário"
          onClick={handleDelete}
        >
          <TrashIcon className="w-4 h-4 text-red-500" />
        </button>
      </div>

      {/* Avatar */}
      <Image
        src={`https://api.multiavatar.com/${user.username}.svg`}
        width={64}
        height={64}
        alt={user.username}
        className="w-16 h-16 border-2 border-secondary rounded-full"
      />

      <div className="flex flex-col w-full my-2 gap-2 text-secondary ">
        {/* Username */}
        <h2 className="text-center font-bold">{user.username}</h2>

        <hr />

        {/* Email */}
        <p>
          <strong>E-mail:</strong> {user.email}
        </p>
        {/* Data de criação */}
        <p>
          <strong>Criado em: </strong>{" "}
          {format(user.createdAt, "dd/MM/yyyy 'às' HH:mm", {
            locale: ptBR,
          })}
        </p>
        {/* Data de atualização */}
        <p>
          <strong>Última atualização: </strong>{" "}
          {formatDistanceToNow(user.updatedAt, {
            locale: ptBR,
            addSuffix: true,
          })}
        </p>
      </div>
    </>
  );
}
