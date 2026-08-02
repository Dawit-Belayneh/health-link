// DoctorManagementTable.jsx

import "./DoctorManagementTable.css";
import {
  Search,
  UserRoundPlus,
  Eye,
  SquarePen,
  Trash2,
  Mail,
  Phone,
  Stethoscope,
} from "lucide-react";

function DoctorManagementTable() {
  const doctors = [
    {
      id: 1,
      name: "Dr. Hana Tesfaye",
      department: "Cardiology",
      email: "hana@healthlink.com",
      phone: "+251 911 111111",
      status: "Active",
    },
    {
      id: 2,
      name: "Dr. Samuel Bekele",
      department: "Neurology",
      email: "samuel@healthlink.com",
      phone: "+251 922 222222",
      status: "Active",
    },
    {
      id: 3,
      name: "Dr. Ruth Alemu",
      department: "Pediatrics",
      email: "ruth@healthlink.com",
      phone: "+251 933 333333",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Dr. Daniel Tadesse",
      department: "Orthopedics",
      email: "daniel@healthlink.com",
      phone: "+251 944 444444",
      status: "Active",
    },
    {
      id: 5,
      name: "Dr. Meron Girma",
      department: "Dermatology",
      email: "meron@healthlink.com",
      phone: "+251 955 555555",
      status: "Active",
    },
  ];

  return (
    <section className="doctor-management">

      <div className="doctor-header">

        <div>
          <h2>Doctor Management</h2>
          <p>Manage all doctors in your hospital</p>
        </div>

        <div className="doctor-tools">

          <div className="doctor-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search doctor..."
            />
          </div>

          <button className="add-btn">
            <UserRoundPlus size={18} />
            Add Doctor
          </button>

        </div>

      </div>

      <div className="table-wrapper">

        <table>

          <thead>

            <tr>
              <th>Doctor</th>
              <th>Department</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {doctors.map((doctor) => (

              <tr key={doctor.id}>

                <td>

                  <div className="doctor-info">

                    <div className="doctor-avatar">
                      <Stethoscope size={22} />
                    </div>

                    <span>{doctor.name}</span>

                  </div>

                </td>

                <td>{doctor.department}</td>

                <td>

                  <div className="icon-text">
                    <Mail size={15} />
                    {doctor.email}
                  </div>

                </td>

                <td>

                  <div className="icon-text">
                    <Phone size={15} />
                    {doctor.phone}
                  </div>

                </td>

                <td>

                  <span
                    className={
                      doctor.status === "Active"
                        ? "status active"
                        : "status inactive"
                    }
                  >
                    {doctor.status}
                  </span>

                </td>

                <td>

                  <div className="actions">

                    <button className="view">
                      <Eye size={17} />
                    </button>

                    <button className="edit">
                      <SquarePen size={17} />
                    </button>

                    <button className="delete">
                      <Trash2 size={17} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>
  );
}

export default DoctorManagementTable;