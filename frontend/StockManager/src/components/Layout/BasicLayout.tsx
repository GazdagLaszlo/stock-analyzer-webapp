import Header from "./Header.tsx";
import Footer from './Footer.tsx';
import {Outlet} from "react-router-dom";

const BasicLayout = () => {

    return(
        <div className="container" style={{minHeight: "100vh"}}>
            <Header/>

            <main className="mt-4">
                <Outlet/>
            </main>

            <Footer/>
        </div>        
    )    
}

export default BasicLayout;