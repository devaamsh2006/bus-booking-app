import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import axios from "axios";

function AddTrips() {
    const [presentStatus, setPresentStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false); // 🔥 Loading state
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { state } = useLocation();

    async function handletrips(credObj) {
        setIsLoading(true); // Start loading 🚀
        credObj.busId = state.busId;
        try {
            const res = await axios.post("http://localhost:4000/operator/addbus", credObj);
            if (res.data.message === "details added") {
                setPresentStatus("Trips Added Successfully");
            } else {
                setPresentStatus("Some Error Occurred");
                console.log(res);
            }
        } catch (error) {
            setPresentStatus("Some Error Occurred");
            console.error(error);
        }
        setIsLoading(false); // Stop loading ❌
    }

    return (
        <div className="p-4 min-h-[70vh]">
            <div className="flex flex-col border-2 border-slate-400 rounded-xl gap-2 shadow-lg p-4 hover:shadow-slate-300">
                <h1 className="text-xl font-medium">
                    From <span className="text-3xl font-semibold">{state.route[0].source}</span> To <span className="text-3xl font-semibold">{state.route[0].destination}</span>
                </h1>
                <h1 className="text-lg">Time: {state.stTime}</h1>
                <h1 className="text-lg flex gap-1">Ac: {state.Ac ? <span>Yes</span> : <span>No</span>}</h1>
                <h1>Price of ticket: {state.price}</h1>
                <h1 className="font-semibold">Intermediate Stations</h1>
                <ul className="px-4">
                    {state.route[0].intermediate.map((route, index) => (
                        <li key={index} className="list-disc">{route.station}</li>
                    ))}
                </ul>
                <form onSubmit={handleSubmit(handletrips)} className="flex flex-col gap-3">
                    <h1 className="text-lg font-semibold">Start Date:</h1>
                    <input
                        type="date"
                        {...register("stDate", {
                            required: true,
                            setValueAs: (value) => {
                                if (value) {
                                    const [year, month, day] = value.split("-");
                                    return `${day}-${month}-${year}`;
                                }
                                return value;
                            }
                        })}
                        className="border-slate-400 rounded-lg w-1/4 p-2 border-2 focus:outline-none focus:border-slate-700"
                    />
                    <h1 className="text-lg font-semibold">End Date:</h1>
                    <input
                        type="date"
                        {...register("endDate", {
                            required: true,
                            setValueAs: (value) => {
                                if (value) {
                                    const [year, month, day] = value.split("-");
                                    return `${day}-${month}-${year}`;
                                }
                                return value;
                            }
                        })}
                        className="border-slate-400 rounded-lg w-1/4 p-2 border-2 focus:outline-none focus:border-slate-700"
                    />
                    
                    {/* 🚀 Add Trips Button with Loading Spinner */}
                    <button
                        type="submit"
                        className="bg-black p-2 rounded-md text-white w-1/6 flex justify-center items-center"
                        disabled={isLoading} // Disable button when loading
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
                                ></path>
                            </svg>
                        ) : (
                            "Add Trips"
                        )}
                    </button>
                </form>

                {presentStatus === "Trips Added Successfully" && <p className="text-green-400 font-medium text-lg">Trips Added Successfully</p>}
                {presentStatus === "Some Error Occurred" && <p className="text-red-500 font-medium text-lg">Some error Occurred</p>}
            </div>
        </div>
    );
}

export default AddTrips;
