import React from 'react';
import { Link } from "react-router-dom";

const Header = () => {
    return <>
        <header style={{borderBottom: "1px solid black"}} className='pb-4'>
            <nav className='navbar'>
                <div className='navbar-brand mt-5'>
                    <Link to="/">
                        <p className='is-size-4 has-text-weight-bold'>StockManager</p>
                        <p>Stock analyst and Portfolio Manager</p>
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
                        <Link className='navbar-item' to="/dashboard">Dashboard</Link>
                        <Link className='navbar-item' to="/stocks">Stocks</Link>
                        <Link className='navbar-item' to="/portfolio">Portfolio</Link>
                        <Link className='navbar-item' to="/watchlist">Watchlist</Link>
                        <Link className='navbar-item' to="/transactions">Transactions</Link>
                        <Link className='navbar-item' to="/results">Trade summary</Link>
                    </div>                    
                </div>
            </nav>            
        </header>
    </>
};

export default Header;