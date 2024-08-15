import React from 'react';
import { Card, CardContent, Typography, Button } from  '@mui/material'



const handleReload = () => {
    location.assign('/');
};

const PendingUserScreen: React.FC = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        Access Pending
                    </Typography>
                    <Typography variant="body2" component="p" sx={{margin:2}}>
                        Your account has not yet been approved. If you feel that this is an error, please contact support.
                    </Typography>
                <Button style={{ float:"right",margin:10 }} variant="contained" color="primary" onClick={handleReload}>
                    Reload
                </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default PendingUserScreen;