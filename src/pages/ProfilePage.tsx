import React from 'react'
import ProfileCard from '../components/profile/ProfileCard.tsx'
import AllFilters from '../components/profile/AllFilters.tsx'

const ProfilePage = () => {
  return (
    <div className='p-4'>
        <ProfileCard/>
        <AllFilters/>
    </div>
  )
}

export default ProfilePage