import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Checkbox,
    FormControlLabel
} from '@mui/material';

const LegalConsentForm = ({ open, onClose, onAgree }) => {
    const [checked, setChecked] = React.useState(false);

    const handleAgree = () => {
        if (checked) {
            onAgree();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Legal Disclaimer and Consent
            </DialogTitle>
            <DialogContent>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Food Safety and Liability:
                    </Typography>
                    <Typography paragraph>
                        • The donor confirms that the food being donated is safe for consumption, has been stored and handled properly, and complies with all applicable food safety laws and regulations.
                    </Typography>
                    <Typography paragraph>
                        • The donor understands that the receiving organization is not responsible for verifying the safety or quality of the donated food.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Release of Liability:
                    </Typography>
                    <Typography paragraph>
                        • The donor releases the receiving organization, its employees, volunteers, and affiliates from any liability, claims, or damages that may arise from the redistribution or consumption of the donated food.
                    </Typography>
                    <Typography paragraph>
                        • The donor agrees that the receiving organization is not liable for any illness, injury, or other harm that may result from the consumption of the donated food.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Indemnification:
                    </Typography>
                    <Typography paragraph>
                        • The donor agrees to indemnify and hold harmless the receiving organization from any claims, lawsuits, or damages arising from the donation, including but not limited to issues related to food safety, quality, or handling.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Good Faith Donation:
                    </Typography>
                    <Typography paragraph>
                        • The donor confirms that the food is donated in good faith and is intended to help those in need. The donor understands that the receiving organization will redistribute the food to individuals or groups without any guarantee or warranty.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Compliance with Laws:
                    </Typography>
                    <Typography paragraph>
                        • The donor confirms that the donation complies with all local, state, and federal laws, including but not limited to the Bill Emerson Good Samaritan Food Donation Act (in the U.S.), which protects donors from liability when donating food in good faith.
                    </Typography>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={checked}
                                onChange={(e) => setChecked(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="I have read and agree to the terms and conditions"
                        sx={{ mt: 2 }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={!checked}
                    onClick={handleAgree}
                >
                    Agree & Continue
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LegalConsentForm; 