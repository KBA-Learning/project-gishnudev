import React from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Navbar from './components/Navbar'
// import { Form } from 'react-router-dom'
import { Home } from './pages/Home'
// import Hero from './components/Hero'
// import Footer from './components/Footer'
// import Features from './components/Features'
// import Here from './components/Here'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import UserDash from './pages/UserDash';


import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from 'react-router-dom'
import AdminDash from './pages/AdminDash';


const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      {/*Public Routes*/}
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path='/AdminDash' element={<AdminDash/>}/>
      <Route path='/UserDash' element={<UserDash/>}/>
      {/*Protected Routes*/}
      {/* <Route element ={<AuthLayout />}>
        <Route element={<MainLayout />}> */}
        
        {/* <Route path="/courses" element={<Courses />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/add-course" element={<AddCourse />} />
        <Route
          path="/edit-course/:id"
          element={<UpdateCourse />}
          loader={courseLoader} 
          />
          <Route 
            path = "/course/:id"
            element={<CoursePage />}
            loader={courseLoader}
            />
            </Route>
            </Route> */}
            {/* Not found route*/}
            {/* <Route path="*" element ={<NotFound />} /> */}
      </>
    )
  );
return (
  <>
    <RouterProvider router={router} />
    <ToastContainer />
  </>
  )
}

export default App