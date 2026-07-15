import "./PrescriptionCard.css";
import {
    Pill,
    Clock3,
    CalendarDays,
    UserRound,
    AlertCircle
} from "lucide-react";

function PrescriptionCard() {

    const medicines = [

        {
            id: 1,
            name: "Amoxicillin 500mg",
            dosage: "1 Capsule • 3 Times Daily",
            doctor: "Dr. Sarah Johnson",
            start: "10 Jul 2026",
            end: "20 Jul 2026",
            progress: 70,
            refill: false
        },

        {
            id: 2,
            name: "Vitamin D",
            dosage: "1 Tablet • Every Morning",
            doctor: "Dr. Michael Lee",
            start: "01 Jul 2026",
            end: "30 Jul 2026",
            progress: 45,
            refill: true
        }

    ];

    return (

        <section className="prescription-card">

            <div className="prescription-header">

                <h2>Active Prescriptions</h2>

                <span>{medicines.length} Medicines</span>

            </div>

            {

                medicines.map((medicine)=>(

                    <div
                        className="medicine-card"
                        key={medicine.id}
                    >

                        <div className="medicine-top">

                            <div className="medicine-icon">

                                <Pill size={28}/>

                            </div>

                            <div>

                                <h3>{medicine.name}</h3>

                                <p>{medicine.dosage}</p>

                            </div>

                        </div>

                        <div className="medicine-details">

                            <div>

                                <UserRound size={16}/>

                                <span>{medicine.doctor}</span>

                            </div>

                            <div>

                                <CalendarDays size={16}/>

                                <span>{medicine.start} - {medicine.end}</span>

                            </div>

                            <div>

                                <Clock3 size={16}/>

                                <span>{medicine.progress}% Completed</span>

                            </div>

                        </div>

                        <div className="progress-bar">

                            <div
                                className="progress-fill"
                                style={{
                                    width:`${medicine.progress}%`
                                }}
                            ></div>

                        </div>

                        {

                            medicine.refill &&

                            <div className="refill-warning">

                                <AlertCircle size={18}/>

                                Refill Required Soon

                            </div>

                        }

                    </div>

                ))

            }

        </section>

    );

}

export default PrescriptionCard;