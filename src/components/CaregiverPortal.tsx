import React from 'react';

interface CaregiverPortalProps {
  userData: any;
  setUserData: (data: any) => void;
}

export const CaregiverPortal: React.FC<CaregiverPortalProps> = ({ userData, setUserData }) => {
  return (
    <div className="caregiver-portal">
      <h2>Caregiver Portal</h2>
      {/* Caregiver portal implementation */}
    </div>
  );
}; 