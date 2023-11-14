import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./BurgerMenu.css";

function BurgerMenu({ isOpen, onClose }) {
  const { pathname } = useLocation();
  return (
    <div className={`burger ${isOpen ? `burger_opened` : ""}`}>
      <div className="burger__backdrop">
        <div className="burger__container">
          <button
            type="button"
            className="burger__close-btn"
            onClick={onClose}
          />
          <nav>
            <ul className="burger__menu">
              <li>
                <NavLink
                  to="/"
                  className={
                    pathname === "/"
                      ? "burger__link burger__link_active"
                      : "burger__link"
                  }
                >
                  Главная
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/movies"
                  className={
                    pathname === "/movies"
                      ? "burger__link burger__link_active"
                      : "burger__link"
                  }
                >
                  Фильмы
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/saved-movies"
                  className={
                    pathname === "/saved-movies"
                      ? "burger__link burger__link_active"
                      : "burger__link"
                  }
                >
                  Сохранённые фильмы
                </NavLink>
              </li>
            </ul>
          </nav>
          <NavLink to="/profile" className="burger__button">
            Аккаунт
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default BurgerMenu;
