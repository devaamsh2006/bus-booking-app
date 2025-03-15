import React, { useContext } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import RootLayout from './components/RootLayout'
import Home from './components/Home';
import Login from './components/Login';
import Help from './components/Help';
import Buses from './components/Buses';
import Signup from './components/SignUp';
import SignupDetails from './components/SignupDetails';
import Operator from './components/Operator';
import Driver from './components/Driver';
import OperatorProfile from './components/OperatorProfile';
import DriverBuses from './components/DriverBuses';
import ProfileOfAuthor from './components/ProfileOfAuthor';
import RequestsOfDriver from './components/RequestsOfDriver';
import FollowOfOperator from './components/FollowOfOperator';
import { userDetails } from './context/UserAuthentication';
import './App.css';
import OpeartorBuses from './components/OpeartorBuses';
import BusesOfOperator from './components/BusesOfOperator';
import NewBus from './components/NewBus';
import TicketHistory from './components/TicketHistory';
import BusesAvailable from './components/BusesAvailable';
import AddTrips from './components/AddTrips';
import BookBus from './components/BookBus';

function App() {
  const {currentuser}=useContext(userDetails);
  const browserRouter=createBrowserRouter([
    {
      element:<RootLayout />,
      path:'',
      children:[
        
        {
          path:'signup-details',
          element:<SignupDetails />
        },
        {
          path:'',
          element:<Home />
        },
        {
          path:'searchbuses',
          element:<Buses />
        },
        {
          path:'busesavailable',
          element:<BusesAvailable />
        },
        {
          path:'bookbus',
          element:<BookBus />
        },
        {
          path:'login',
          element:<Login />
        },
        {
          path:'signup',
          element:<Signup />
        },
        {
          path:'help',
          element:<Help />
        },
        {
          path:'operator',
          element:<OperatorProfile />,
          children:[
            {
            path:'profile',
            element:<Operator />,
            children:[
              {
                path:':operatorId',
                element:<ProfileOfAuthor />
              },
              {
                path:'follow',
                element:<FollowOfOperator />
              }
            ]
            },
            {
            path:'buses',
            element:<OpeartorBuses />,
            children:[
              {
                path:':operatorId',
                element:<BusesOfOperator />
              },
              {
                path:'newbus',
                element:<NewBus />
              },
              {
                path:'addtrips',
                element:<AddTrips />
              }
            ]
            }
          ]
          },
          {
          path:'driver',
          element:<Operator />,
          children:[
            {
              path:':driverId',
              element:<ProfileOfAuthor />
            },
            {
              path:'accept',
              element:<RequestsOfDriver />
            }
          ]
          },
          {
            path:'driver/buses',
            element:<DriverBuses />
          },
          {
            path:'user',
            element:<Operator />,
            children:[
              {
                path:':userid',
                element:<ProfileOfAuthor />
              },
              {
                path:'tickethistory',
                element:<TicketHistory />
              }
            ]
          }
        ]
    }
  ])


  return (<RouterProvider router={browserRouter}/>);
}

export default App