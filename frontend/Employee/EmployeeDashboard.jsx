import React, { useState } from "react";
import { FiMenu, FiX, FiLogOut, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import Attendance from "./Attendance";
import Tasks from "./Tasks";
import Leave from "./Leave";

import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("attendance");
  const navigate = useNavigate();

  const renderPage = () => {
    if (active === "attendance") return <Attendance />;
    if (active === "tasks") return <Tasks />;
    if (active === "leave") return <Leave />;
  };

  return (
    <div className="emp-layout">
      {/* Sidebar */}
      <aside className={`emp-sidebar ${open ? "open" : "closed"}`}>
        <div className="sidebar-top">
          <h2>{open ? "Employee Portal" : "EP"}</h2>
          <button onClick={() => setOpen(!open)}>
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <nav className="sidebar-menu">
          <button
            className={active === "attendance" ? "active" : ""}
            onClick={() => setActive("attendance")}
          >
            Attendance
          </button>
          <button
            className={active === "tasks" ? "active" : ""}
            onClick={() => setActive("tasks")}
          >
            Tasks
          </button>
          <button
            className={active === "leave" ? "active" : ""}
            onClick={() => setActive("leave")}
          >
            Leave
          </button>
        </nav>

        <button className="logout-btn" onClick={() => navigate("/login")}>
          <FiLogOut />
          {open && <span>Logout</span>}
        </button>
      </aside>

      {/* Main */}
      <main className="emp-main">
        <header className="emp-header">
          <FiUser />
          <span>Employee</span>
        </header>

        <section className="emp-content">
          {renderPage()}
        </section>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
