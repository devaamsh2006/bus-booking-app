import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import axios from 'axios';
import { userDetails } from '../context/UserAuthentication';

function OperatorBuses() {
  const { currentUser } = useContext(userDetails);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    async function handleOperator() {
      try {
        const res = await axios.post('https://bus-booking-app-1-okbp.onrender.com/operator/login', currentUser);
        console.log('Operator Status:', res.data);
        setStatus(res.data.payLoad);
      } catch (error) {
        console.error('Error fetching operator status:', error);
      }
    }
    handleOperator();
  }, [currentUser]);

  if (status === null) {
    return <p>Loading...</p>; 
  }

  return (
    <div className='min-h-[80vh] p-4'>
      {status.accepted && !status.blocked ? (
        <div className="flex flex-col">
          <div className="flex p-5 bg-slate-300 justify-around">
            <NavLink
              to={`${currentUser.userId}`}
              className="p-2 rounded-md text-black hover:bg-slate-200 flex justify-center items-center gap-2"
            >
              Your Buses
            </NavLink>
            <NavLink
              to="newbus"
              className="p-2 rounded-md text-black hover:bg-slate-200 flex justify-center items-center gap-2"
            >
              Add New Buses
            </NavLink>
          </div>
          <Outlet />
        </div>
      ) : (
        <p>Contact the Admin to Further Proceed</p>
      )}
    </div>
  );
}

export default OperatorBuses;
