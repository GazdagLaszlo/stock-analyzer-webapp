import Header from "../Header.tsx";
import Footer from '../Footer/Footer.tsx';
import {Outlet} from "react-router-dom";

const BasicLayout = () => {

    return(
        <div className="container is-flex is-flex-direction-column" style={{minHeight: "100vh"}}>
            <Header/>

            <main className="is-flex-grow-1 mt-4">
                <Outlet/>
            </main>

            <Footer/>
        </div>        
    )    
}

export default BasicLayout;