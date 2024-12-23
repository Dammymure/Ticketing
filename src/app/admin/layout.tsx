import { Nav, NavLink } from "@/components/Nav";

export const dynamic = "force-dynamic" // To disable caching for the admin page, we do not need it to be cached because we want the latest update

export default function AdminLayout ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
  return <>
    <Nav>
        <NavLink  href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/events">Events</NavLink>
        <NavLink href="/admin/clients"> Clients</NavLink>
        <NavLink href="/admin/orders">Sales</NavLink>
    </Nav>
    <div className="container my-6">{children}</div>
  </>
  
}

