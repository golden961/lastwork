import { Link, useNavigate } from "react-router-dom";

export default function MainHeader() {
    const nav = useNavigate();
    const isAuthed = !!localStorage.getItem("userToken");

    return (
        <div className="hdr">
            <div className="hdrCard">
                <div className="hdrTop">
                    <div className="brand">
                        <div className="brandMark">
                            <img src="/assets/icon2.svg" alt="logo" className="w-8 h-8" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div className="brandTitle">Банкетам.Нет</div>
                            <div className="brandSub">Выбор и бронирование помещений</div>
                        </div>
                    </div>

                    {isAuthed ? (
                        <button className="hdrAction" type="button" onClick={() => nav("/profile")}>
                            Кабинет
                        </button>
                    ) : (
                        <Link className="hdrAction" to="/login">
                            Войти
                        </Link>
                    )}
                </div>
                <div className="hdrBar" />
            </div>
        </div>
    );
}