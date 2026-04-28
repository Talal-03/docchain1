import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import DoctorCard from "../components/DoctorCard";
const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [city, setCity] = useState("All Cities");

  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const specialities = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  const cityOptions = [
    "All Cities",
    ...Array.from(
      new Set(
        doctors
          .map((doc) => doc.city)
          .filter(Boolean)
          .map((c) => c.trim())
      )
    ).sort((a, b) => a.localeCompare(b)),
  ];

  const applyFilter = () => {
    let filtered = doctors.filter((doc) => doc.status !== "suspended");

    if (speciality) {
      filtered = filtered.filter((doc) => doc.speciality === speciality);
    }

    if (city !== "All Cities") {
      const normalizedSelectedCity = city.toLowerCase().trim();
      filtered = filtered.filter(
        (doc) => doc.city?.toLowerCase().trim() === normalizedSelectedCity
      );
    }

    setFilterDoc(filtered);
  };
  useEffect(() => {
    applyFilter();
  }, [doctors, speciality, city]);

  return (
    <section className="min-h-[60vh] pb-14">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl px-5 py-6 sm:px-8 sm:py-8 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-blue-600 font-semibold mb-2">
              Find Your Specialist
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {speciality ? `${speciality} Doctors` : "Book with Trusted Doctors"}
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Browse verified doctors and choose the right specialist for your
              needs.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 w-fit">
            <span className="text-sm text-gray-500">Doctors found:</span>
            <span className="text-sm font-semibold text-gray-800">
              {filterDoc.length}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <div className="w-full sm:w-auto">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full sm:w-56 border border-gray-300 bg-white px-3 py-2.5 rounded-xl text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none"
          >
            {cityOptions.map((cityName) => (
              <option key={cityName} value={cityName}>
                {cityName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-5 mt-2">
        <button
          className={`py-2 px-4 border rounded-lg text-sm transition-all lg:hidden ${
            showFilter
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300"
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          {showFilter ? "Hide Specialities" : "Show Specialities"}
        </button>

        <div
          className={`${
            showFilter ? "flex" : "hidden lg:flex"
          } flex-col gap-2 text-sm text-gray-700 w-full lg:w-[260px] lg:sticky lg:top-4 bg-white border border-gray-200 rounded-2xl p-3 shadow-sm`}
        >
          <button
            type="button"
            onClick={() => navigate("/doctors")}
            className={`text-left px-3 py-2.5 rounded-lg transition-all ${
              !speciality
                ? "bg-blue-600 text-white font-medium"
                : "hover:bg-gray-50"
            }`}
          >
            All Specialities
          </button>
          {specialities.map((spec) => (
            <button
              type="button"
              key={spec}
              onClick={() => navigate(`/doctors/${spec}`)}
              className={`text-left px-3 py-2.5 rounded-lg transition-all ${
                speciality === spec
                  ? "bg-blue-600 text-white font-medium"
                  : "hover:bg-gray-50"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        <div className="w-full">
          {filterDoc.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-2xl p-8 sm:p-10 text-center bg-white">
              <h3 className="text-lg font-semibold text-gray-800">
                No doctors found
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Try changing speciality or city filters to see more doctors.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCity("All Cities");
                  navigate("/doctors");
                }}
                className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
              {filterDoc.map((item) => (
                <DoctorCard
                  key={item._id}
                  doctor={item}
                  showOnlineBadge={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Doctors;
