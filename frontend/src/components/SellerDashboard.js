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
    const [updateMode, setUpdateMode] = useState(false);
    const [currentProperty, setCurrentProperty] = useState(null);

    const fetchProperties = async () => {
        try {
            const sellerId = localStorage.getItem('userId');
            const res = await axios.get(`/properties/seller/${sellerId}`);
            setProperties(res.data);
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    };

    const handleChange = (e) => {
        setNewProperty({ ...newProperty, [e.target.name]: e.target.value });
    };

    const handleAddProperty = async (e) => {
        e.preventDefault();
        try {
            const sellerId = localStorage.getItem('userId');
            await axios.post('/properties', { ...newProperty, sellerId });
            fetchProperties();
            setNewProperty({
                place: '',
                area: '',
                bedrooms: '',
                bathrooms: '',
                nearbyHospitals: '',
                nearbyColleges: ''
            });
        } catch (error) {
            console.error('Error adding property:', error);
            alert('Error adding property');
        }
    };

    const handleUpdateProperty = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/properties/${currentProperty.id}`, newProperty);
            fetchProperties();
            setNewProperty({
                place: '',
                area: '',
                bedrooms: '',
                bathrooms: '',
                nearbyHospitals: '',
                nearbyColleges: ''
            });
            setUpdateMode(false);
            setCurrentProperty(null);
        } catch (error) {
            console.error('Error updating property:11', error);
            alert('Error updating property11');
        }
    };

    const deleteProperty = async (id) => {
        try {
            await axios.delete(`/properties/${id}`);
            fetchProperties();
        } catch (error) {
            console.error('Error deleting property:', error);
            alert('Error deleting property');
        }
    };

    const startUpdateProperty = (property) => {
        setNewProperty({
            place: property.place,
            area: property.area,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            nearbyHospitals: property.nearbyHospitals,
            nearbyColleges: property.nearbyColleges
        });
        setCurrentProperty(property);
        setUpdateMode(true);
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    return (
        <div>
            <h2>My Properties</h2>
            <ul>
                {properties.map((property) => (
                    <li key={property.id}>
                        {property.place} - {property.area} sqft
                        <button onClick={() => startUpdateProperty(property)}>Update</button>
                        <button onClick={() => deleteProperty(property.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <h2>{updateMode ? 'Update Property' : 'Add Property'}</h2>
            <form onSubmit={updateMode ? handleUpdateProperty : handleAddProperty}>
                <div>
                    <label htmlFor="place">Place</label>
                    <input type="text" id="place" name="place" value={newProperty.place} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="area">Area</label>
                    <input type="number" id="area" name="area" value={newProperty.area} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="bedrooms">Bedrooms</label>
                    <input type="number" id="bedrooms" name="bedrooms" value={newProperty.bedrooms} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="bathrooms">Bathrooms</label>
                    <input type="number" id="bathrooms" name="bathrooms" value={newProperty.bathrooms} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="nearbyHospitals">Nearby Hospitals</label>
                    <input type="text" id="nearbyHospitals" name="nearbyHospitals" value={newProperty.nearbyHospitals} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="nearbyColleges">Nearby Colleges</label>
                    <input type="text" id="nearbyColleges" name="nearbyColleges" value={newProperty.nearbyColleges} onChange={handleChange} />
                </div>
                <button type="submit">{updateMode ? 'Update Property' : 'Add Property'}</button>
            </form>
        </div>
    );
};

export default SellerDashboard;
