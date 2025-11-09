import { Link, NavLink } from "react-router-dom";

const Header = () => {

    return <>
        <header className='py-3 px-6'>
            <nav className='navbar'>
                <div className='navbar-brand'>
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
                        <NavLink className={({ isActive }) => "navbar-item" + (isActive ? " active" : "")} to="/dashboard">Dashboard</NavLink>
                        <NavLink className={({ isActive }) => "navbar-item" + (isActive ? " active" : "")} to="/stocks">Stocks</NavLink>
                        <NavLink className={({ isActive }) => "navbar-item" + (isActive ? " active" : "")} to="/portfolio">Portfolio</NavLink>
                        <NavLink className={({ isActive }) => "navbar-item" + (isActive ? " active" : "")} to="/watchlist">Watchlist</NavLink>
                        <NavLink className={({ isActive }) => "navbar-item" + (isActive ? " active" : "")} to="/transactions">Transactions</NavLink>
                        <NavLink className={({ isActive }) => "navbar-item" + (isActive ? " active" : "")} to="/results">Trade statistics</NavLink>
                    </div>                    
                </div>
            </nav>            
        </header>
    </>
};

export default Header;