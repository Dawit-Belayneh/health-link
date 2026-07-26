import "./CalendarCard.css";

import {
    ChevronLeft,
    ChevronRight,
    Clock3
} from "lucide-react";


function CalendarCard(){

    const days = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];


    const dates = [
        29,30,1,2,3,4,5,
        6,7,8,9,10,11,12,
        13,14,15,16,17,18,19,
        20,21,22,23,24,25,26,
        27,28,29,30,31
    ];


    const appointments = [

        {
            time:"09:00 AM",
            patient:"Dawit Belayneh",
            type:"Routine Checkup"
        },

        {
            time:"10:30 AM",
            patient:"Hana Tesfaye",
            type:"Diabetes Review"
        },

        {
            time:"02:00 PM",
            patient:"Samuel Bekele",
            type:"Follow Up"
        }

    ];


    return(

        <section className="calendar-card">


            <div className="calendar-header">


                <h2>
                    July 2026
                </h2>


                <div className="calendar-buttons">

                    <button>
                        <ChevronLeft size={18}/>
                    </button>


                    <button>
                        <ChevronRight size={18}/>
                    </button>

                </div>


            </div>



            <div className="calendar-grid">


                {
                    days.map(day=>(

                        <span 
                            key={day}
                            className="day-name"
                        >

                            {day}

                        </span>

                    ))
                }



                {
                    dates.map((date,index)=>(

                        <span

                            key={index}

                            className={
                                date === 26
                                ? "date active-date"
                                :"date"
                            }

                        >

                            {date}

                        </span>

                    ))
                }


            </div>



            <div className="schedule-section">


                <h3>
                    Today's Schedule
                </h3>


                {
                    appointments.map((item,index)=>(

                        <div 
                            className="schedule-item"
                            key={index}
                        >


                            <Clock3 size={18}/>


                            <div>

                                <strong>
                                    {item.time}
                                </strong>


                                <p>
                                    {item.patient}
                                </p>


                                <small>
                                    {item.type}
                                </small>


                            </div>


                        </div>

                    ))
                }


            </div>



        </section>

    );

}


export default CalendarCard;