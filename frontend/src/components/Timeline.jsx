import "./Timeline.css";

import {
    CalendarDays,
    Stethoscope,
    Pill,
    TestTube,
    FileText
} from "lucide-react";


function Timeline({ records = [] }) {

    const formatDate = (dateStr) => {
        if (!dateStr) return "Recent";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    // Dynamically build healthcare events from patient's medical records
    const dynamicEvents = [];

    records.forEach((record, idx) => {
        const docName = record.doctor_name || record.doctor || "Dr. HealthLink";
        const formattedDate = formatDate(record.date || record.visit_date);

        // Medical Consultation Event
        dynamicEvents.push({
            id: `diag-${record.id || idx}`,
            title: `Consultation: ${record.diagnosis}`,
            description: `Attended by ${docName} (${record.doctor_specialization || "General Medicine"}). Treatment plan: ${record.treatment || "Monitoring"}.`,
            date: formattedDate,
            icon: <Stethoscope size={22}/>,
            type: "doctor"
        });

        // Prescription Event if present
        if (record.prescription && record.prescription.trim()) {
            dynamicEvents.push({
                id: `rx-${record.id || idx}`,
                title: "Prescription Issued",
                description: `Prescribed by ${docName}: ${record.prescription}`,
                date: formattedDate,
                icon: <Pill size={22}/>,
                type: "medicine"
            });
        }
    });

    // Fallback if no records exist yet
    const events = dynamicEvents.length > 0 ? dynamicEvents : [
        {
            id: "welcome",
            title: "Welcome to HealthLink",
            description: "Your health journey begins here. Medical records added by doctors will show up here.",
            date: "Today",
            icon: <FileText size={22}/>,
            type: "record"
        }
    ];

    return(

        <section className="timeline-container">

            <div className="timeline-header">

                <h2>
                    Health Timeline
                </h2>

                <p>
                    Your complete healthcare journey ({events.length} milestones)
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