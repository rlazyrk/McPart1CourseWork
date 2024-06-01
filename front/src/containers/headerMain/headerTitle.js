import logo from '../../images/logo.png'
import './css/headerTitle.css'
const HeaderTitle = () => {
    return (
        <div className={'title_div'}>
            <h1 className={'header_title'}>FLAME</h1>
            <img src={logo} alt='logo' className={'logo'}/>
            <h1 className={'header_title'}>DEFENDER</h1>
        </div>
    )
}

export default HeaderTitle