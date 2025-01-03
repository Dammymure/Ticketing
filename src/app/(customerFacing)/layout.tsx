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
      <NavLink href="/" >Home</NavLink>
      <NavLink href="/events">Events</NavLink>
      <NavLink href="/about" >My Events</NavLink>
    </ul>
    </Nav>
        <div className="container my-6">{children}</div>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">EventTix</h3>
              <p>Your go-to platform for discovering and booking amazing events.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/events" className="hover:text-blue-400">All Events</Link></li>
                <li><Link href="/categories" className="hover:text-blue-400">Categories</Link></li>
                <li><Link href="/about" className="hover:text-blue-400">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-blue-400">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-400">Facebook</a>
                <a href="#" className="hover:text-blue-400">Twitter</a>
                <a href="#" className="hover:text-blue-400">Instagram</a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            <p>&copy; 2023 EventTix. All rights reserved.</p>
          </div>
        </div>
      </footer>
  </>
  
}

