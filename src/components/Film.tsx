import {Fragment, useEffect, useState} from "react";
import axios from "axios";
import {
    Alert,
    AlertTitle,
    Box,
    Card,
    CardContent,
    CardMedia,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import ResponsiveAppBar from "./NavBar";
import Avatar from "@mui/material/Avatar";
import FilmReviews from "./FilmReviews";
import SimilarFilms from "./SimilarFilms";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { styled } from '@mui/material/styles';
import {useUserStore} from "../store";
const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
        color: '#ff3d47',
    },
});

const Film = () => {
    const user = useUserStore(state => state.user)

    const [film, setFilm] = useState<FilmFull>();
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [genres, setGenres] = useState<Array<Genre>>([]);
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState<number | null>(null);
    const navigate = useNavigate();
    const {filmId} = useParams();
    const [userHasReviewed, setUserHasReviewed] = useState<boolean>(false);
    const [timestamp, setTimestamp] = useState(new Date())

    useEffect(() => {
        const getFilm = () => {
            axios.get("http://localhost:4941/api/v1/films/" + filmId)
                .then(
                    (response) => {
                        setErrorFlag(false);
                        setErrorMessage("");
                        setFilm(response.data);
                    },
                    (error) => {
                        setErrorFlag(true);
                        setErrorMessage(error.toString());
                        if (error.response.status === 404) {
                            navigate("/NotFound")
                        }
                    }
                );
        }

        const getGenres = () => {
            axios.get("http://localhost:4941/api/v1/films/genres")
                .then(
                    (response) => {
                        setErrorFlag(false);
                        setErrorMessage("");
                        setGenres(response.data);
                    },
                    (error) => {
                        setErrorFlag(true);
                        setErrorMessage(error.toString());
                    }
                );
        }
        const hasUserReviewed = async () => {
            try {
                const reviewsResponse = await axios.get("http://localhost:4941/api/v1/films/"+filmId + "/reviews");
                const reviews = reviewsResponse.data;
                if(reviews.some((review: any) => review.reviewerId === user?.id)) {
                    setUserHasReviewed(true)
                } else {
                    setUserHasReviewed(false)
                }
            } catch (error) {
                console.error('Error occurred while fetching reviews:', error);
            }
        };



        getFilm();
        getGenres();
        hasUserReviewed();
        setReviewText('');
        setRating(null);
    }, [filmId]);



    const handleReviewTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReviewText(event.target.value);
    };

    const handleRatingChange = (_: React.SyntheticEvent<Element, Event>, value: number | null) => {
        setRating(value);
    };



    const submitReview = async () => {
        if (rating !== null) {
            const reviewPostConfig = {
                headers: {
                    'X-Authorization': user?.authToken,
                }
            };

            await axios.post("http://localhost:4941/api/v1/films/" + filmId + '/reviews', {
                "rating": rating * 2,
                "review": reviewText
            }, reviewPostConfig);

            setReviewText(""); // Clear the review text field after submission
            setRating(null); // Clear the rating value after submission
            setTimestamp(new Date())
        }
    };
    return (
        <div style={{height: "100vh", width: "90%"}}>
            <Fragment>
                <ResponsiveAppBar/>
            </Fragment>
            <Paper elevation={1} sx={{height: "60%", overflow: "auto", display: "grid", gridTemplateColumns: "60% 40%", gridTemplateRows: "100%"}}>
                <Card sx={{overflow: 'auto'}}>
                    {errorFlag && (
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {errorMessage}
                        </Alert>
                    )}

                    <CardContent >
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <CardMedia
                                    component="img"
                                    height="auto"
                                    width="100%"
                                    sx={{objectFit: "cover", maxHeight: "20vh"}}
                                    image={"http://localhost:4941/api/v1/films/" + film?.filmId + "/image"}
                                    alt="Auction hero"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h4" align="center">
                                    {film?.title}
                                </Typography>
                                <Typography variant="caption" align="center">
                                    <List>
                                        <ListItem>
                                            <ListItemText primary={`${film?.description}`} sx={{textAlign: 'center'}}/>
                                        </ListItem>
                                    </List>
                                    <Divider/>
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <List>
                                    <Box sx={{boxShadow: 1, borderRadius: 4, mb: 2}}>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt={film?.directorFirstName}
                                                    src={"http://localhost:4941/api/v1/users/" + film?.directorId + "/image"}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText>
                                                Director: {film?.directorFirstName} {film?.directorLastName}
                                            </ListItemText>
                                        </ListItem>
                                    </Box>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Box sx={{boxShadow: 1, borderRadius: 4, mb: 1}}>
                                                <ListItem>
                                                    <Typography variant="body1" component="div" paragraph>
                                                        Genre<br/>
                                                        {
                                                            genres
                                                                .filter((genre) => genre.genreId === film?.genreId)
                                                                .map((genre) => genre.name)
                                                                .pop() || "Unknown Genre"
                                                        }
                                                    </Typography>
                                                </ListItem>
                                            </Box>
                                            <Box sx={{boxShadow: 1, borderRadius: 4, mb: 1}}>
                                                <ListItem>
                                                    <Typography variant="body1" component="div" paragraph>
                                                        Age Rating<br/>
                                                        {film?.ageRating}
                                                    </Typography>
                                                </ListItem>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{boxShadow: 1, borderRadius: 4, mb: 1}}>
                                                <ListItem>
                                                    <Typography variant="body1" component="div" paragraph>
                                                        Release Date<br/>
                                                        {film?.releaseDate ? new Date(film.releaseDate).toLocaleString() : ''}
                                                    </Typography>
                                                </ListItem>
                                            </Box>
                                            <Box sx={{boxShadow: 1, borderRadius: 4, mb: 1}}>
                                                <ListItem>
                                                    <Typography variant="body1" component="div" paragraph>
                                                        Rating<br/>
                                                        {film?.rating} / 10
                                                    </Typography>
                                                </ListItem>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </List>
                            </Grid>

                        </Grid>
                    </CardContent>

                </Card>

                <Card elevation={1} sx={{maxHeight: '100%'}}>
                    <Box sx={{height: "300px", overflow: "auto"}}>
                        <FilmReviews id={film?.filmId} timestamp={timestamp}/>
                    </Box>
                    {user ? (
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Add Review
                        </Typography>
                        <TextField
                            id="review-text"
                            label="Enter your review"
                            multiline
                            rows={3}
                            value={reviewText}
                            onChange={handleReviewTextChange}
                            fullWidth
                            disabled={user?.id === film?.directorId}
                        />
                        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-center" }}>
                            <StyledRating
                                name="customized-color"
                                defaultValue={2}
                                getLabelText={(value: number) => `${value} Heart${value !== 1 ? "s" : ""}`}
                                precision={0.5}
                                icon={<FavoriteIcon fontSize="inherit" />}
                                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                                value={rating}
                                onChange={handleRatingChange}
                                disabled={user?.id === film?.directorId}
                            />
                            <Typography variant="body1" sx={{ ml: 1 }}>
                                {rating ? rating*2 : null}
                            </Typography>
                        </Box>
                        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="caption">
                                *Cannot Review Own Film, Cannot Review film twice
                            </Typography>
                            <Button variant="contained" onClick={submitReview} disabled={userHasReviewed || user?.id === film?.directorId || rating === null }>
                                Submit
                            </Button>
                        </Box>

                    </Box>

                ) : (
                        <Box sx={{ p: 2 }}>
                            <Typography variant="body1" paragraph>
                                To submit a review, please Sign in or Register.
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                                <Button component={Link} to="/login" variant="contained" >
                                    Sign In
                                </Button>
                                <Button component={Link} to="/register" variant="contained"sx={{ ml: 2 }}>
                                    Register
                                </Button>

                            </Box>
                        </Box>
                )}
                </Card>
            </Paper>
            <Card sx={{gridColumn: "1 / span 2", width: '100%'}}>
                <Divider variant="inset"/>
                <SimilarFilms genreId={film?.genreId} directorId={film?.directorId} sourceFilmId={film?.filmId}/>
            </Card>
        </div>
    )
};

export default Film;
