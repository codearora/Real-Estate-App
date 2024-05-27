// src/components/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProperties = async () => {
        try {
            const res = await axios.get('/api/properties');
            setProperties(res.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching properties');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Welcome to our Real Estate Platform!</h1>
            <p>Explore available properties and find your dream home.</p>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <h2>Available Properties</h2>
            <ul>
                {properties.map(property => (
                    <li key={property.id}>
                        <Link to={`/property/${property.id}`}>
                            {property.place} - {property.area} sqft
                            {property.image && <img src={`/${property.image}`} alt={property.place} style={{ width: '100px', height: '100px' }} />}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
