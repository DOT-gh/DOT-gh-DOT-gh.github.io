import React from "react";
import Link from "next/link";

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between py-4">
      <Link href="/" className="font-bold">Defense Resource Simulation</Link>
      <nav className="text-sm text-gray-400">
        <Link href="/game" className="hover:underline">Игра</Link>
      </nav>
    </header>
  );
};
