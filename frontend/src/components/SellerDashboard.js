// src/components/SellerDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SellerDashboard = () => {
    const [properties, setProperties] = useState([]);
    const [formData, setFormData] = useState({
        place: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        nearbyHospitals: '',
        nearbyColleges: '',
        image: null,
    });
    const [editingProperty, setEditingProperty] = useState(null);

    const fetchProperties = async () => {
        const sellerId = localStorage.getItem('userId');
        try {
            const res = await axios.get(`/properties/seller/${sellerId}`);
            setProperties(res.data);
        } catch (error) {
            console.error('Error fetching properties:', error);
            alert('Error fetching properties');
        }
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const sellerId = localStorage.getItem('userId');
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });
        data.append('sellerId', sellerId);

        try {
            if (editingProperty) {
                await axios.put(`/properties/${editingProperty.id}`, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await axios.post('/properties', data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            fetchProperties();
            setFormData({
                place: '',
                area: '',
                bedrooms: '',
                bathrooms: '',
                nearbyHospitals: '',
                nearbyColleges: '',
                image: null,
            });
            setEditingProperty(null);
        } catch (error) {
            console.error('Error submitting property:', error);
            alert('Error submitting property');
        }
    };

    const handleEdit = (property) => {
        setEditingProperty(property);
        setFormData({
            place: property.place,
            area: property.area,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            nearbyHospitals: property.nearbyHospitals,
            nearbyColleges: property.nearbyColleges,
            image: null,
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/properties/${id}`);
            fetchProperties();
        } catch (error) {
            console.error('Error deleting property:', error);
            alert('Error deleting property');
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    return (
        <div>
            <h2>My Properties</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="place"
                    placeholder="Place"
                    value={formData.place}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    name="area"
                    placeholder="Area (sqft)"
                    value={formData.area}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    name="bedrooms"
                    placeholder="Bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    name="bathrooms"
                    placeholder="Bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="nearbyHospitals"
                    placeholder="Nearby Hospitals"
                    value={formData.nearbyHospitals}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="nearbyColleges"
                    placeholder="Nearby Colleges"
                    value={formData.nearbyColleges}
                    onChange={handleInputChange}
                />
                <input
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                />
                <button type="submit">{editingProperty ? 'Update' : 'Add'} Property</button>
            </form>
            <ul>
                {properties.map((property) => (
                    <li key={property.id}>
                        {property.place} - {property.area} sqft
                        {property.image && (
                            <img src={`/${property.image}`} alt={property.place} style={{ width: '100px', height: '100px' }} />
                        )}
                        <button onClick={() => handleEdit(property)}>Update</button>
                        <button onClick={() => handleDelete(property.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SellerDashboard;
