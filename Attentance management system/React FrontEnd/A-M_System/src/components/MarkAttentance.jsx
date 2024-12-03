// import { useEffect, useState } from "react";
// import moment from "moment";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const MarkAttendance = () => {
//   const [userName, setUserName] = useState("");
//   const [employee_Id, setEmployeeId] = useState(null);
//   const [date, setDate] = useState("");
//   const [status, setStatus] = useState("");
//   const [attendanceExists, setAttendanceExists] = useState(false); // New state

//   useEffect(() => {
//     const storedUserName = localStorage.getItem("Name");
//     console.log("Stored User Name:", storedUserName);

//     if (storedUserName) {
//       setUserName(storedUserName); // Set the retrieved name to state
//       fetchEmployeeId(storedUserName); // Fetch employee ID based on stored user name
//     } else {
//       console.error("Username not found in localStorage");
//       toast.error("User name not found. Please log in again")

//     }

//     // Set the current date using moment.js
//     setDate(moment().format("YYYY-MM-DD"));
//   }, []);

//   // Fetch employee ID and check attendance
//   const fetchEmployeeId = async (userName) => {
//     try {
//       const res = await fetch(`/api/employee/${userName}`);

//       if (res.ok) {
//         const data = await res.json();
//         console.log("Employee ID fetched:", data.Result);
//         setEmployeeId(data.Result.employeeId);

//         // Check if attendance already exists for today
//         checkAttendance(data.Result.employeeId, moment().format("YYYY-MM-DD"));
//       } else {
//         console.error("Failed to fetch employee ID");
//         toast.error("User not found in the database. Please check your login details.")
//       }
//     } catch (error) {
//       console.error("Error fetching employee ID:", error);
//       toast.error("An error occurred while fetching employee ID.");
//     }
//   };

//   // Check if attendance exists
//   const checkAttendance = async (employeeId, date) => {
//     try {
//       const res = await fetch(`/api/attendance/${employeeId}/${date}`);

//       if (res.ok) {
//         const data = await res.json();
//         if (data.exists) {
//           setAttendanceExists(true); // Mark attendance as already recorded
//           toast.success("Attendance already marked for today.");
//         } else {
//           setAttendanceExists(false); // Allow marking attendance
//         }
//       } else {
//         setAttendanceExists(false);
//       }
//     } catch (error) {
//       toast.error("Error checking attendance:", error);
//       setAttendanceExists(false);
//     }
//   };

//   // Submit attendance data
//   const attendanceSubmit = async (attendanceDetails) => {
//     try {
//       console.log(attendanceDetails);
//       const res = await fetch("/api/markAttendance", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(attendanceDetails),
//       });

//       if (res.ok) {
//         alert("Attendance Marked Successfully");
//         toast.success("Attendance Marked Successfully.");
//         setAttendanceExists(true); // Prevent further entries for today
//       } else {
//         const data = await res.json();
//         console.error("Error response from server:", data);
//         toast.error("Attendance already Marked.")
//       }
//     } catch (error) {
//       toast.error("Server Error");
//     }
//   };

//   // Handle form submission
//   const onFormSubmit = (e) => {
//     e.preventDefault();

//     if (!employee_Id) {
//       alert("Employee ID is missing. Please refresh the page.");
//       return;
//     }

//     if (attendanceExists) {
//       alert("Attendance already marked for today.");
//       return;
//     }

//     const attendanceDetails = {
//       employee_Id,
//       date,
//       status,
//       timestamp: new Date().toISOString(),
//     };

//     attendanceSubmit(attendanceDetails);
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
//       <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>
//       <ToastContainer/>
//       <form onSubmit={onFormSubmit} className="space-y-4">
//         {/* Employee ID Input */}
//         <div>
//           <label htmlFor="employee_Id" className="block text-gray-700 font-medium">
//             Employee ID
//           </label>
//           <input
//             type="text"
//             id="employee_Id"
//             name="employee_Id"
//             value={employee_Id || ""}
//             readOnly
//             className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed"
//           />
//         </div>

//         {/* Date Input */}
//         <div>
//           <label htmlFor="date" className="block text-gray-700 font-medium">
//             Date
//           </label>
//           <input
//             type="date"
//             id="date"
//             name="date"
//             value={date}
//             readOnly
//             className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed"
//           />
//         </div>

