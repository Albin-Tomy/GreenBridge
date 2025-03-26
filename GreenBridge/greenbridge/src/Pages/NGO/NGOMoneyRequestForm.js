import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
    Alert,
    CircularProgress,
    Card,
    CardContent
} from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';
import axios from 'axios';

const NGOMoneyRequestForm = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [ngoProfile, setNgoProfile] = useState(null);
    const [formData, setFormData] = useState({
        amount: '',
        purpose: '',
        description: '',
        necessity_certificate: null,
        project_proposal: null,
        budget_document: null,
        additional_documents: null
    });

    useEffect(() => {
        fetchNGOProfile();
    }, []);

    const fetchNGOProfile = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://127.0.0.1:8000/api/v1/ngo/profile/', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setNgoProfile(response.data);
            setError(''); // Clear any existing errors
            setLoading(false);
        } catch (error) {
            console.error('Profile fetch error:', error.response?.data || error);
            setError('Failed to fetch NGO profile.');
            setNgoProfile(null);
            setLoading(false);
        }
    };

    const validateForm = () => {
        // Check required basic fields
        if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
            setError('Please enter a valid amount greater than 0');
            return false;
        }
        
        // Check amount limits
        const amount = parseFloat(formData.amount);
        if (amount < 1000) {
            setError('Minimum request amount is ₹1,000');
            return false;
        }
        if (amount > 1000000) {
            setError('Maximum request amount is ₹10,00,000 (10 Lakhs)');
            return false;
        }
        
        if (!formData.purpose || !formData.purpose.trim()) {
            setError('Please select a valid purpose');
            return false;
        }
        if (!formData.description || !formData.description.trim()) {
            setError('Please provide a detailed description');
            return false;
        }

        // Check required documents
        if (!formData.necessity_certificate) {
            setError('Please upload the Necessity Certificate (Required)');
            return false;
        }
        if (!formData.budget_document) {
            setError('Please upload the Budget Document (Required)');
            return false;
        }

        return true;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        if (!validateForm()) {
            setSubmitting(false);
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const formDataToSend = new FormData();
            
            // Append basic fields with proper type conversion and validation
            const amount = parseFloat(formData.amount);
            // Validate amount limits
            if (amount < 1000) {
                setError('Minimum request amount is ₹1,000');
                return;
            }
            if (amount > 1000000) {
                setError('Maximum request amount is ₹10,00,000 (10 Lakhs)');
                return;
            }
            
            formDataToSend.append('amount', amount.toString());
            
            if (!formData.purpose || !formData.purpose.trim()) {
                setError('Please select a valid purpose');
                return;
            }
            formDataToSend.append('purpose', formData.purpose.trim());
            
            if (!formData.description || !formData.description.trim()) {
                setError('Please provide a detailed description');
                return;
            }
            formDataToSend.append('description', formData.description.trim());

            // Validate and append required documents
            if (!(formData.necessity_certificate instanceof File)) {
                setError('Please upload the Necessity Certificate (Required)');
                return;
            }
            formDataToSend.append('necessity_certificate', formData.necessity_certificate);

            if (!(formData.budget_document instanceof File)) {
                setError('Please upload the Budget Document (Required)');
                return;
            }
            formDataToSend.append('budget_document', formData.budget_document);

            // Append optional documents only if they exist and are valid files
            if (formData.project_proposal instanceof File) {
                formDataToSend.append('project_proposal', formData.project_proposal);
            }
            if (formData.additional_documents instanceof File) {
                formDataToSend.append('additional_documents', formData.additional_documents);
            }

            // Use the correct API endpoint for NGO money requests
            const response = await axios.post(
                'http://127.0.0.1:8000/api/v1/donations/ngo/money-request/create/',
                formDataToSend,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.status === 201) {
                setSuccess('Money request submitted successfully! Your request is now pending approval.');
                // Reset form data
                setFormData({
                    amount: '',
                    purpose: '',
                    description: '',
                    necessity_certificate: null,
                    project_proposal: null,
                    budget_document: null,
                    additional_documents: null
                });
                
                // Reset file input elements
                document.getElementById('necessity-certificate-upload').value = '';
                document.getElementById('budget-document-upload').value = '';
                document.getElementById('project-proposal-upload').value = '';
                document.getElementById('additional-documents-upload').value = '';
            }
        } catch (error) {
            console.error('Submission error:', error);
            
            // Handle different types of error responses
            if (error.response?.data) {
                const errorData = error.response.data;
                if (typeof errorData === 'string') {
                    setError(errorData);
                } else if (typeof errorData === 'object') {
                    // Handle non_field_errors specially
                    if (errorData.non_field_errors) {
                        setError(Array.isArray(errorData.non_field_errors) 
                            ? errorData.non_field_errors.join(', ')
                            : errorData.non_field_errors);
                        return;
                    }
                    
                    // Handle other field errors
                    const errorMessages = [];
                    for (const [field, message] of Object.entries(errorData)) {
                        if (Array.isArray(message)) {
                            errorMessages.push(`${field}: ${message.join(', ')}`);
                        } else if (typeof message === 'string') {
                            errorMessages.push(`${field}: ${message}`);
                        }
                    }
                    setError(errorMessages.join('\n'));
                }
            } else {
                setError('Failed to submit money request. Please try again later.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 4, mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Submit Money Request
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                {!ngoProfile?.bank_account_number && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Please complete your NGO profile with bank details before submitting a money request.
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Amount (₹)"
                                name="amount"
                                type="number"
                                value={formData.amount}
                                onChange={handleInputChange}
                                required
                                inputProps={{ 
                                    min: 1000, 
                                    max: 1000000
                                }}
                                helperText="Amount must be between ₹1,000 and ₹10,00,000 (10 Lakhs)"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                label="Purpose"
                                name="purpose"
                                value={formData.purpose}
                                onChange={handleInputChange}
                                required
                            >
                                <MenuItem value="operational_costs">Operational Costs</MenuItem>
                                <MenuItem value="emergency_relief">Emergency Relief</MenuItem>
                                <MenuItem value="project_funding">Project Funding</MenuItem>
                                <MenuItem value="infrastructure">Infrastructure Development</MenuItem>
                                <MenuItem value="education_program">Education Program</MenuItem>
                                <MenuItem value="healthcare_program">Healthcare Program</MenuItem>
                                <MenuItem value="food_distribution">Food Distribution Program</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Bank Details (Auto-filled from Profile)
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Account Holder Name"
                                                value={ngoProfile?.bank_account_name || ''}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Account Number"
                                                value={ngoProfile?.bank_account_number || ''}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Bank Name"
                                                value={ngoProfile?.bank_name || ''}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Branch Name"
                                                value={ngoProfile?.bank_branch || ''}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="IFSC Code"
                                                value={ngoProfile?.ifsc_code || ''}
                                                disabled
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Required Documents
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box sx={{ border: '1px dashed grey', p: 3, borderRadius: 1 }}>
                                        <input
                                            accept="application/pdf"
                                            style={{ display: 'none' }}
                                            id="necessity-certificate-upload"
                                            name="necessity_certificate"
                                            type="file"
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor="necessity-certificate-upload">
                                            <Button
                                                variant="outlined"
                                                component="span"
                                                startIcon={<UploadIcon />}
                                                fullWidth
                                                color={formData.necessity_certificate ? "success" : "primary"}
                                            >
                                                Upload Necessity Certificate (Required)
                                            </Button>
                                        </label>
                                        {formData.necessity_certificate && (
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                Selected: {formData.necessity_certificate.name}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ border: '1px dashed grey', p: 3, borderRadius: 1 }}>
                                        <input
                                            accept="application/pdf"
                                            style={{ display: 'none' }}
                                            id="budget-document-upload"
                                            name="budget_document"
                                            type="file"
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor="budget-document-upload">
                                            <Button
                                                variant="outlined"
                                                component="span"
                                                startIcon={<UploadIcon />}
                                                fullWidth
                                                color={formData.budget_document ? "success" : "primary"}
                                            >
                                                Upload Budget Document (Required)
                                            </Button>
                                        </label>
                                        {formData.budget_document && (
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                Selected: {formData.budget_document.name}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ border: '1px dashed grey', p: 3, borderRadius: 1 }}>
                                        <input
                                            accept="application/pdf"
                                            style={{ display: 'none' }}
                                            id="project-proposal-upload"
                                            name="project_proposal"
                                            type="file"
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor="project-proposal-upload">
                                            <Button
                                                variant="outlined"
                                                component="span"
                                                startIcon={<UploadIcon />}
                                                fullWidth
                                                color={formData.project_proposal ? "success" : "primary"}
                                            >
                                                Upload Project Proposal (Optional)
                                            </Button>
                                        </label>
                                        {formData.project_proposal && (
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                Selected: {formData.project_proposal.name}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ border: '1px dashed grey', p: 3, borderRadius: 1 }}>
                                        <input
                                            accept="application/pdf"
                                            style={{ display: 'none' }}
                                            id="additional-documents-upload"
                                            name="additional_documents"
                                            type="file"
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor="additional-documents-upload">
                                            <Button
                                                variant="outlined"
                                                component="span"
                                                startIcon={<UploadIcon />}
                                                fullWidth
                                                color={formData.additional_documents ? "success" : "primary"}
                                            >
                                                Upload Additional Documents (Optional)
                                            </Button>
                                        </label>
                                        {formData.additional_documents && (
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                Selected: {formData.additional_documents.name}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                disabled={!ngoProfile?.bank_account_number || submitting}
                            >
                                {submitting ? (
                                    <>
                                        <CircularProgress size={24} sx={{ mr: 1 }} />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Request'
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default NGOMoneyRequestForm; 