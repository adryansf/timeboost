import Link from "next/link";
import { ElementType } from "react";

interface Props {
  to: string;
  icon: ElementType;
  name: string;
  active?: boolean;
}

export default function NavItem({
  icon: Icon,
  to,
  name,
  active = false,
}: Props) {
  return (
    <Link
      href={to}
      data-active={String(active)}
      className="flex gap-2 transition-all opacity-50 hover:opacity-100 data-[active='true']:text-primary data-[active='true']:opacity-100"
      role="nav-item-link"
    >
      <Icon role="nav-item-icon" /> {name}
    </Link>
  );
}
