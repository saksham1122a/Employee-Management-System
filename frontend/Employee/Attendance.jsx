import "./Attendance.css";
import { FiClock, FiLogIn, FiLogOut } from "react-icons/fi";

const Attendance = () => {
  return (
    <div className="attendance">
      {/* Header */}
      <div className="attendance-header">
        <div>
          <h1>Attendance</h1>
          <p>Track your daily work activity</p>
        </div>

        <div className="attendance-actions">
          <button className="checkin-btn">
            <FiLogIn /> Check In
          </button>
          <button className="checkout-btn">
            <FiLogOut /> Check Out
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <FiClock />
          <div>
            <span>Working Hours</span>
            <h3>7h 45m</h3>
          </div>
        </div>

        <div className="stat-card">
          <span className="status present">Present</span>
          <div>
            <span>Status</span>
            <h3>Today</h3>
          </div>
        </div>

        <div className="stat-card">
          <span className="status ontime">On Time</span>
          <div>
            <span>Check-in</span>
            <h3>09:12 AM</h3>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="history-card">
        <h2>Attendance History</h2>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Hours</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>24 Jan 2026</td>
              <td>09:05 AM</td>
              <td>06:00 PM</td>
              <td>8h 55m</td>
              <td><span className="badge present">Present</span></td>
            </tr>

            <tr>
              <td>23 Jan 2026</td>
              <td>09:45 AM</td>
              <td>05:30 PM</td>
              <td>7h 45m</td>
              <td><span className="badge late">Late</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
