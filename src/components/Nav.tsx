'use client'
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Children, ComponentProps, ReactNode } from "react";

export function Nav({children}:{children: ReactNode}){
    return <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        {children}
    </nav>
}


export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">){
    const pathname = usePathname()
    return <Link {...props} className={cn("text-gray-600 hover:text-blue-600", pathname === props.href && "text-blue-600")}/>


}

