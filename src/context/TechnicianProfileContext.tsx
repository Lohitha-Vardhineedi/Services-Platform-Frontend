import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

type Technician = {
  _id: string;
  userId: string;
  username: string;
  role: string;
  phoneNumber: string;
  // ...other fields
  [key: string]: any;
};

type Profile = {
  _id: string;
  technicianId: string;
  description: string;
  profileImage: string;
  photos: any[];
  services: any[];
  // ...other fields
  [key: string]: any;
};

type TechnicianProfileData = {
  technician: Technician;
  profile: Profile | null;
};

type TechnicianProfileContextType = {
  data: TechnicianProfileData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

const TechnicianProfileContext = createContext<TechnicianProfileContextType | undefined>(undefined);

export const useTechnicianProfile = () => {
  const context = useContext(TechnicianProfileContext);
  if (!context) throw new Error("useTechnicianProfile must be used within TechnicianProfileProvider");
  return context;
};

export const TechnicianProfileProvider = ({
  technicianId,
  children,
}: {
  technicianId: string;
  children: ReactNode;
}) => {
  const [data, setData] = useState<TechnicianProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:4105/api/techProfile/getTechProfileData/${technicianId}`);
      setData(res.data.result);
    } catch (err: any) {
      setError(err.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [technicianId]);

  return (
    <TechnicianProfileContext.Provider value={{ data, loading, error, refetch: fetchData }}>
      {children}
    </TechnicianProfileContext.Provider>
  );
};