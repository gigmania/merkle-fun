import React from 'react';
import '../styles/Spinner.css';
import loading from '../img/loading.png';

const Spinner = () => (
  <div className="spinner-box">
    <img className="spinner-img" src={loading} alt="loading indicator" />
  </div>
);

export default Spinner;
