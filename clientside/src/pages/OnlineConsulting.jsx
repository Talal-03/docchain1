import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import DoctorCard from "../components/DoctorCard";
import { toast } from "react-toastify";
import axiosInstance from "../axiosInstance";

const OnlineConsulting = () => {
  const navigate = useNavigate();
  const { doctors, token, backendUrl } = useContext(AppContext);

  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [speciality, setSpeciality] = useState("");
  const [city, setCity] = useState("All Cities");
  const [loading, setLoading] = useState(false);

  const specialities = [
    "General physician",
    "Gynecologist", 
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist"
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

    filtered = filtered.filter((doc) => doc.onlineConsultEnabled);

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

  const handleOnlineConsultClick = async (doctor) => {
    if (!token) {
      toast.error("Please login to start online consultation");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      // Some existing doctors may not have onlineConsultFee configured yet.
      // Fall back to profile fee to avoid backend "Missing required fields".
      const consultFee = Number(doctor.onlineConsultFee) || Number(doctor.fees) || 0;
      const doctorName = doctor.name?.trim();

      if (!doctor?._id || !doctorName || consultFee <= 0) {
        toast.error(
          "This doctor's online consultation fee is not configured yet."
        );
        return;
      }

      const { data } = await axiosInstance.post(
        `${backendUrl}/api/stripe/create-online-consult-checkout`,
        {
          doctorId: doctor._id,
          fee: consultFee,
          doctorName,
        }
      );

      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Failed to create payment session");
      }
    } catch (error) {
      console.error("Online consult error:", error);
      toast.error(error.response?.data?.message || "Failed to start consultation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[60vh] pb-14">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl px-5 py-6 sm:px-8 sm:py-8 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-blue-600 font-semibold mb-2">
              Instant Video Care
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Online Consulting
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Connect with available doctors in minutes through secure video consultations.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 w-fit">
            <span className="text-sm text-gray-500">Available online:</span>
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
            {cityOptions.map((cityOption) => (
              <option key={cityOption} value={cityOption}>
                {cityOption}
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
            onClick={() => setSpeciality("")}
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
              onClick={() => setSpeciality(spec)}
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
                No online consultants found
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Try changing speciality or city filters to see more available doctors.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCity("All Cities");
                  setSpeciality("");
                }}
                className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
              {filterDoc.map((doctor) => (
                <DoctorCard
                  key={doctor._id}
                  doctor={doctor}
                  showOnlineConsultButton={true}
                  showOnlineBadge={true}
                  onOnlineConsultClick={handleOnlineConsultClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-blue-800 mb-3">
          How Online Consulting Works
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Choose a Doctor</h3>
              <p className="text-sm text-gray-600">
                Select from available doctors marked "Available Now"
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Pay & Wait</h3>
              <p className="text-sm text-gray-600">
                Complete payment and wait for doctor acceptance
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Start Video Call</h3>
              <p className="text-sm text-gray-600">
                Connect instantly through secure video consultation
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnlineConsulting;
