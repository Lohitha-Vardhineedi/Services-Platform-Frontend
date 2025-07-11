import React from 'react'
import ProfileCard from '../components/profile/ProfileCard'
import AllFilters from '../components/profile/AllFilters'

const ProfilePage = () => {
  return (
    <div className='max-w-7xl mx-auto p-4'>
        <ProfileCard/>
        <AllFilters/>
    </div>
  )
}

export default ProfilePage