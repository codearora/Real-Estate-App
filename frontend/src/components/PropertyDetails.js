// src/components/PropertyDetails.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const PropertyDetails = () => {
    const [property, setProperty] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const userId = localStorage.getItem('userId');

    const fetchProperty = useCallback(async () => {
        const res = await axios.get(`/properties/${id}`);
        setProperty(res.data);
    }, [id]);

    useEffect(() => {
        fetchProperty();
    }, [fetchProperty]);

    const handleInterested = () => {
        if (!userId) {
            alert('Please login to see the owner details.');
            navigate('/login');
        } else {
            alert(`Seller Details: ${property.firstName} ${property.lastName}, Email: ${property.email}, Phone: ${property.phoneNumber}`);
        }
    };

    if (!property) return <div>Loading...</div>;

    return (
        <div>
            <h2>{property.place}</h2>
            <p>Area: {property.area} sqft</p>
            <p>Bedrooms: {property.bedrooms}</p>
            <p>Bathrooms: {property.bathrooms}</p>
            <p>Nearby Hospitals: {property.nearbyHospitals}</p>
            <p>Nearby Colleges: {property.nearbyColleges}</p>
            <button onClick={handleInterested}>I am interested</button>
        </div>
    );
};

export default PropertyDetails;
