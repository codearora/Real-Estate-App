import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PropertyDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await axios.get(`/properties/${id}`);
                setProperty(res.data);
            } catch (err) {
                setError('Error fetching property details');
            }
        };
        fetchProperty();
    }, [id]);

    if (error) return <div>{error}</div>;
    if (!property) return <div>Loading...</div>;

    return (
        <div>
            <h2>{property.place}</h2>
            <p>Area: {property.area} sqft</p>
            <p>Bedrooms: {property.bedrooms}</p>
            <p>Bathrooms: {property.bathrooms}</p>
            <p>Nearby Hospitals: {property.nearbyHospitals}</p>
            <p>Nearby Colleges: {property.nearbyColleges}</p>
            <button onClick={() => alert(`Seller Details: ${property.firstName} ${property.lastName}, Email: ${property.email}, Phone: ${property.phoneNumber}`)}>I am interested</button>
        </div>
    );
};

export default PropertyDetails;
