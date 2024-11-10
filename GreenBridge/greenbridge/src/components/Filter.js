// Filter.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './filter.css';

const Filter = ({ category, setCategory, madeOf, setMadeOf, sortOrder, setSortOrder }) => {
  const BASE_URL = 'https://albintomy.pythonanywhere.com';
  const [categories, setCategories] = useState([]);
  const [madeOfOptions, setMadeOfOptions] = useState([]);

  // Fetch filter options
  const fetchFilterOptions = () => {
    // Fetch categories
    axios.get(`${BASE_URL}/api/v1/products/category-list/`)
      .then(response => setCategories(response.data))
      .catch(error => console.error("Error fetching categories:", error));

    // Fetch madeOf options
    axios.get(`${BASE_URL}/api/v1/products/madeof-list/`)
      .then(response => setMadeOfOptions(response.data))
      .catch(error => console.error("Error fetching materials:", error));
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  return (
    <aside className="hard-filter-sidebar">
      <h3>Filter & Sort</h3>

      {/* Sort Bar */}
      <div className="hard-sort-bar">
        <label htmlFor="sortOrder">Sort by:</label>
        <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="default">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          {/* <option value="rating">Rating</option> */}
        </select>
      </div>

      {/* Category Filter */}
      <div className="hard-filter-group">
        <h4>Category</h4>
        <select id="filterCategory" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Brand Filter */}

      {/* Country Filter */}

      {/* Made Of Filter */}
      <div className="hard-filter-group">
        <h4>Material</h4>
        <select id="filterMadeOf" value={madeOf} onChange={(e) => setMadeOf(e.target.value)}>
          <option value="all">All</option>
          {madeOfOptions.map(m => (
            <option key={m.id} value={m.name}>{m.name}</option>
          ))}
        </select>
      </div>
    </aside>
  );
};

export default Filter;