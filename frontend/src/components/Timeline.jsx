import "./Timeline.css";

import {
    CalendarDays,
    Stethoscope,
    Pill,
    TestTube,
    FileText
} from "lucide-react";


function Timeline({ records = [], appointments = [], prescriptions = [] }) {

    const formatDate = (dateStr) => {
        if (!dateStr) return "Recent";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    // Dynamically build healthcare events from patient's clinical records, appointments & prescriptions
    const dynamicEvents = [];

    // 1. Scheduled / Confirmed Appointments
    appointments.forEach((apt, idx) => {
        if (apt.status !== "Cancelled") {
            dynamicEvents.push({
                id: `apt-${apt.id || idx}`,
                title: `Scheduled Visit: ${apt.doctor_name || "Doctor Consultation"}`,
                description: `${apt.appointment_type || apt.type || "In-Person"} consultation at ${apt.hospital_name || apt.hospital || "HealthLink Hospital"}. Time: ${apt.time || "Scheduled slot"}.`,
                date: formatDate(apt.date),
                icon: <CalendarDays size={22}/>,
                type: "visit"
            });
        }
    });

    // 2. Clinical Consultations & Diagnoses
    records.forEach((record, idx) => {
        const docName = record.doctor_name || record.doctor || "Dr. HealthLink";
        const formattedDate = formatDate(record.date || record.visit_date);

        dynamicEvents.push({
            id: `diag-${record.id || idx}`,
            title: `Consultation: ${record.diagnosis}`,
            description: `Attended by ${docName} (${record.doctor_specialization || "General Medicine"}). Treatment plan: ${record.treatment || "Clinical assessment and follow-up"}.`,
            date: formattedDate,
            icon: <Stethoscope size={22}/>,
            type: "doctor"
        });

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

    // 3. Active Prescriptions
    prescriptions.forEach((rx, idx) => {
        if (!dynamicEvents.some(e => e.title.includes(rx.medication_name))) {
            dynamicEvents.push({
                id: `rx-live-${rx.id || idx}`,
                title: `Active Medication: ${rx.medication_name}`,
                description: `${rx.dosage} (${rx.frequency || "Daily"}). Refill Status: ${rx.refill_status || "Active"}. Prescribed by ${rx.doctor_name || "Physician"}.`,
                date: formatDate(rx.start_date || rx.created_at),
                icon: <Pill size={22}/>,
                type: "medicine"
            });
        }
    });

    // Fallback if no events exist yet
    const events = dynamicEvents.length > 0 ? dynamicEvents.slice(0, 6) : [
        {
            id: "welcome",
            title: "Welcome to HealthLink",
            description: "Your health journey begins here. Medical records and visits will show up here.",
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