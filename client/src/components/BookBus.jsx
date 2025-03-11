import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import DriverIcon from './DriverIcon';

function BookBus() {
    const { state } = useLocation();
    const noOfSeats = state.busDetails[0].seats;
    const noOfRows = state.busDetails[0].rows;
    
    // Create a state to track selected seats
    const [selectedSeats, setSelectedSeats] = useState([]);
    
    // Function to handle seat selection
    const toggleSeatSelection = (seatNumber) => {
        if (selectedSeats.includes(seatNumber)) {
            // If seat is already selected, unselect it
            setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
        } else {
            // If seat is not selected, select it
            setSelectedSeats([...selectedSeats, seatNumber]);
        }
    };
    
    // Function to determine seat color
    const getSeatColor = (seatNumber) => {
        return selectedSeats.includes(seatNumber) ? 'bg-green-500' : 'bg-white';
    };
    
    // Component for a single seat
    const Seat = ({ seatNumber }) => (
        <div 
            className={`border-2 w-10 h-10 border-black rounded-md cursor-pointer ${getSeatColor(seatNumber)} flex items-center justify-center text-xs`}
            onClick={() => toggleSeatSelection(seatNumber)}
        >
            {seatNumber}
        </div>
    );
  
    return (
        <div className='flex p-10 w-full justify-center items-center'>
            <div className='flex flex-col min-h-[70vh] gap-7 p-3 border-2 border-black rounded-md'>
                <div className='border-2 w-10 h-10 border-black rounded-md'>
                    <DriverIcon className='scale-[1.5]' />
                </div>
                
                {noOfSeats % 4 === 0 ? (
                    <>
                        {Array.from({ length: noOfRows }).map((_, rowIndex) => {
                            // Calculate starting seat number for this row
                            const rowStartSeat = rowIndex * 4 + 1;
                            
                            return (
                                <div key={rowIndex} className='flex gap-12'>
                                    <div className='flex gap-1'>
                                        <Seat key={`seat-${rowStartSeat}`} seatNumber={rowStartSeat} />
                                        <Seat key={`seat-${rowStartSeat+1}`} seatNumber={rowStartSeat+1} />
                                    </div>
                                    <div className='flex gap-1'>
                                        <Seat key={`seat-${rowStartSeat+2}`} seatNumber={rowStartSeat+2} />
                                        <Seat key={`seat-${rowStartSeat+3}`} seatNumber={rowStartSeat+3} />
                                    </div>
                                </div>
                            );
                        })}
                    </>
                ) : (
                    <>
                        {Array.from({ length: noOfRows }).map((_, rowIndex) => {
                            // For regular rows, 4 seats per row
                            const rowStartSeat = rowIndex * (rowIndex === noOfRows - 1 ? 0 : 4) + 1;
                            // For the last row with 5 seats, calculate the starting seat number
                            const lastRowStartSeat = (noOfRows - 1) * 4 + 1;
                            
                            return (
                                <div key={rowIndex} className='flex gap-12'>
                                    {rowIndex !== noOfRows - 1 ? (
                                        <>
                                            <div className='flex gap-1'>
                                                <Seat key={`seat-${rowStartSeat}`} seatNumber={rowStartSeat} />
                                                <Seat key={`seat-${rowStartSeat+1}`} seatNumber={rowStartSeat+1} />
                                            </div>
                                            <div className='flex gap-1'>
                                                <Seat key={`seat-${rowStartSeat+2}`} seatNumber={rowStartSeat+2} />
                                                <Seat key={`seat-${rowStartSeat+3}`} seatNumber={rowStartSeat+3} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className='flex gap-1'>
                                                {Array.from({ length: 5 }).map((_, seatIndex) => (
                                                    <Seat 
                                                        key={`seat-${lastRowStartSeat+seatIndex}`} 
                                                        seatNumber={lastRowStartSeat+seatIndex} 
                                                    />
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
        </div>
    )
}

export default BookBus