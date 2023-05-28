import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import axios from "axios";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Button from "@mui/material/Button";
import InfoIcon from "@mui/icons-material/Info";


type Props = {
    userId: number | undefined
};



export default function UserReviews({ userId }: Props) {
    const [userReviewedFilms, setUserReviewedFilms] = useState<Array<Film>>([]);
    const [genres, setGenres] = useState<Array<Genre>>([]);


    useEffect(() => {
        const getUserReviewedFilms = async () => {
            const url = `https://seng365-reference-production.up.railway.app/api/v1/films/`;

            try {
                // Get all films
                const allFilmsResponse = await axios.get(url);
                const allFilms = allFilmsResponse.data.films;

                // Filter films based on user's reviews
                const userFilms = [];
                for (const film of allFilms) {
                    const reviewsResponse = await axios.get(`${url}${film.filmId}/reviews`);
                    const reviews = reviewsResponse.data;

                    if (reviews.some((review: review) => review.reviewerId === userId)) {
                        userFilms.push(film);
                    }
                }

                setUserReviewedFilms(userFilms);
            } catch (error) {
                console.error('Error occurred while fetching films:', error);
            }
        };
        const getGenres = () => {
            axios.get("https://seng365-reference-production.up.railway.app/api/v1/films/genres")
                .then(
                    (response) => {
                        setGenres(response.data);
                    },

                );
        }
        if (userId === undefined) {
            return;
        }
        getGenres()
        getUserReviewedFilms();
    }, [userId]);




    if(userReviewedFilms.length === 0) {
        return(
            <div>
                <h2>
                    Your Reviewed Films ({userReviewedFilms.length})
                </h2>
                You have not published any films
            </div>
        )
    }

    return (
        <List sx={{ width: '99%', maxHeight:'100%', bgcolor: 'background.paper', overflow:'auto'}}>
            <h2>Your Reviewed Films ({userReviewedFilms.length})</h2>
            {userReviewedFilms.map((film) => (
                <React.Fragment key={film.filmId}>

                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt={film.title} src={"https://seng365-reference-production.up.railway.app/api/v1/films/" + film.filmId + "/image"} variant="rounded"/>
                        </ListItemAvatar>
                        <ListItemText
                            primary={film.title}
                            secondary={
                                <React.Fragment>

                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span>{`${film.rating} / 10`}</span>
                                        <Button
                                            component={Link}
                                            to={`/films/${film.filmId}`}
                                            variant="outlined"
                                            color="primary"
                                            sx={{ marginLeft: 'auto' }}
                                        >
                                            <InfoIcon />
                                        </Button>
                                    </div>
                                    <Typography>
                                        {` 
                                        ${genres
                                            .filter((genre) => genre.genreId === film.genreId)
                                            .map((genre) => genre.name)
                                            .pop() || 'Unknown Genre'}, ${film.ageRating}`}
                                    </Typography>

                                    <Typography>
                                        {new Date(film.releaseDate).toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' })}
                                    </Typography>
                                    <ListItem sx={{ display: 'flex', alignItems: 'left'}}>
                                        <Avatar
                                            alt={film?.directorFirstName}
                                            src={"https://seng365-reference-production.up.railway.app/api/v1/users/" + film?.directorId + "/image"}
                                            sx={{width:'30px', height:'30px'}}
                                        />
                                        <ListItemText sx={{marginLeft:1}}>
                                            {film?.directorFirstName} {film?.directorLastName}
                                        </ListItemText>
                                    </ListItem>

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