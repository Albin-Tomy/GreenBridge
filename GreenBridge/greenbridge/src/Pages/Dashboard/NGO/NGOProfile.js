import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Divider,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Upload as UploadIcon } from '@mui/icons-material';
import axios from 'axios';

const NGOProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState(null);
    const [documents, setDocuments] = useState({
        registration_certificate: null,
        tax_exemption_certificate: null,
        annual_report: null
    });

    useEffect(() => {
        fetchNGOProfile();
    }, []);

    const createInitialProfile = async (registrationData) => {
        try {
            const token = localStorage.getItem('authToken');
            const initialProfile = {
                description: '',
                contact_person: registrationData.name || '',  // Use registration name as default
                contact_phone: '',
                address: '',
                website: '',
                bank_account_name: '',
                bank_account_number: '',
                bank_name: '',
                bank_branch: '',
                ifsc_code: ''
            };

            const response = await axios.post(
                'http://127.0.0.1:8000/api/v1/ngo/profile/create/',
                initialProfile,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setProfile(response.data);
            setEditedProfile(response.data);
            setIsEditing(true);
            setSuccess('Profile created successfully. Please complete your profile details.');
        } catch (error) {
            console.error('Error creating initial profile:', error);
            setError(error.response?.data?.error || 'Failed to create initial profile');
        }
    };

    const fetchRegistrationDetails = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://127.0.0.1:8000/api/v1/ngo/registration/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching registration details:', error);
            throw error;
        }
    };

    const fetchNGOProfile = async () => {
        try {
            const token = localStorage.getItem('authToken');
            try {
                // First try to fetch existing profile
                const profileResponse = await axios.get('http://127.0.0.1:8000/api/v1/ngo/profile/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(profileResponse.data);
                setEditedProfile(profileResponse.data);
            } catch (profileError) {
                if (profileError.response && profileError.response.status === 404) {
                    // Profile doesn't exist, create a new one
                    const response = await axios.post(
                        'http://127.0.0.1:8000/api/v1/ngo/profile/create/',
                        {},
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );
                    setProfile(response.data);
                    setEditedProfile(response.data);
                    setIsEditing(true); // Enable editing mode for new profile
                    setSuccess('Please complete your profile information.');
                } else {
                    throw profileError;
                }
            }
            setLoading(false);
        } catch (error) {
            console.error('Error in profile flow:', error);
            setError('Failed to initialize profile');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let updatedValue = value;

        // Special handling for website field
        if (name === 'website' && value && !value.startsWith('http://') && !value.startsWith('https://')) {
            updatedValue = `https://${value}`;
        }

        // Special handling for contact_phone field
        if (name === 'contact_phone' && value) {
            // Only allow digits
            updatedValue = value.replace(/\D/g, '');
            // Limit length to 15 digits
            updatedValue = updatedValue.slice(0, 15);
        }

        // Special handling for bank_account_number field
        if (name === 'bank_account_number' && value) {
            // Only allow digits
            updatedValue = value.replace(/\D/g, '');
            // Limit length to 20 digits
            updatedValue = updatedValue.slice(0, 20);
        }

        // Special handling for IFSC code
        if (name === 'ifsc_code' && value) {
            // Convert to uppercase and limit to 11 characters
            updatedValue = value.toUpperCase().slice(0, 11);
        }

        setEditedProfile(prev => ({
            ...prev,
            [name]: updatedValue
        }));
    };

    const handleDocumentUpload = async (type) => {
        if (!documents[type]) {
            setError('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append(type, documents[type]);

        try {
            const token = localStorage.getItem('authToken');
            await axios.post(
                `http://127.0.0.1:8000/api/v1/ngo/upload-document/${type}/`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            setSuccess(`${type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} uploaded successfully`);
            setDocuments(prev => ({
                ...prev,
                [type]: null
            }));
            fetchNGOProfile();
        } catch (error) {
            console.error('Error uploading document:', error);
            setError(error.response?.data?.error || 'Failed to upload document');
        }
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('authToken');
            
            // Validate and format data before sending
            const profileUpdateData = {};
            
            // Only include non-empty fields
            if (editedProfile.description) profileUpdateData.description = editedProfile.description;
            if (editedProfile.contact_person) profileUpdateData.contact_person = editedProfile.contact_person;
            if (editedProfile.contact_phone) {
                // Ensure phone number is only digits
                const phone = editedProfile.contact_phone.replace(/\D/g, '');
                if (phone.length < 10 || phone.length > 15) {
                    setError('Contact phone should be between 10 and 15 digits');
                    return;
                }
                profileUpdateData.contact_phone = phone;
            }
            if (editedProfile.address) profileUpdateData.address = editedProfile.address;
            if (editedProfile.website) {
                let website = editedProfile.website;
                if (!website.startsWith('http://') && !website.startsWith('https://')) {
                    website = 'https://' + website;
                }
                profileUpdateData.website = website;
            }

            // Handle bank details - if any bank field is provided, all become required
            const bankFields = ['bank_account_name', 'bank_account_number', 'bank_name', 'bank_branch', 'ifsc_code'];
            const providedBankFields = bankFields.filter(field => editedProfile[field]);
            
            if (providedBankFields.length > 0) {
                const missingFields = bankFields.filter(field => !editedProfile[field]);
                if (missingFields.length > 0) {
                    setError(`Please provide all bank details. Missing: ${missingFields.join(', ')}`);
                    return;
                }

                // Validate IFSC code format
                const ifsc = editedProfile.ifsc_code.toUpperCase();
                if (!/^[A-Z]{4}\d{7}$/.test(ifsc)) {
                    setError('Invalid IFSC code format. It should be 11 characters: first 4 alphabets followed by 7 numbers');
                    return;
                }

                // Validate account number
                const accNum = editedProfile.bank_account_number.replace(/\D/g, '');
                if (accNum.length < 8 || accNum.length > 20) {
                    setError('Account number should be between 8 and 20 digits');
                    return;
                }

                // Add validated bank details to update data
                bankFields.forEach(field => {
                    profileUpdateData[field] = field === 'ifsc_code' ? ifsc : 
                                             field === 'bank_account_number' ? accNum : 
                                             editedProfile[field];
                });
            }

            const response = await axios.put(
                'http://127.0.0.1:8000/api/v1/ngo/profile/update/',
                profileUpdateData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                setProfile(response.data);
                setEditedProfile(response.data);
                setIsEditing(false);
                setSuccess('Profile updated successfully');
                setError(''); // Clear any existing errors
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            const errorMessage = error.response?.data?.error || 
                               error.response?.data?.details || 
                               error.response?.data?.bank_details ||
                               'Failed to update profile';
            setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!profile) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Alert severity="error">Failed to load NGO profile. Please try again later.</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100%', overflow: 'auto' }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                        {success}
                    </Alert>
                )}

                <Paper sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h4">NGO Profile</Typography>
                        <IconButton onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
                            {isEditing ? <SaveIcon /> : <EditIcon />}
                        </IconButton>
                    </Box>

                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Basic Information</Typography>
                                    {/* Read-only registration details */}
                                    <TextField
                                        fullWidth
                                        label="NGO Name"
                                        value={profile?.ngo_name || ''}
                                        disabled
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Registration Number"
                                        value={profile?.registration_number || ''}
                                        disabled
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Registration Status"
                                        value={profile?.registration_status || ''}
                                        disabled
                                        margin="normal"
                                    />
                                    {/* Editable fields */}
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        name="description"
                                        value={isEditing ? editedProfile?.description || '' : profile?.description || ''}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        margin="normal"
                                        multiline
                                        rows={4}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Contact Person"
                                        name="contact_person"
                                        value={isEditing ? editedProfile?.contact_person || '' : profile?.contact_person || ''}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        margin="normal"
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        label="Contact Phone"
                                        name="contact_phone"
                                        value={isEditing ? editedProfile?.contact_phone || '' : profile?.contact_phone || ''}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        margin="normal"
                                        required
                                        inputProps={{ maxLength: 20 }}
                                        helperText="Enter a valid phone number"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Address"
                                        name="address"
                                        value={isEditing ? editedProfile?.address || '' : profile?.address || ''}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        margin="normal"
                                        multiline
                                        rows={3}
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        label="Website"
                                        name="website"
                                        value={isEditing ? editedProfile?.website || '' : profile?.website || ''}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        margin="normal"
                                        helperText="Include http:// or https://"
                                    />
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Bank Details</Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            All bank details are required if you want to receive donations
                                        </Typography>
                                    </Box>
                                    <TextField
                                        fullWidth
                                        label="Account Holder Name"
                                        name="bank_account_name"
                                        value={isEditing ? editedProfile?.bank_account_name || '' : profile?.bank_account_name || ''}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Account Number"
                                        name="bank_account_number"
                                        value={isEditing ? editedProfile?.bank_account_number || '' : profile?.bank_account_number || ''}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        margin="normal"
                                        helperText="Enter 8-20 digits"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Bank Name"
                                        name="bank_name"
                                        value={isEditing ? editedProfile?.bank_name || '' : profile?.bank_name || ''}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Branch Name"
                                        name="bank_branch"
                                        value={isEditing ? editedProfile?.bank_branch || '' : profile?.bank_branch || ''}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="IFSC Code"
                                        name="ifsc_code"
                                        value={isEditing ? editedProfile?.ifsc_code || '' : profile?.ifsc_code || ''}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        margin="normal"
                                        helperText="Format: ABCD0123456 (4 letters followed by 7 numbers)"
                                    />
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6">Required Documents</Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => fetchNGOProfile()}
                                            disabled={!isEditing}
                                        >
                                            Refresh Documents
                                        </Button>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Please upload the following documents in PDF format
                                    </Typography>
                                    <List>
                                        {[
                                            {
                                                key: 'registration_certificate',
                                                label: 'Registration Certificate',
                                                required: true
                                            },
                                            {
                                                key: 'tax_exemption_certificate',
                                                label: 'Tax Exemption Certificate',
                                                required: true
                                            },
                                            {
                                                key: 'annual_report',
                                                label: 'Annual Report',
                                                required: true
                                            }
                                        ].map((doc) => (
                                            <ListItem key={doc.key}>
                                                <ListItemText 
                                                    primary={
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            {doc.label}
                                                            {doc.required && (
                                                                <Typography 
                                                                    component="span" 
                                                                    color="error" 
                                                                    sx={{ ml: 1 }}
                                                                >
                                                                    *
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <>
                                                            {profile[doc.key] ? (
                                                                <Typography component="span" color="success.main">
                                                                    Uploaded
                                                                </Typography>
                                                            ) : (
                                                                <Typography component="span" color="error.main">
                                                                    Not uploaded
                                                                </Typography>
                                                            )}
                                                            {documents[doc.key] && (
                                                                <Typography component="span" color="info.main" sx={{ ml: 2 }}>
                                                                    New file selected
                                                                </Typography>
                                                            )}
                                                        </>
                                                    }
                                                />
                                                <ListItemSecondaryAction sx={{ display: 'flex', gap: 1 }}>
                                                    <input
                                                        accept="application/pdf"
                                                        style={{ display: 'none' }}
                                                        id={`upload-${doc.key}`}
                                                        type="file"
                                                        onChange={(e) => {
                                                            if (e.target.files?.[0]) {
                                                                setDocuments(prev => ({
                                                                    ...prev,
                                                                    [doc.key]: e.target.files[0]
                                                                }));
                                                                setError('');
                                                            }
                                                        }}
                                                    />
                                                    <label htmlFor={`upload-${doc.key}`}>
                                                        <Button
                                                            variant="outlined"
                                                            component="span"
                                                            startIcon={<UploadIcon />}
                                                            disabled={!isEditing}
                                                        >
                                                            Select File
                                                        </Button>
                                                    </label>
                                                    {documents[doc.key] && (
                                                        <Button
                                                            variant="contained"
                                                            onClick={() => handleDocumentUpload(doc.key)}
                                                            color="primary"
                                                        >
                                                            Upload
                                                        </Button>
                                                    )}
                                                    {profile[doc.key] && (
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            href={profile[doc.key]}
                                                            target="_blank"
                                                        >
                                                            View
                                                        </Button>
                                                    )}
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default NGOProfile; 