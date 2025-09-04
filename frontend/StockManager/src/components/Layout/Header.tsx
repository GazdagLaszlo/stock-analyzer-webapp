import React from 'react';
import { Link } from "react-router-dom";

const Header = () => {
    return <>
        <header>
            <nav className='navbar'>
                <div className='navbar-brand'>
                    <Link to="/" className='has-text-white'>
                        <p className='is-size-4 has-text-weight-bold'>StockManager</p>
                        <p>Részvénypiaci elemző és portfólió-kezelő</p>
                    </Link>

                    <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div className='navbar-menu'>
                    <div className='navbar-end'>
                        <Link className='navbar-item' to="/dashboard">Kezdőlap</Link>
                        <Link className='navbar-item' to="/stocks">Részvények</Link>
                        <Link className='navbar-item' to="/portfolio">Portfólió</Link>
                        <Link className='navbar-item' to="/watchlist">Figyelőlista</Link>
                        <Link className='navbar-item' to="/transactions">Tranzakciók</Link>
                    </div>                    
                </div>
            </nav>            
        </header>
    </>
};

export default Header;