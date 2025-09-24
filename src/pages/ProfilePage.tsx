import React, { useEffect, useState } from 'react'
import ProfileCard from '../components/profile/ProfileCard'
import AllFilters from '../components/profile/AllFilters'
import { getAllTechnicianDetails } from '../api/apiMethods'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

// types/technician.ts
export interface Technician {
  _id: string;
  username: string;
  phoneNumber: string;
  service: string;
  city: string;
  state: string;
  pincode: string;
  profileImage: string;
  description?: string;
  areaName?: string;
  buildingName?: string;
}

export interface TechnicianService {
  _id: string;
  serviceName: string;
  serviceImg: string;
  servicePrice: number;
}

export interface TechnicianImages {
  imageUrl: string[];
}
export interface Rating  {
 _id: string;
  userId: string;
  serviceId: string;
  review: string;
  rating: number;
  createdAt: string;
  username: string;
  profileImage: string;
}

export interface TechnicianDetailsResponse {
  technician: Technician;
  services: TechnicianService[];
  technicianImages: TechnicianImages;
  ratings: Rating[];
}


const ProfilePage: React.FC = () => {
const { technicianId } = useParams<{ technicianId: string }>();
 const [technicianDetails, setTechnicianDetails] = useState<TechnicianDetailsResponse | null>(null);
  const [error, setError] = useState('');
console.log("id", technicianId)

  useEffect(() => {
    const fetchTechAllDetails = async () => {
      try {
        const response = await getAllTechnicianDetails(technicianId);
        if (response?.success === true) {
          setTechnicianDetails(response.result);
        } else {
          setError('Invalid response format');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch technician details');
      }
    };

    if (technicianId) fetchTechAllDetails();
  }, [technicianId]);

  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!technicianDetails) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className='max-w-7xl mx-auto p-4'>
      <Helmet>
        <title>{technicianDetails.technician.username}'s Profile - PRNV Services</title>
        <meta name="description" content={`View the profile of ${technicianDetails.technician.username}, a top technician on PRNV Services.`} />
      </Helmet>
      <ProfileCard technician={technicianDetails.technician} rating={technicianDetails.ratings}/>
      <AllFilters  services={technicianDetails.services} 
      technician={technicianDetails.technician}
        technicianImages={technicianDetails?.technicianImages?.imageUrl}
        ratings={technicianDetails.ratings}/>
    </div>
  )
}

export default ProfilePage



  //  useEffect(() => {
  //     setRole(localStorage.getItem("role"));

  //     if (technicianId) {
  //         axios.get(`http://localhost:5000/api/techDetails/getTechAllDetails/${technicianId}`)
  //             .then((data: any) => {
  //                 if (data?.data?.result) {
  //                     const techData = data.data.result.technician;
  //                     console.log("TechData : ", techData)
  //                     setProfile({
  //                         name: techData.username || '',
  //                         service: techData.service || '',
  //                         location: `${techData.buildingName || ''}, ${techData.areaName || ''}, ${techData.city || ''}, ${techData.state || ''}, ${techData.pincode || ''}`.replace(/(, )+/g, ', ').replace(/^, |, $/g, ''),
  //                         years: techData.description || '',
  //                         image: techData.profileImage || '',
  //                         phoneNumber: techData.phoneNumber || ''
  //                     });
  //                 }
  //             })
  //             .catch((err: any) => {
  //                 console.error('Failed to fetch technician details:', err);
  //             });
  //     } else {
  //         let id = localStorage.getItem("userId");
  //         console.log("ID : ", id)

  //         if (id) {
  //             technicianGetProfile(id)
  //                 .then((data: any) => {
  //                     if (data?.result) {
  //                         setProfile({
  //                             name: data.result.username || '',
  //                             service: data.result.category || '',
  //                             location: `${data.result.buildingName || ''}, ${data.result.areaName || ''}, ${data.result.city || ''}, ${data.result.state || ''}, ${data.result.pincode || ''}`.replace(/(, )+/g, ', ').replace(/^, |, $/g, ''),
  //                             years: data.result.description || '',
  //                             image: data.result.profileImage || '',
  //                             phoneNumber: data.result.phoneNumber || ''
  //                         });
  //                     }
  //                 })
  //                 .catch((err: any) => {
  //                     console.error('Failed to fetch technician profile:', err);
  //                 });
  //         }
  //     }
  // }, [technicianId]);
