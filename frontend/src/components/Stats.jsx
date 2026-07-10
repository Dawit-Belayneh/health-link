import "./Stats.css";

function Stats() {
  const stats = [
    {
      number: "25+",
      title: "Partner Hospitals",
      icon: "🏥",
      description:
        "Trusted hospitals connected to the HealthLink platform."
    },
    {
      number: "500+",
      title: "Doctors",
      icon: "👨‍⚕️",
      description:
        "Healthcare professionals providing quality patient care."
    },
    {
      number: "15K+",
      title: "Patients",
      icon: "🧑‍🤝‍🧑",
      description:
        "Patients securely managing their medical information."
    },
    {
      number: "99.9%",
      title: "System Uptime",
      icon: "🔒",
      description:
        "Reliable and secure healthcare services available anytime."
    }
  ];

  return (
    <section className="stats-section">

      <div className="stats-header">

        <h2>HealthLink by the Numbers</h2>

        <p>
          Connecting hospitals, doctors, and patients through one
          secure healthcare platform.
        </p>

      </div>

      <div className="stats-container">

        {stats.map((item, index) => (

          <div className="stat-card" key={index}>

            <div className="stat-icon">
              {item.icon}
            </div>

            <h3>{item.number}</h3>

            <h4>{item.title}</h4>

            <p>{item.description}</p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Stats;