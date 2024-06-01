import HeaderTitle from "./headerTitle";
import './css/headerMain.css'

const HeaderMain = () => {
    return (
        <div className={'header'}>
            <div className={'header_box'}>
            <HeaderTitle/>
            </div>
            <div className={'dividing_line'}></div>
        </div>
    );
}

export default HeaderMain;
