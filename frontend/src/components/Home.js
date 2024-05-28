// Home.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Home.css'; // Import CSS file

const Home = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProperties = async () => {
        try {
            const res = await axios.get('/properties');
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
        <div className="container">
            <h1 className="title">Welcome to the India's most trusted Real Estate Hub !</h1>
            <p className="subtitle">Find your dream home hassle-free.</p>
            <Link to="/login" className="link">Login</Link>
            <Link to="/register" className="link">Register</Link>
            <h2 className="properties-title">Properties</h2>
            <ul className="properties">
                {properties.map(property => (
                    <li key={property.id} className="property">
                        <Link to={`/property/${property.id}`} className="property-link">
                            <h3>{property.place}</h3>
                            <p>Area: {property.area} sqft</p>
                            <p>Price: ${property.price}</p>
                            <div className="property-details">
                                <p>{property.description}</p>
                                <p>Bedrooms: {property.bedrooms}</p>
                                <p>Bathrooms: {property.bathrooms}</p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
