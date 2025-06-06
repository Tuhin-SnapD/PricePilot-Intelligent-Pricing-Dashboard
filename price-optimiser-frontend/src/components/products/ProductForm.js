import React, { useState, useEffect } from 'react';
import api from '../../api';

const ProductForm = ({ product, onSave, onCancel }) => {
  const isEdit = Boolean(product);
  const [formData, setFormData] = useState({
    name: '', category: '', cost_price: '', selling_price: '',
    description: '', stock_available: '', units_sold: '', customer_rating: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        cost_price: product.cost_price,
        selling_price: product.selling_price,
        description: product.description,
        stock_available: product.stock_available,
        units_sold: product.units_sold,
        customer_rating: product.customer_rating || ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/products/${product.id}/`, formData);
      } else {
        await api.post('/products/', formData);
      }
      onSave();
    } catch (err) {
      console.error(err);
      alert('Error saving product');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <h3>{isEdit ? 'Edit Product' : 'Add New Product'}</h3>
      <div>
        <label>Name:</label>
        <input name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Category:</label>
        <input name="category" value={formData.category} onChange={handleChange} required />
      </div>
      <div>
        <label>Cost Price:</label>
        <input name="cost_price" type="number" step="0.01" value={formData.cost_price} onChange={handleChange} required />
      </div>
      <div>
        <label>Selling Price:</label>
        <input name="selling_price" type="number" step="0.01" value={formData.selling_price} onChange={handleChange} required />
      </div>
      <div>
        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} />
      </div>
      <div>
        <label>Stock Available:</label>
        <input name="stock_available" type="number" value={formData.stock_available} onChange={handleChange} required />
      </div>
      <div>
        <label>Units Sold:</label>
        <input name="units_sold" type="number" value={formData.units_sold} onChange={handleChange} required />
      </div>
      <div>
        <label>Customer Rating:</label>
        <input name="customer_rating" type="number" step="0.01" value={formData.customer_rating} onChange={handleChange} />
      </div>
      <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
      {isEdit && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};
export default ProductForm;
