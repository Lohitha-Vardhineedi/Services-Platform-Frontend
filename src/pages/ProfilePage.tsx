import React from 'react'
import { useLocation } from 'react-router-dom'
import ProfileCard from '../components/profile/ProfileCard'
import AllFilters from '../components/profile/AllFilters'

const ProfilePage = () => {
  const location = useLocation();
  const technicianId = location.state?.technicianId;

  return (
    <div className='max-w-7xl mx-auto p-4'>
        <ProfileCard technicianId={technicianId}/>
        <AllFilters/>
    </div>
  )
}

export default ProfilePage