import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaList,
  FaSignOutAlt,
  FaBrain,
} from "react-icons/fa";
import api from "../lib/axios";
import toast from "react-hot-toast";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const removeCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  const handleLogout = async () => {
    try {
      await api.post("/v1/auth/logout");
      localStorage.removeItem("token");
      removeCookie("auth_token");
      toast.success("Logout realizado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      localStorage.removeItem("token");
      removeCookie("auth_token");
      navigate("/");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        {/* Logo */}
        <Link
          to="/home"
          className="flex items-center normal-case text-xl font-bold text-primary hover:text-primary-focus transition-colors duration-200 px-4 py-2"
          onClick={closeMenu}
        >
          <FaBrain className="mr-2" />
          StudAI
        </Link>
      </div>

      <div className="navbar-center">
        {/* Espaço vazio para centralizar melhor */}
      </div>

      <div className="navbar-end">
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/quiz/list" className="btn btn-ghost">
                <FaList />
                Meus Quizzes
              </Link>
            </li>
            <li>
              <Link to="/account" className="btn btn-ghost">
                <FaUser />
                Conta
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="btn btn-ghost text-error hover:bg-error hover:text-error-content"
              >
                <FaSignOutAlt />
                Sair
              </button>
            </li>
          </ul>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button className="btn btn-ghost" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-base-100 shadow-lg border-t lg:hidden z-50">
          <ul className="menu p-2">
            <li>
              <Link
                to="/quiz/list"
                className="flex items-center gap-2"
                onClick={closeMenu}
              >
                <FaList />
                Meus Quizzes
              </Link>
            </li>
            <li>
              <Link
                to="/account"
                className="flex items-center gap-2"
                onClick={closeMenu}
              >
                <FaUser />
                Conta
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="flex items-center gap-2 text-error hover:bg-error hover:text-error-content w-full text-left"
              >
                <FaSignOutAlt />
                Sair
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Header;
