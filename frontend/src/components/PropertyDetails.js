// src/components/PropertyDetails.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PropertyDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProperty = async () => {
        try {
            const res = await axios.get(`/api/properties/${id}`);
            setProperty(res.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching property');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperty();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>{property.place}</h1>
            <p>Area: {property.area} sqft</p>
            <p>Bedrooms: {property.bedrooms}</p>
            <p>Bathrooms: {property.bathrooms}</p>
            {property.nearbyHospitals && <p>Nearby Hospitals: {property.nearbyHospitals}</p>}
            {property.nearbyColleges && <p>Nearby Colleges: {property.nearbyColleges}</p>}
            {property.image && <img src={`/${property.image}`} alt={property.place} style={{ width: '300px', height: '300px' }} />}
            <p>Seller: {property.firstName} {property.lastName}</p>
            <p>Contact: {property.email} | {property.phoneNumber}</p>
        </div>
    );
};

export default PropertyDetails;
