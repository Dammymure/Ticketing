import { Nav, NavLink } from "@/components/Nav";

export const dynamic = "force-dynamic" // To disable caching for the admin page, we do not need it to be cached because we want the latest update

export default function Layout ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
  return <>
    <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/events">Events</NavLink>
        <NavLink href="/my-events">My Events</NavLink>
    </Nav>
    <div className="container my-6">{children}</div>
  </>
  
}