//         {/* Status Input */}
//         <div>
//           <label htmlFor="status" className="block text-gray-700 font-medium">
//             Status
//           </label>
//           <select
//             id="status"
//             name="status"
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg p-2"
//             required
//             disabled={attendanceExists} // Disable if attendance exists
//           >
//             <option value="">Select Status</option>
//             <option value="present">Present</option>
//             <option value="absent">Absent</option>
//             <option value="on_leave">On Leave</option>
//           </select>
//         </div>

//         {/* Submit Button */}
//         <div>
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700"
//             disabled={attendanceExists} // Disable if attendance exists
//           >
//             {attendanceExists ? "Already Marked" : "Mark Attendance"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default MarkAttendance;

import { useEffect, useState } from "react";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Haversine formula for distance calculation
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degree) => (degree * Math.PI) / 180;
  const R = 6371e3; // Earth's radius in meters
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

const MarkAttendance = () => {
  const [userName, setUserName] = useState("");
  const [employee_Id, setEmployeeId] = useState(null);
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [attendanceExists, setAttendanceExists] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  const TARGET_LAT = 8.559405578322346;
  const TARGET_LON = 76.87908406566818;

  useEffect(() => {
    const storedUserName = localStorage.getItem("Name");
    console.log("Stored User Name:", storedUserName);

    if (storedUserName) {
      setUserName(storedUserName);
      fetchEmployeeId(storedUserName);
    } else {
      console.error("Username not found in localStorage");
      toast.error("User name not found. Please log in again");
    }

    setDate(moment().format("YYYY-MM-DD"));

    // Fetch current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        console.log("Current Location Fetched:", { latitude, longitude });
      },
      (error) => {
        console.error("Error fetching location:", error);
        toast.error("Could not fetch your location. Please enable location access.");
      }
    );
  }, []);

  const fetchEmployeeId = async (userName) => {
    try {
      const res = await fetch(`/api/employee/${userName}`);
      if (res.ok) {
        const data = await res.json();
        setEmployeeId(data.Result.employeeId);
        checkAttendance(data.Result.employeeId, moment().format("YYYY-MM-DD"));
      } else {
        toast.error("User not found in the database. Please check your login details.");
      }
    } catch (error) {
      console.error("Error fetching employee ID:", error);
      toast.error("An error occurred while fetching employee ID.");
    }
  };

  const checkAttendance = async (employeeId, date) => {
    try {
      const res = await fetch(`/api/attendance/${employeeId}/${date}`);
      if (res.ok) {
        const data = await res.json();
        if (data.exists) {
          setAttendanceExists(true);
          toast.success("Attendance already marked for today.");
        } else {
          setAttendanceExists(false);
        }
      } else {
        setAttendanceExists(false);
      }
    } catch (error) {
      toast.error("Error checking attendance.");
    }
  };

  const attendanceSubmit = async (attendanceDetails) => {
    try {
      const res = await fetch("/api/markAttendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attendanceDetails),
      });

      if (res.ok) {
        toast.success("Attendance Marked Successfully.");
        setAttendanceExists(true);
      } else {
        toast.error("Attendance already Marked.");
      }
    } catch (error) {
      toast.error("Server Error.");
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
  
    if (!currentLocation) {
      toast.error("Current location not available. Please enable GPS.");
      return;
    }
  
    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      TARGET_LAT,
      TARGET_LON
    );
    console.log("Distance to target location (in meters):", distance);
  
    // Check if distance is more than 100 meters (adjusted threshold)
    if (distance > 100) {
      toast.error("You are not within 100 meters of the required location.");
      return;
    }
  
    if (!employee_Id) {
      toast.error("Employee ID is missing. Please refresh the page.");
      return;
    }
  
    if (attendanceExists) {
      toast.error("Attendance already marked for today.");
      return;
    }
  
    const attendanceDetails = {
      employee_Id,
      date,
      status,
      timestamp: new Date().toISOString(),
    };
  
    attendanceSubmit(attendanceDetails);
  };
  
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>
      <ToastContainer />
      <form onSubmit={onFormSubmit} className="space-y-4">
        <div>
          <label htmlFor="employee_Id" className="block text-gray-700 font-medium">
            Employee ID
          </label>
          <input
            type="text"
            id="employee_Id"
            value={employee_Id || ""}
            readOnly
            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-gray-700 font-medium">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            readOnly
            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-gray-700 font-medium">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
            disabled={attendanceExists}
          >
            <option value="">Select Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700"
            disabled={attendanceExists}
          >
            {attendanceExists ? "Already Marked" : "Mark Attendance"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MarkAttendance;
