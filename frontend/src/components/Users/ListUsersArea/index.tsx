import { useEffect, useState } from "react";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  LoaderCircleIcon,
  RefreshCwIcon,
} from "lucide-react";

// Components
import User from "../User";

// Services
import UsersAPI from "@/services/users";

// Errors
import { handleError } from "@/errors/handleError";

// Types
import { IUser } from "@/services/users";

interface Props {
  searchUsername: string;
}

export default function ListUsers({ searchUsername }: Props) {
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const [users, setUsers] = useState<IUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const nextPage = () => {
    if (totalPages > page) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const forceReload = () => {
    setReload(reload + 1);
  };

  const loadUsers = async () => {
    setLoading(true);
    const response = await UsersAPI.getAll(page, searchUsername);

    if (!response.ok) {
      handleError(response);
      setUsers([]);
      setTotalPages(1);
    } else {
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, [
    page,
    setLoading,
    setUsers,
    setTotalPages,
    handleError,
    searchUsername,
    reload,
  ]);

  return (
    <section className="m-5">
      <div className="flex">
        <h1 className="font-bold text-xl flex-grow">Usuários</h1>
        <button onClick={forceReload} data-testid="refresh-button">
          <RefreshCwIcon
            className="w-6 h-6 text-yellow-500 data-[loading='true']:animate-spin"
            data-loading={String(loading)}
          />
        </button>
      </div>

      <div
        className="justify-center items-center hidden data-[loading='true']:flex"
        data-loading={String(loading)}
        data-testid="loader"
      >
        <LoaderCircleIcon className="w-10 h-10 text-primary animate-spin" />
      </div>

      {/* Tabela de Usuários */}
      <ul
        className="p-2 gap-5 flex-wrap hidden data-[loading='false']:flex justify-center"
        data-loading={String(loading)}
      >
        {users.map((u) => (
          <li
            key={u.username}
            className="p-5 rounded-md shadow-xl bg-primary max-w-xs w-full items-center flex flex-col"
          >
            <User user={u} />
          </li>
        ))}
      </ul>
      {/* Pagination */}
      <div
        className="justify-center gap-5 m-5 hidden data-[loading='false']:flex"
        data-loading={String(loading)}
      >
        {/* PrevButton */}
        <button
          className="transition-all opacity-50 hover:opacity-100 disabled:hover:opacity-50"
          onClick={prevPage}
          disabled={page === 1}
          data-testid="prev-button"
        >
          <ArrowLeftCircleIcon className="w-5 h-5" />
        </button>
        <p>
          Página {page} de {totalPages}
        </p>
        {/* NextButton */}
        <button
          className="transition-all opacity-50  hover:opacity-100 disabled:hover:opacity-50"
          onClick={nextPage}
          disabled={page === totalPages}
          data-testid="next-button"
        >
          <ArrowRightCircleIcon className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
