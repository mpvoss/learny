import { Card, CardContent, Link, Typography} from '@mui/material';
import React, { useState } from 'react';
import { Note } from '../models';

const cardStyle = {
    backgroundColor: '#00000', // light gray
    border: '1px solid #DDD', // light border
    boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)', // shadow for 3D effect
    borderRadius: '15px', // rounded corners
    padding: '20px',
    margin: '10px',
};

const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
};

const contentStyle = {
    fontSize: '16px',
};

const NoteCard: React.FC<Note> = ({ title, content }) => {
    const [showMore, setShowMore] = useState(false);

    const handleShowMore = () => {
        setShowMore(true);
    };

    return (
        <Card style={cardStyle}>
            <CardContent>
                <Typography style={titleStyle} variant="h4" component="h4" textAlign="left">
                    {title}
                </Typography>
                <Typography style={contentStyle} variant="body2" color="textSecondary" textAlign="left">
                    {showMore ? content : `${content.slice(0, 100)}...`}
                    {!showMore && (
                        <><br></br><Link component="button" onClick={handleShowMore}>
                            Show more
                        </Link></>
                    )}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default NoteCard;