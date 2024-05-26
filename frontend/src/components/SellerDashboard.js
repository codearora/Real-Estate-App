import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SellerDashboard = () => {
    const [properties, setProperties] = useState([]);
    const [newProperty, setNewProperty] = useState({
        place: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        nearbyHospitals: '',
        nearbyColleges: ''
    });
    const [updatedProperty, setUpdatedProperty] = useState(null);
    const [error, setError] = useState('');

    const fetchProperties = async () => {
        const sellerId = localStorage.getItem('userId');
        const res = await axios.get(`/properties/seller/${sellerId}`);
        setProperties(res.data);
    };

    const deleteProperty = async (id) => {
        try {
            await axios.delete(`/properties/${id}`);
            fetchProperties();
        } catch (error) {
            console.error(error);
            alert('Error deleting property');
        }
    };

    const addProperty = async () => {
        try {
            const sellerId = localStorage.getItem('userId');
            const propertyWithSellerId = { ...newProperty, sellerId };
            await axios.post(`/properties`, propertyWithSellerId);
            setNewProperty({
                place: '',
                area: '',
                bedrooms: '',
                bathrooms: '',
                nearbyHospitals: '',
                nearbyColleges: ''
            });
            fetchProperties();
        } catch (error) {
            setError('Error adding property');
        }
    };

    const updateProperty = async () => {
        try {
            await axios.put(`/properties/${updatedProperty.id}`, updatedProperty);
            setUpdatedProperty(null);
            fetchProperties();
        } catch (error) {
            setError('Error updating property');
        }
    };

    const handleNewChange = (e) => {
        setNewProperty({ ...newProperty, [e.target.name]: e.target.value });
    };

    const handleUpdateChange = (e, property) => {
        setUpdatedProperty({ ...property, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    return (
        <div>
            <h2>My Properties</h2>
            <ul>
                {properties.map(property => (
                    <li key={property.id}>
                        {updatedProperty && updatedProperty.id === property.id ? (
                            <div>
                                <input type="text" name="place" value={updatedProperty.place} onChange={(e) => handleUpdateChange(e, updatedProperty)} />
                                <input type="text" name="area" value={updatedProperty.area} onChange={(e) => handleUpdateChange(e, updatedProperty)} />
                                <button onClick={updateProperty}>Save</button>
                            </div>
                        ) : (
                            <div>
                                {property.place} - {property.area} sqft
                                <button onClick={() => setUpdatedProperty(property)}>Update</button>
                                <button onClick={() => deleteProperty(property.id)}>Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <h2>Add New Property</h2>
            <div>
                <input type="text" name="place" placeholder="Place" value={newProperty.place} onChange={handleNewChange} />
                <input type="text" name="area" placeholder="Area" value={newProperty.area} onChange={handleNewChange} />
                <input type="text" name="bedrooms" placeholder="Bedrooms" value={newProperty.bedrooms} onChange={handleNewChange} />
                <input type="text" name="bathrooms" placeholder="Bathrooms" value={newProperty.bathrooms} onChange={handleNewChange} />
                <input type="text" name="nearbyHospitals" placeholder="Nearby Hospitals" value={newProperty.nearbyHospitals} onChange={handleNewChange} />
                <input type="text" name="nearbyColleges" placeholder="Nearby Colleges" value={newProperty.nearbyColleges} onChange={handleNewChange} />
                <button onClick={addProperty}>Add Property</button>
            </div>
            {error && <div>{error}</div>}
        </div>
    );
};

export default SellerDashboard;
