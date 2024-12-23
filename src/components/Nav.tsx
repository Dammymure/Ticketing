'use client'
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Children, ComponentProps, ReactNode } from "react";

export function Nav({children}:{children: ReactNode}){
    return <nav className="bg-primary text-primary-foreground flex justify-center px-4">
        {children}
    </nav>
}


export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">){
    const pathname = usePathname()
    return <Link {...props} className={cn("p-4 hover:bg-purple-600 hover:text-black focus-visible:bg-black focus-visible:text-white", pathname === props.href && "bg-purple-600 text-black")}/>


}

