import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";

function UserDetails() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { state } = useLocation();
  const [formattedDate, setFormattedDate] = useState("");

  const [users,setUsers]=useState([]);

  // Function to handle date change and format it to dd-mm-yyyy
  const handleDateChange = (event) => {
    const selectedDate = event.target.value; // Format is yyyy-mm-dd by default
    if (selectedDate) {
      const [year, month, day] = selectedDate.split("-");
      const newFormattedDate = `${day}-${month}-${year}`;
      setFormattedDate(newFormattedDate);
      setValue("date", newFormattedDate); // Update form value
    }
  };

  const handleUsers = async (credObj) => {
    credObj.busId = state.busId;
    credObj.date = formattedDate; // Ensure date is sent in dd-mm-yyyy format

    try {
      const res = await axios.post(
        "https://bus-booking-app-1-okbp.onrender.com/driver/passengers",
        credObj
      );
      setUsers(res.data.payLoad);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-5 min-h-[90vh]">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleUsers)}>
        <h1>Select a Date</h1>
        <div className="flex gap-4 items-center">
          <input
            type="date"
            className="p-2 rounded-md border-2 border-slate-300 focus:outline-none focus:border-slate-800"
            onChange={handleDateChange}
          />
          <button type="submit" className="p-2 border-md rounded-lg border-2 border-black">
            Find Passengers
          </button>
        </div>
      </form>

      {
        users.length===0 &&
        <p className='text-lg'>No Passengers Found</p>
      }
      {
        users.length>0 &&
        users.map((user,index)=>{
            return(
                <div className='flex relative flex-col border-2 border-slate-400 rounded-xl gap-2 shadow-lg p-4'>
      <h1 className='text-lg'>Passenger Name:{user.fullName}</h1>
      <h1 className='text-lg flex gap-1'>PhoneNO: +91{user.phoneno}</h1>
      </div>
            )
        })
      }
    </div>
  );
}

export default UserDetails;
