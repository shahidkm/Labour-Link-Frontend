import { Routes, Route } from "react-router-dom";
import Registration from "../Pages/User/Authentication/Registration";
import LoginPage from "../Pages/User/Authentication/Login";
import LabourHomePage from "../Components/Labour/LabourHomePage";
import Dashboard from "../Pages/Admin/Dashboard";
import JobPosts from "../Pages/Admin/JobPosts";
import MunicipalitiesByState from "../Pages/Admin/MunicipalityByState";
import Municipalities from "../Pages/Admin/Municipalities";
import Skills from "../Pages/Admin/Skills";
import Users from "../Pages/Admin/Users";

import ClientHome from "../Pages/User/Employer/EmployerHome";
import UpdateProfile from "../Pages/User/Labour/ProfileUpdation";
import UpdateEmployerProfile from "../Pages/User/Employer/ProfileUpdation";
import PostedJobPosts from "../Pages/User/Employer/PostedJobPosts";

import UpdateJobPostForm from "../Pages/User/Employer/UpdateJobPost";
import ProfileSettings from "../Pages/User/Labour/Profile";
import Home from "../Components/Admin/AdminHome";
import ProfileForm from "../Pages/User/Employer/ProfileForm";

import JobPostSearch from "../Pages/User/Labour/JobPostSearcg";
import LandingPage from "../Components/User/LandingPage";
import JobDetailsPage from "../Components/Labour/JobPostDetailsPage";
import JobForm from "../Pages/User/Employer/PostJobPage";
import EditLabourProfile from "../Pages/User/Labour/EditLabourProfile";



import EmployerProfile from "../Pages/User/Employer/EmployerProfile";
import LabourProfileTwo from "../Pages/User/Employer/LabouProfile";

import LabourProfilePage from "../Pages/User/Labour/LabourProfilePage";
import NewChat from "../Chat/chat";
import ContactsList from "../Chat/contactList";
const RoutesConfig = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage/>} />
      <Route path="/labour/:labourId" element={<LabourProfileTwo />} />
   
   
      <Route path="/show-labour-profile" element={<LabourProfilePage />} />
      <Route path="/labour-profile" element={<LabourProfileTwo/>} />
      <Route path="/edit-labour-profile" element={<EditLabourProfile/>} />
      <Route path="/job-details/:jobId" element={<JobDetailsPage />} />
      <Route path="/job-post-search" element={< JobPostSearch/>} />
   
      <Route path="/labour-home-page" element={<LabourHomePage />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/login" element={<LoginPage />} />
      {/* <Route path="/job/:jobId" element={<JobPostDetails />} /> */}
      {/* <Route path="/post-job" element={<JobForm/>} /> */}
      {/* // <Route path="/labour-review" element={<LabourReviews />} /> */}
      <Route path="/client-home-page" element={<ClientHome />} />
      <Route path="/profile-settings" element={<ProfileSettings />} />
      
      <Route path="/update-labour-profile" element={<UpdateProfile />} />

      {/* <Route path="/labour-details/:labourId" element={<LabourReviews />} /> */}
      {/* <Route path="/labour-reviews" element={<LabourReviews />} /> */}
     








{/* 
//employer/ */}

<Route path="/chat" element={<NewChat />} />

<Route path="/contact-list" element={<ContactsList />} />
<Route path="/post-job" element={<JobForm />} />
<Route path="/set-employer-profile" element={<ProfileForm />} />
<Route path="/update-employer-profile" element={<UpdateEmployerProfile />} />
      <Route path="/show-employer-profile" element={<EmployerProfile />} />
      <Route path="/posted-job-posts" element={<PostedJobPosts />} /> {/* Fixed route */}

      <Route path="/update-jobPost" element={<UpdateJobPostForm />} />







      {/* Admin Routes */}
      <Route path="/xs" element={<Home />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="jobposts" element={<JobPosts />} />
        <Route path="municipalities" element={<Municipalities />} />
        <Route path="skills" element={<Skills />} />
        <Route path="municipality-by-state" element={<MunicipalitiesByState />} /> {/* Fixed */}
      </Route>
    </Routes>
  );
};

export default RoutesConfig;
