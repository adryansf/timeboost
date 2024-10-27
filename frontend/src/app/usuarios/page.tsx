"use client";
import { useRef, useState } from "react";
import { SearchIcon, UserPlusIcon } from "lucide-react";

// Components
import ListUsers from "@/components/Users/ListUsersArea";
import CreateUserButtonDialog from "@/components/Users/CreateUserButtonDialog";
import SearchUserArea from "@/components/Users/SearchUserArea";

export default function Users() {
  const [searchUsername, setSearchUsername] = useState("");

  return (
    <main>
      {/* Buscar / Criar Usuário */}
      <section className="flex gap-2 m-5">
        <SearchUserArea setSearchUsername={setSearchUsername} />

        {/* Botão criar usuário */}
        <CreateUserButtonDialog />
      </section>

      {/* Listar Usuários */}
      <ListUsers searchUsername={searchUsername} />
    </main>
  );
}
