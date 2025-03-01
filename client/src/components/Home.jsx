import React,{useEffect,useContext} from 'react'
import Features from './Features'
import Promoting from './Promoting'
import Details from './Details'
import { BsBusFront } from "react-icons/bs";
import { FaHome } from "react-icons/fa";
import { CiFaceSmile } from "react-icons/ci";
import { CiLogin } from "react-icons/ci";
import { useClerk, useUser } from '@clerk/clerk-react';
import { userDetails } from '../context/UserAuthentication';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Home.css";

function Home() {
    const {isSignedIn,user,isLoaded}=useUser();
    const navigate = useNavigate()
      const {currentUser,setCurrentUser}=useContext(userDetails);
      async function handleUserLogin(){
        const differentUsers=['user','operator','driver','admin'];
        let found=0;
        let res={};
        for(let User of differentUsers){
          res=await axios.post(`http://localhost:4000/${User}/login`,{email:user?.emailAddresses[0].emailAddress});
           if(res.data.message==='login success'){
            found=1;
            break;
          }
        }
        if(found===0){
          await setCurrentUser({
            ...currentUser,
            fullName: user?.fullName,
            imageUrl: user?.imageUrl
          });
        }else{
          await setCurrentUser({
            ...currentUser,
            imageUrl:res.data?.payLoad.imageUrl,
            fullName:res.data?.payLoad.fullName,
            phoneno:res.data?.payLoad.phoneno,
            email:res.data?.payLoad.username,
            userType:res.data?.userType,
            userId:res.data?.payLoad.userId||res.data?.payLoad.operatorId||res.data?.payLoad.driverId,
            location:res.data?.payLoad.location
          });
          localStorage.setItem('currentUser',JSON.stringify(currentUser));
        }
        return found;
      }
      useEffect(()=>{
        async function fetchUserData(){
        setCurrentUser({
          ...currentUser,
          fullName:user?.fullName,
          email:user?.emailAddresses[0].emailAddress,
          imageUrl:user?.imageUrl,
        })
        if(isSignedIn===true){
          let found= await handleUserLogin();
          if(found==0) {
            navigate('/signup-details')
            navigate(0)
          }
        }
        }
        fetchUserData();
      },[isLoaded,currentUser.phoneno]);
  return (
    <div className='p-5'>
        <div className='flex w-full gap-5 home'>
            <div className='w-1/2 flex flex-col gap-4'>
                <p className='text-gray-500 text-lg'>Welcome to Our Bus Ticket Booking Platform</p>
                <h1 className='text-7xl  text-black font-bold'>Simplify Your<br/>Bus Journey</h1>
                <p className='text-gray-500 text-lg'>Book Your bus tickets with ease,track your bookings and<br/> manage your bookings.Our platform<br /> is a user-friendly website.</p>
                <div className='flex gap-3'>
                <button className='border border-black rounded-3xl p-3'>Book Ticket</button>
                <button className='bg-black text-white rounded-3xl p-3'>Contact Us</button>
                </div>
            </div>
            <div className='w-1/2'>
                <img src="/bus1.jpg" className='w-full'/>
            </div>
        </div>
        <Features />
        <Promoting />
        <Details />
    </div>
  )
}

export default Home