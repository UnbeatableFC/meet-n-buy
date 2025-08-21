import { Link } from "react-router";

export default function Navbar() {
  return (
    <div className=" z-20">
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link
                  to="/"
                  className="hover:text-primary text-base transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary text-base transition-colors duration-300"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary text-base transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-xl md:text-2xl font-bold text-primary">
            Meet'n'Buy
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link
                to="/"
                className="hover:text-primary text-base transition-colors duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-primary text-base transition-colors duration-300"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-primary text-base transition-colors duration-300"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end gap-2">
          <Link to={"/signup"}>
            <button className="btn btn-outline btn-sm px-3 md:px-6 rounded-full hover:bg-primary hover:text-base-100 transition">
              SignUp
            </button>
          </Link>
          <Link to={"/login"}>
            <button className="btn btn-primary btn-sm px-3 md:px-6 rounded-full">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
