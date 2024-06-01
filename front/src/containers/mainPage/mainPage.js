import HeaderMain from "../headerMain/headerMain";
import DataTable from "../dataTable/dataTable";
import GraphsTable from "../graphsTable/graphsTable";
import './css/mainPage.css'
import Footer from "../footer/footer";

const MainPage = () => {
    return (
        <div>
            <HeaderMain/>
            <div className={'body_part'}>
            <DataTable/>
            <GraphsTable/>
            <Footer/>
            </div>
        </div>
    );
}

export default MainPage;
