import "./Timeline.css";

import {
    CalendarDays,
    Stethoscope,
    Pill,
    TestTube,
    FileText
} from "lucide-react";


function Timeline(){

    const events = [

        {
            id:1,
            title:"Medical Consultation",
            description:
            "Visited Dr. Sarah Johnson for cardiology checkup.",
            date:"12 July 2026",
            icon:<Stethoscope size={22}/>,
            type:"doctor"
        },

        {
            id:2,
            title:"Prescription Added",
            description:
            "New medication Amoxicillin 500mg was prescribed.",
            date:"12 July 2026",
            icon:<Pill size={22}/>,
            type:"medicine"
        },

        {
            id:3,
            title:"Laboratory Test",
            description:
            "Blood test results were uploaded to your medical record.",
            date:"08 July 2026",
            icon:<TestTube size={22}/>,
            type:"lab"
        },

        {
            id:4,
            title:"Medical Record Updated",
            description:
            "Your allergy information was updated.",
            date:"01 July 2026",
            icon:<FileText size={22}/>,
            type:"record"
        },

        {
            id:5,
            title:"Hospital Visit",
            description:
            "Emergency department visit completed.",
            date:"20 June 2026",
            icon:<CalendarDays size={22}/>,
            type:"visit"
        }

    ];


    return(

        <section className="timeline-container">


            <div className="timeline-header">

                <h2>
                    Health Timeline
                </h2>

                <p>
                    Your complete healthcare journey
                </p>

            </div>



            <div className="timeline">


                {
                    events.map((event)=>(


                        <div
                            className="timeline-item"
                            key={event.id}
                        >


                            <div 
                                className={`timeline-icon ${event.type}`}
                            >

                                {event.icon}

                            </div>



                            <div className="timeline-content">


                                <div className="timeline-date">

                                    {event.date}

                                </div>


                                <h3>

                                    {event.title}

                                </h3>


                                <p>

                                    {event.description}

                                </p>


                            </div>


                        </div>


                    ))
                }


            </div>


        </section>

    );

}


export default Timeline;