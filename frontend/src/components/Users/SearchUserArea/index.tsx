"use client";
import { Dispatch, SetStateAction, useRef } from "react";
import { SearchIcon } from "lucide-react";

interface Props {
  setSearchUsername: Dispatch<SetStateAction<string>>;
}

export default function SearchUserArea({ setSearchUsername }: Props) {
  const usernameInput = useRef<HTMLInputElement>(null);

  const handleSearchUser = () => {
    setSearchUsername(usernameInput.current?.value || "");
  };

  return (
    <>
      {/* Input Username */}
      <input
        type="text"
        name="username"
        placeholder="Username"
        className="text-primary border-2 border-primary rounded-md px-5 py-2 w-full"
        ref={usernameInput}
      />

      <button
        onClick={handleSearchUser}
        className="bg-primary text-secondary font-bold p-2 rounded-md"
        title="Buscar usuário por username"
      >
        <SearchIcon />
      </button>
    </>
  );
}
