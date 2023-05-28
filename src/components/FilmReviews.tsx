import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import axios from "axios";
import {useEffect, useState} from "react";

type Props = {
    id: number | undefined;
    timestamp: Date
};

export default function FilmReviews({ id, timestamp }: Props) {
    const [reviews, setReviews] = useState<Array<review>>([]);



    useEffect(() => {
        const getFilmReviews = async () => {
            const reviews = await axios.get("http://localhost:4941/api/v1/films/" + id + "/reviews")
            setReviews(reviews.data)
        }
        if (id === undefined) return;
        getFilmReviews();
    }, [id, timestamp]);

    if(reviews.length === 0 || id === undefined) {
        return(
            <div>
                <h2>
                    Reviews ({reviews.length})
                </h2>
                There are currently no reviews
            </div>
        )
    }

    return (
        <List sx={{ width: '90%', maxHeight:'100%', bgcolor: 'background.paper'}}>
            <h2>Reviews ({reviews.length})</h2>
            {reviews.map((review) => (
                <React.Fragment key={review.reviewerId}>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt={review.reviewerFirstName} src={"http://localhost:4941/api/v1/users/" + review.reviewerId + "/image"} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={review.review}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {review.reviewerFirstName} {review.reviewerLastName}
                                    </Typography>
                                    {` — ${review.rating} / 10`}
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                </React.Fragment>
            ))}
        </List>
    );
}