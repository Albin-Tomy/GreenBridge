import React, { useState } from 'react';
import axios from 'axios';
import backgroundImage from '../../../../src/assets/honey.jpg'; // Provide correct path

const ShgRegistration = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        registration_number: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);  // State for submit button
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple client-side validation
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setIsSubmitting(true);  // Disable button while submitting

        try {
            const response = await axios.post('http://localhost:8000/api/shg/register/', formData);
            setMessage(response.data.message);
            setError(null);
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error || 'Failed to submit registration. Please try again.');
            } else if (error.request) {
                setError('Network error. Please check your connection and try again.');
            } else {
                setError('Error: ' + error.message);
            }
            setMessage(null);
        } finally {
            setIsSubmitting(false);  // Re-enable button after submission
        }
    };

    // Inline CSS styles
    const styles = {
        backgroundContainer: {
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        registrationContainer: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '40px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
        },
        mainHeading: {
            fontSize: '36px',
            color: '#333',
            marginBottom: '10px',
        },
        subHeading: {
            fontSize: '18px',
            color: '#777',
            marginBottom: '20px',
        },
        formHeading: {
            fontSize: '24px',
            color: '#333',
            marginBottom: '20px',
        },
        formGroup: {
            marginBottom: '15px',
            textAlign: 'left',
        },
        formLabel: {
            display: 'block',
            fontWeight: 'bold',
            color: '#555',
            marginBottom: '5px',
        },
        formInput: {
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontSize: '16px',
        },
        submitButton: {
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '12px 20px',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            width: '100%',
            marginTop: '15px',
        },
        submitButtonHover: {
            backgroundColor: '#45a049',
        },
        successMessage: {
            color: 'green',
        },
        errorMessage: {
            color: 'red',
        },
    };

    return (
        <div style={styles.backgroundContainer}>
            <div style={styles.registrationContainer}>
                <h1 style={styles.mainHeading}>Welcome to SHG Registration</h1>
                <h3 style={styles.subHeading}>Empower your community by joining our Self-Help Group (SHG)</h3>

                {message && <p style={styles.successMessage}>{message}</p>}
                {error && <p style={styles.errorMessage}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <h2 style={styles.formHeading}>Register Below</h2>

                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={styles.formInput}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={styles.formInput}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={styles.formInput}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Registration Number</label>
                        <input
                            type="text"
                            name="registration_number"
                            value={formData.registration_number}
                            onChange={handleChange}
                            required
                            style={styles.formInput}
                        />
                    </div>

                    <button
                        type="submit"
                        style={styles.submitButton}
                        disabled={isSubmitting}
                        onMouseOver={(e) => e.target.style.backgroundColor = styles.submitButtonHover.backgroundColor}
                        onMouseOut={(e) => e.target.style.backgroundColor = styles.submitButton.backgroundColor}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ShgRegistration;
