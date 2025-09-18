import Header from "./Header.tsx";
import Footer from './Footer.tsx';
import {Outlet} from "react-router-dom";

const BasicLayout = () => {

    return <>
        <div className="container">
            <Header/>

            <main className="mt-4">
                <Outlet/>
            </main>

            <Footer/>
        </div>        
    </>       
}

export default BasicLayout;