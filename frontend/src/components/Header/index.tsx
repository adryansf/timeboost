"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  UsersIcon,
  ListTodoIcon,
  CircleFadingArrowUpIcon,
  HomeIcon,
  LogOutIcon,
} from "lucide-react";

// Components
import NavItem from "../NavItem";

const pages = [
  {
    name: "Início",
    icon: HomeIcon,
    to: "/",
  },
  {
    name: "Usuários",
    icon: UsersIcon,
    to: "/usuarios",
  },
  // {
  //   name: "Tarefas",
  //   icon: ListTodoIcon,
  //   to: "/tarefas",
  // },
  // {
  //   name: "Levels",
  //   icon: CircleFadingArrowUpIcon,
  //   to: "/levels",
  // },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex justify-between p-2 shadow-xl items-center md:flex-row flex-col">
      <Image
        src="/logo.png"
        alt="Timeboost"
        width={500}
        height={500}
        className="w-32 h-32"
      />
      <nav className="flex gap-6 flex-col md:flex-row">
        {pages.map((p) => (
          <NavItem
            key={p.name}
            icon={p.icon}
            to={p.to}
            name={p.name}
            active={pathname === p.to}
          />
        ))}
      </nav>
      <div className="flex mt-5 md:mt-0 md:gap-5">
        <span className="flex flex-col items-center gap-2">
          <Image
            src="https://api.multiavatar.com/administrador.svg"
            alt="Administrador"
            data-testid="avatar"
            width={48}
            height={48}
            className="border-2 border-primary bg-secondary w-12 h-12 rounded-full"
          />
          <h1 className="font-bold">Administrador</h1>
        </span>
        <span className="flex flex-col justify-center m-2">
          <button
            data-testid="button-logout"
            className="bg-red-500 text-white font-bold p-2 rounded-md"
          >
            <LogOutIcon className="w-5 h-5" />
          </button>
        </span>
      </div>
    </header>
  );
}
