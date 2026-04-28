import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);

  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  return (
    /* Main container: Fixed padding and centering for larger screens */
    <div className="w-full max-w-6xl m-auto p-3 sm:p-5">
      <p className="mb-4 text-xl font-semibold text-gray-800">All Appointments</p>

      <div className="bg-white border rounded-xl text-sm overflow-hidden shadow-md">
        
        {/* Desktop Header: Adjusted grid ratios for better readability on PC */}
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1.2fr_0.8fr_3fr_1fr_1fr] gap-1 py-4 px-6 border-b bg-gray-50 font-bold text-gray-700 uppercase text-xs tracking-wider">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p className="text-center">Action</p>
        </div>

        {/* Appointment Rows/Cards */}
        <div className="max-h-[85vh] overflow-y-auto">
          {[...appointments].reverse().map((item, index) => (
            <div
              key={index}
              /* Responsive Logic: Vertical cards on mobile, horizontal row on desktop */
              className="flex flex-col gap-4 sm:grid sm:grid-cols-[0.5fr_3fr_1.2fr_0.8fr_3fr_1fr_1fr] sm:gap-1 sm:items-center text-gray-600 py-5 px-6 border-b hover:bg-blue-50/30 transition-all duration-200"
            >
              {/* Mobile View Header: Index & Payment badge */}
              <div className="sm:hidden flex justify-between items-center bg-gray-50 -mx-6 -mt-5 px-6 py-2 border-b">
                <span className="font-bold text-gray-500">Appointment #{index + 1}</span>
                <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full ${
                    item.isPaid ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                  }`}>
                  {item.isPaid ? "Paid" : item.payment ? "Online" : "CASH"}
                </span>
              </div>

              {/* Index (Desktop Only) */}
              <p className="hidden sm:block font-medium">{index + 1}</p>

              {/* Patient Info */}
              <div className="flex items-center gap-3">
                <img
                  className="w-12 h-12 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                  src={item.userData.image}
                  alt="Patient"
                />
                <div>
                  <p className="text-gray-900 font-bold sm:font-semibold text-base sm:text-sm">{item.userData.name}</p>
                  <p className="sm:hidden text-xs text-gray-500">Age: {calculateAge(item.userData.dob)} years</p>
                </div>
              </div>

              {/* Payment Status (Desktop Only) */}
              <div className="hidden sm:block">
                <p className={`text-[11px] font-bold inline-block px-3 py-1 rounded-full border ${
                    item.isPaid ? "border-green-500 text-green-600 bg-green-50" : "border-gray-300 text-gray-600 bg-gray-50"
                  }`}>
                  {item.isPaid ? "PAID" : item.payment ? "ONLINE" : "CASH"}
                </p>
              </div>

              {/* Age (Desktop Only) */}
              <p className="hidden sm:block font-medium">{calculateAge(item.userData.dob)}</p>

              {/* Date & Time: Styled for easy reading on mobile */}
              <div className="flex justify-between items-center sm:block">
                <span className="sm:hidden text-xs font-bold text-gray-400 uppercase">Schedule</span>
                <p className="text-gray-800 sm:text-gray-600 font-medium sm:font-normal">
                  {slotDateFormat(item.slotDate)} <span className="text-blue-600 sm:text-gray-600 font-bold ml-1">| {item.slotTime}</span>
                </p>
              </div>

              {/* Fees */}
              <div className="flex justify-between items-center sm:block">
                <span className="sm:hidden text-xs font-bold text-gray-400 uppercase">Consultation Fee</span>
                <p className="text-gray-900 sm:text-gray-600 font-bold sm:font-medium text-base sm:text-sm">
                  {currency}{item.amount}
                </p>
              </div>

              {/* Actions: Full width buttons on mobile, centered icons on desktop */}
              <div className="flex justify-center sm:justify-center pt-2 sm:pt-0 border-t sm:border-none">
                {item.cancelled ? (
                  <p className="text-red-500 text-xs font-black bg-red-50 px-4 py-1.5 rounded-full uppercase tracking-widest">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-600 text-xs font-black bg-green-50 px-4 py-1.5 rounded-full uppercase tracking-widest">Completed</p>
                ) : (
                  <div className="flex items-center gap-6 sm:gap-2">
                    <button 
                      onClick={() => cancelAppointment(item._id)} 
                      className="hover:bg-red-50 p-1.5 rounded-full transition-all group"
                      title="Cancel Appointment"
                    >
                      <img className="w-10 sm:w-9 grayscale group-hover:grayscale-0 transition-all" src={assets.cancel_icon} alt="Cancel" />
                    </button>
                    <button 
                      onClick={() => completeAppointment(item._id)}
                      className="hover:bg-green-50 p-1.5 rounded-full transition-all group"
                      title="Mark as Completed"
                    >
                      <img className="w-10 sm:w-9 grayscale group-hover:grayscale-0 transition-all" src={assets.tick_icon} alt="Complete" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;