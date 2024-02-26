"use client";
import React, { useState } from "react";
import { Menu } from "../ui/navbar-menu";
import { cn } from "../../lib/utils";
import { NavbarContent } from "./navbar-content";

export function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed bottom-0 right-0 max-w-2xl mr-2 md:mr-20 flex flex-col-reverse", className)}
    >
      <Menu setActive={setActive}>
        <NavbarContent></NavbarContent>
      </Menu>
    </div>
  );
}
