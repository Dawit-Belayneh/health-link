import "./RevenueCard.css";

import {
    DollarSign,
    TrendingUp,
    CreditCard,
    Wallet,
    ArrowUpRight
} from "lucide-react";

function RevenueCard() {

    const revenue = [

        {
            id: 1,
            title: "Today's Revenue",
            amount: "$12,450",
            change: "+8.5%",
            icon: <DollarSign size={28} />,
            color: "green"
        },

        {
            id: 2,
            title: "Monthly Revenue",
            amount: "$286,300",
            change: "+15.2%",
            icon: <TrendingUp size={28} />,
            color: "blue"
        },

        {
            id: 3,
            title: "Pending Payments",
            amount: "$24,800",
            change: "18 Bills",
            icon: <CreditCard size={28} />,
            color: "orange"
        },

        {
            id: 4,
            title: "Insurance Claims",
            amount: "$78,650",
            change: "42 Claims",
            icon: <Wallet size={28} />,
            color: "purple"
        }

    ];

    return (

        <section className="revenue-section">

            <div className="revenue-header">

                <div>

                    <h2>Hospital Revenue</h2>

                    <p>Financial overview and payment summary</p>

                </div>

                <button>

                    View Report

                    <ArrowUpRight size={18} />

                </button>

            </div>

            <div className="revenue-grid">

                {

                    revenue.map((item)=>(

                        <div
                            className="revenue-card"
                            key={item.id}
                        >

                            <div className={`revenue-icon ${item.color}`}>

                                {item.icon}

                            </div>

                            <div className="revenue-info">

                                <h4>{item.title}</h4>

                                <h2>{item.amount}</h2>

                                <span>{item.change}</span>

                            </div>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}

export default RevenueCard;