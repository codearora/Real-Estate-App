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
            <h2 className="properties-title">Available Properties</h2>
            <div className="properties">
                {properties.map(property => (
                    <div key={property.id} className="property">
                        <Link to={`/property/${property.id}`} className="property-link">
                            <div className="property-content">
                                <h3>{property.place}</h3>
                                <p>{property.area} sqft</p>
                                <p>{property.price}</p>
                                <p>{property.description}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
