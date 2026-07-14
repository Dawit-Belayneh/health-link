import "./Topbar.css";

function Topbar() {

    const today = new Date();

    const date = today.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (

        <header className="topbar">

            <div className="topbar-left">

                <h1>Patient Dashboard</h1>

                <p>
                    Welcome back! Stay updated with your healthcare information.
                </p>

            </div>

            <div className="topbar-right">

                <div className="search-box">

                    <input
                        type="text"
                        placeholder="Search..."
                    />

                </div>

                <button className="notification-btn">

                    🔔

                    <span className="notification-count">
                        3
                    </span>

                </button>

                <div className="date-box">

                    <span>{date}</span>

                </div>

                <div className="profile-box">

                    <div className="avatar">
                        DB
                    </div>

                    <div>

                        <h4>Dawit Belayneh</h4>

                        <p>Patient</p>

                    </div>

                </div>

            </div>

        </header>

    );

}

export default Topbar;