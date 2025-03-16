import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DriverIcon from './DriverIcon';
import axios from 'axios';
import { userDetails } from '../context/UserAuthentication';

function BookBus() {
    const navigate = useNavigate();
    const { currentUser } = useContext(userDetails);
    const { state } = useLocation();
    const noOfSeats = state.busDetails[0].seats;
    const noOfRows = state.busDetails[0].rows;
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [availableSeats, setAvailableSeats] = useState([]); // Fixed useState declaration
    // Fetch available seats
    const handleSeats = async () => {
        try {
            state.route.busId = state.busDetails[0]?.busId;
            const res = await axios.post('https://bus-booking-app-1-okbp.onrender.com/user/availableSeats', state.route);
            setAvailableSeats(res.data.availableSeats); // Fixed missing `data`
        } catch (err) {
            console.error("Error fetching available seats", err);
        }
    };

    useEffect(() => {
        handleSeats();
    }, []);

    // Toggle seat selection
    const toggleSeatSelection = (seatNumber) => {
        if (selectedSeats.includes(seatNumber)) {
            setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
        } else {
            setSelectedSeats([...selectedSeats, seatNumber]);
        }
    };

    // Book tickets
    const bookTickets = async () => {
        let details = {
            busId: state?.busDetails[0]?.busId,
            date: state.route.date,
            selectedSeats,
            source: state.route.source,
            destination: state.route.destination,
            userId: currentUser.userId,
            action: "book"
        };
        const res = await axios.put('https://bus-booking-app-1-okbp.onrender.com/user/book', details);
        if (res.data.message === "Tickets booked successfully") {
            let credObj={};
            credObj.userId=currentUser.userId;
            credObj.busId=state?.busDetails[0].busId;
            credObj.date=state.route.date;
            credObj.seats=selectedSeats;
            credObj.source=state.route.source;
            credObj.time=state.busDetails[0].stTime;
            credObj.destination=state.route.destination;
            console.log(credObj);
            const result=await axios.post('https://bus-booking-app-1-okbp.onrender.com/user/tickethistory',credObj);
            console.log(result)
            if(result.data.message==="tickets added"){
                navigate('/user/tickethistory');
            }
        }
    };

    // Get seat color based on availability
    const getSeatColor = (seatNumber) => {
        if (selectedSeats.includes(seatNumber)) return 'bg-green-500'; // Selected seats: Green
        return availableSeats.includes(seatNumber) ? 'bg-white' : 'bg-red-500'; // Available: White, Booked: Red
    };

    // Seat component
    const Seat = ({ seatNumber }) => (
        <div
            className={`border-2 w-10 h-10 border-black rounded-md cursor-pointer flex items-center justify-center text-xs ${getSeatColor(seatNumber)}`}
            onClick={() => availableSeats.includes(seatNumber) && toggleSeatSelection(seatNumber)} // Prevent selecting booked seats
        >
            {seatNumber}
        </div>
    );

    return (
        <div className='flex gap-10 p-10 w-full justify-center items-center relative'>
            <div className='flex flex-col min-h-[70vh] gap-7 p-3 border-2 border-black rounded-md'>
                <div className='border-2 w-10 h-10 border-black rounded-md'>
                    <DriverIcon className='scale-[1.5]' />
                </div>

                {/* Seat Layout */}
                {noOfSeats % 4 === 0 ? (
                    <>
                        {Array.from({ length: noOfRows }).map((_, rowIndex) => {
                            const rowStartSeat = rowIndex * 4 + 1;
                            return (
                                <div key={rowIndex} className='flex gap-12'>
                                    <div className='flex gap-1'>
                                        <Seat seatNumber={rowStartSeat} />
                                        <Seat seatNumber={rowStartSeat + 1} />
                                    </div>
                                    <div className='flex gap-1'>
                                        <Seat seatNumber={rowStartSeat + 2} />
                                        <Seat seatNumber={rowStartSeat + 3} />
                                    </div>
                                </div>
                            );
                        })}
                    </>
                ) : (
                    <>
                        {Array.from({ length: noOfRows }).map((_, rowIndex) => {
                            const rowStartSeat = rowIndex * (rowIndex === noOfRows - 1 ? 0 : 4) + 1;
                            const lastRowStartSeat = (noOfRows - 1) * 4 + 1;

                            return (
                                <div key={rowIndex} className='flex gap-12'>
                                    {rowIndex !== noOfRows - 1 ? (
                                        <>
                                            <div className='flex gap-1'>
                                                <Seat seatNumber={rowStartSeat} />
                                                <Seat seatNumber={rowStartSeat + 1} />
                                            </div>
                                            <div className='flex gap-1'>
                                                <Seat seatNumber={rowStartSeat + 2} />
                                                <Seat seatNumber={rowStartSeat + 3} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className='flex gap-1'>
                                                {Array.from({ length: 5 }).map((_, seatIndex) => (
                                                    <Seat key={`seat-${lastRowStartSeat + seatIndex}`} seatNumber={lastRowStartSeat + seatIndex} />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </>
                )}
            </div>

            {/* Booking Summary */}
            {selectedSeats.length > 0 && (
                <div className='p-5 flex flex-col gap-3 border-2 border-slate-700 rounded-xl'>
                    <p className='font-bold text-lg'>Total Price: {selectedSeats.length * state?.busDetails[0]?.price}</p>
                    <button onClick={bookTickets} className='bg-sky-400 p-3 shadow hover:shadow-sky-400 hover:bg-sky-500 transition-colors text-white rounded-lg'>Book Now</button>
                </div>
            )}

            <div className='absolute top-5 right-5 border-2 border-black rounded-xl p-4 flex flex-col gap-2'>
              <div className='flex gap-2 items-center'>
                <div className='w-3 h-3 rounded-sm bg-red-500 border-2 border-black'></div>
                <p>Booked</p>
              </div>
              <div className='flex gap-2 items-center'>
                <div className='w-3 h-3 rounded-sm bg-white border-2 border-black'></div>
                <p>Available</p>
              </div>
            </div>
        </div>
    );
}

export default BookBus;
