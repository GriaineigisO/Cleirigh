import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Profile = () => {
    const { id } = useParams(); 
    const [profileData, setProfileData] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        const getProfileData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await fetch('http://localhost:5000/ancestor-profiles', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, id }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile data');
                }

                const data = await response.json();
                setProfileData(data);
            } catch (err) {
                console.error('Error fetching profile data:', err);
                setError('Unable to fetch profile data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        getProfileData();
    }, [id]);

    
    if (loading) {
        return <div>Loading...</div>;
    }

    
    if (error) {
        return <div>{error}</div>;
    }

    
    return (
        <div>
            <h1>{profileData.first_name} {profileData.middle_name} {profileData.last_name}</h1>
            <p>Birthdate: {profileData.birthDate}</p>
            <p>Birthplace: {profileData.birthPlace}</p>
            {/* Render more fields as needed */}
        </div>
    );
};

export default Profile;
