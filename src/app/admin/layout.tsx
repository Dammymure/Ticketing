import { Nav, NavLink } from "@/components/Nav";
import Link from "next/link";

export const dynamic = "force-dynamic" // To disable caching for the admin page, we do not need it to be cached because we want the latest update

export default function Layout ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
  return <>

    {/* <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/events">Events</NavLink>
        <NavLink href="/my-events">My Events</NavLink>
        </Nav> */}
    <Nav>
        <Link href="/" className="text-2xl font-bold text-blue-600">EventTix</Link>
    <ul className="flex space-x-4">
    <NavLink  href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/events">Events</NavLink>
        <NavLink href="/admin/clients"> Clients</NavLink>
        <NavLink href="/admin/orders">Sales</NavLink>
    </ul>
    </Nav>
        <div className="container my-6">{children}</div>
  </>
  
}

