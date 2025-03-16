import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { userDetails } from '../context/UserAuthentication';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
function NewBus() {
  const [intermediate, setIntermediate] = useState(0);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const {currentUser}=useContext(userDetails);
  const navigate=useNavigate();
  const [drivers,setDrivers]=useState([]);

  const handleDrivers=async()=>{
    const res=await axios.post('https://bus-booking-app-1-okbp.onrender.com/operator/login',currentUser)
    setDrivers(res.data.payLoad.drivers);
  }

  useEffect(()=>{
    handleDrivers();
  },[])

  const [selectedDriverEmail, setSelectedDriverEmail] = useState("");

  // Handler to get email when a driver is selected
  const handleDriverChange = (event) => {
    const selectedDriverName = event.target.value;
    const driver = drivers.find(d => d.drivername === selectedDriverName);
    if (driver) {
      setSelectedDriverEmail(driver.email);
    } else {
      setSelectedDriverEmail("");
    }
  };

  async function handlenewBus(credObj) {
    const newbus={};
    newbus.busId=Date.now();
    const intermediateStations=[];
    for (let i = 0; i < Object.keys(credObj).length; i++) {
      const key = 'intermediate-' + i;
      if (credObj[key]) { 
          intermediateStations.push({station:credObj[key]});
      }
  }
    newbus.route=[{source:credObj.source,destination:credObj.destination,intermediate:intermediateStations}];
    newbus.price=Number(credObj.price);
    newbus.Ac= credObj.ac === 'true';
    newbus.seats=Number(credObj.seats);
    newbus.rows=Number(credObj.rows);
    newbus.username=currentUser.email;
    newbus.stTime=credObj.stTime;
    newbus.drivername=selectedDriverEmail;
    newbus.busNo=credObj.busNo;
    newbus.cancel = credObj.cancel === 'true';
    newbus.insurance = credObj.insurance === 'true';
    const res=await axios.post('https://bus-booking-app-1-okbp.onrender.com/operator/newbus',newbus);
    console.log(res)
    if(res.data.message==='bus added'){
      navigate(`/operator/buses/${currentUser.userId}`);
    }
  }

  function handleIntermediate() {
    setIntermediate(intermediate + 1);
  }

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center py-12 px-6">
      <form onSubmit={handleSubmit(handlenewBus)} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-center mb-6">Create New Bus</h2>

        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="source" className="text-lg font-medium">Source</label>
            <input
              type="text"
              id="source"
              placeholder="Enter Source"
              {...register('source', { required: 'Please enter a Source' })}
              className="border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 w-full rounded-xl p-3"
            />
            {errors.source && <span className="text-red-500 text-sm">{errors.source.message}</span>}
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="destination" className="text-lg font-medium">Destination</label>
            <input
              type="text"
              id="destination"
              placeholder="Enter Destination"
              {...register('destination', { required: 'Please enter a destination' })}
              className="border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 w-full rounded-xl p-3"
            />
            {errors.destination && <span className="text-red-500 text-sm">{errors.destination.message}</span>}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Intermediate Stations</h3>
            {Array.from({ length: intermediate }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-2">
                <label htmlFor={`intermediate-${index}`} className="text-lg font-medium">{`Intermediate Station ${index + 1}`}</label>
                <input
                  type="text"
                  id={`intermediate-${index}`}
                  placeholder={`Enter Intermediate Station ${index + 1}`}
                  {...register(`intermediate-${index}`, { required: `Please enter intermediate station ${index + 1}` })}
                  className="border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 w-full rounded-xl p-3"
                />
                {errors[`intermediate-${index}`] && <span className="text-red-500 text-sm">{errors[`intermediate-${index}`].message}</span>}
              </div>
            ))}
            <button type="button" onClick={handleIntermediate} className="text-sky-500 hover:text-sky-700 font-semibold">+ Add Intermediate Station</button>
          </div>

          <div>
          <label htmlFor="busNo" className="text-lg font-medium">BusLicence No:</label>
              <input
                type="text"
                id="busNo"
                placeholder="Enter Bus Licence No"
                {...register('busNo')}
                className="border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 w-full rounded-xl p-3"
              />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label htmlFor="price" className="text-lg font-medium">Price of Ticket</label>
              <input
                type="text"
                id="price"
                placeholder="Enter Ticket Price"
                {...register('price')}
                className="border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 w-full rounded-xl p-3"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="rows" className="text-lg font-medium">Number of Rows</label>
              <input
                type="text"
                id="rows"
                placeholder="Enter Number of Rows"
                {...register('rows')}
                className="border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 w-full rounded-xl p-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label htmlFor="seats" className="text-lg font-medium">Number of Seats</label>
              <input
                type="text"
                id="seats"
                placeholder="Enter Number of Seats"
                {...register('seats',{required:'Enter the no.of seats',min:{value:16,message:'The value of seats must be more than or equal to 16'}})}
                className="border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 w-full rounded-xl p-3"
              />
               {errors.seats && <span className="text-red-500 text-sm">{errors.seats.message}</span>}
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="stTime" className="text-lg font-medium">Start Time</label>
              <input
                type="time"
                id="stTime"
                {...register('stTime')}
                className="border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 w-full rounded-xl p-3"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="drivername" className="text-lg font-medium">Driver Name</label>
     <input list="drivername" onChange={handleDriverChange} className="w-1/2 p-4 rounded-xl focus:outline-none focus:border-slate-800 
                   border-2 border-slate-500"  placeholder="Select Driver" />
      <datalist id="drivername">
        {drivers.map((driver, index) => (
          <option key={index} value={driver.drivername} />
        ))}
      </datalist>

            {errors.drivername && <span className="text-red-500 text-sm">{errors.drivername.message}</span>}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">AC</h3>
              <div className="flex gap-6">
                <label>
                  <input type="radio" {...register('ac', { required: 'Please select an option' })} value="true" />
                  Yes
                </label>
                <label>
                  <input type="radio" {...register('ac', { required: 'Please select an option' })} value="false" />
                  No
                </label>
              </div>
              {errors.ac && <span className="text-red-500 text-sm">{errors.ac.message}</span>}
            </div>

            <div>
              <h3 className="text-lg font-medium">Cancel</h3>
              <div className="flex gap-6">
                <label>
                  <input type="radio" {...register('cancel', { required: 'Please select an option' })} value="true" />
                  Yes
                </label>
                <label>
                  <input type="radio" {...register('cancel', { required: 'Please select an option' })} value="false" />
                  No
                </label>
              </div>
              {errors.cancel && <span className="text-red-500 text-sm">{errors.cancel.message}</span>}
            </div>

            <div>
              <h3 className="text-lg font-medium">Insurance</h3>
              <div className="flex gap-6">
                <label>
                  <input type="radio" {...register('insurance', { required: 'Please select an option' })} value="true" />
                  Yes
                </label>
                <label>
                  <input type="radio" {...register('insurance', { required: 'Please select an option' })} value="false" />
                  No
                </label>
              </div>
              {errors.insurance && <span className="text-red-500 text-sm">{errors.insurance.message}</span>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg mt-6 transition-all"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewBus;
