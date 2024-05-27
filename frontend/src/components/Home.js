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
            <h1 className="title">Welcome to our Real Estate Platform!</h1>
            <p className="subtitle">Explore available properties and find your dream home.</p>
            <Link to="/login" className="link">Login</Link>
            <Link to="/register" className="link">Register</Link>
            <h2>Available Properties</h2>
            <ul className="properties">
                {properties.map(property => (
                    <li key={property.id} className="property">
                        <Link to={`/property/${property.id}`}>{property.place} - {property.area} sqft</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
