// import React from 'react'
// import { useLocation } from 'react-router-dom'
// import DriverIcon from './DriverIcon';

// function BookBus() {
//     const {state}=useLocation();
//     const noOfSeats=state.busDetails[0].seats;
//     const noOfRows=state.busDetails[0].rows;
    
//   return (
//     <div className='flex p-10 w-full justify-center items-center'>
//         <div className='flex flex-col min-h-[70vh] gap-7 p-3 border-2 border-black rounded-md'>
//         <div className='border-2 w-10 h-10 border-black rounded-md'><DriverIcon className='scale-[1.5]' /></div>
//           {
//             noOfSeats%4===0 
//             ?
//             <>
//               {
//                 Array.from({length:noOfRows}).map(()=>{
//                   return (
//                     <div className='flex gap-12'>
//                       <div className='flex gap-1'>
//                       {
//                         Array.from({length:2}).map(()=>{
//                           return <div className='border-2 w-10 h-10 border-black rounded-md'></div>
//                         })
//                       }
//                       </div>
//                       <div className='flex gap-1'>
//                       {
//                         Array.from({length:2}).map(()=>{
//                           return <div className='border-2 w-10 h-10 border-black rounded-md'></div>
//                         })
//                       }</div>
//                     </div>
//                   )
//                 })
//               }
//             </>
//             :
//             <>
//             {
//                 Array.from({length:noOfRows}).map((_,index)=>{
//                   return (
//                     <div className='flex gap-12'>
//                     {
//                       index!==noOfRows-1 ?
//                       <>
//                       <div className='flex gap-1'>
//                       {
//                         Array.from({length:2}).map(()=>{
//                           return <div className='border-2 w-10 h-10 border-black rounded-md'></div>
//                         })
//                       }
//                       </div>
//                       <div className='flex gap-1'>
//                       {
//                         Array.from({length:2}).map(()=>{
//                           return <div className='border-2 w-10 h-10 border-black rounded-md'></div>
//                         })
//                       }
//                       </div>
//                       </>
//                       :
//                       <>
//                       <div className='flex gap-1'>
//                       {
//                         Array.from({length:5}).map(()=>{
//                           return <div className='border-2 w-10 h-10 border-black rounded-md'></div>
//                         })
//                       }
//                       </div>
//                       </>
//                     }
//                     </div>
                  
//                   )
//                 })
//               }
//             </>
//           }
//         </div>
//     </div>
//   )
// }

// export default BookBus
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
    const toggleSeatSelection = (rowIndex, seatIndex) => {
        const seatId = `${rowIndex}-${seatIndex}`;
        
        if (selectedSeats.includes(seatId)) {
            // If seat is already selected, unselect it
            setSelectedSeats(selectedSeats.filter(seat => seat !== seatId));
        } else {
            // If seat is not selected, select it
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };
    
    // Function to determine seat color
    const getSeatColor = (rowIndex, seatIndex) => {
        const seatId = `${rowIndex}-${seatIndex}`;
        return selectedSeats.includes(seatId) ? 'bg-green-500' : 'bg-white';
    };
    
    // Component for a single seat
    const Seat = ({ rowIndex, seatIndex }) => (
        <div 
            className={`border-2 w-10 h-10 border-black rounded-md cursor-pointer ${getSeatColor(rowIndex, seatIndex)}`}
            onClick={() => toggleSeatSelection(rowIndex, seatIndex)}
        ></div>
    );
  
    return (
        <div className='flex p-10 w-full justify-center items-center'>
            <div className='flex flex-col min-h-[70vh] gap-7 p-3 border-2 border-black rounded-md'>
                <div className='border-2 w-10 h-10 border-black rounded-md'>
                    <DriverIcon className='scale-[1.5]' />
                </div>
                
                {noOfSeats % 4 === 0 ? (
                    <>
                        {Array.from({ length: noOfRows }).map((_, rowIndex) => (
                            <div key={rowIndex} className='flex gap-12'>
                                <div className='flex gap-1'>
                                    {Array.from({ length: 2 }).map((_, seatIndex) => (
                                        <Seat 
                                            key={`${rowIndex}-left-${seatIndex}`} 
                                            rowIndex={rowIndex} 
                                            seatIndex={`left-${seatIndex}`} 
                                        />
                                    ))}
                                </div>
                                <div className='flex gap-1'>
                                    {Array.from({ length: 2 }).map((_, seatIndex) => (
                                        <Seat 
                                            key={`${rowIndex}-right-${seatIndex}`} 
                                            rowIndex={rowIndex} 
                                            seatIndex={`right-${seatIndex}`} 
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        {Array.from({ length: noOfRows }).map((_, rowIndex) => (
                            <div key={rowIndex} className='flex gap-12'>
                                {rowIndex !== noOfRows - 1 ? (
                                    <>
                                        <div className='flex gap-1'>
                                            {Array.from({ length: 2 }).map((_, seatIndex) => (
                                                <Seat 
                                                    key={`${rowIndex}-left-${seatIndex}`} 
                                                    rowIndex={rowIndex} 
                                                    seatIndex={`left-${seatIndex}`} 
                                                />
                                            ))}
                                        </div>
                                        <div className='flex gap-1'>
                                            {Array.from({ length: 2 }).map((_, seatIndex) => (
                                                <Seat 
                                                    key={`${rowIndex}-right-${seatIndex}`} 
                                                    rowIndex={rowIndex} 
                                                    seatIndex={`right-${seatIndex}`} 
                                                />
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className='flex gap-1'>
                                            {Array.from({ length: 5 }).map((_, seatIndex) => (
                                                <Seat 
                                                    key={`${rowIndex}-last-${seatIndex}`} 
                                                    rowIndex={rowIndex} 
                                                    seatIndex={`last-${seatIndex}`} 
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}

export default BookBus