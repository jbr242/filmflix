import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useEffect, useMemo, useRef, useState} from "react";
import {Alert, AlertTitle} from "@mui/material";
import axios from "axios";
import CancelIcon from '@mui/icons-material/Cancel';
import {useNavigate, useParams} from "react-router-dom";
import PublishGenre from "./PublishGenre";
import PublishAgeRating from "./PublishAgeRating";
import {useUserStore} from "../store";
import NavBar from "./NavBar";



const theme = createTheme();
export default function EditFilm() {
    const ref = useRef<HTMLInputElement | null>(null);
    const user = useUserStore(state => state.user);
    const [film, setFilm] = useState<FilmFull>();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const imageUrl = useMemo(() => selectedImage ? URL.createObjectURL(selectedImage) : null, [selectedImage])
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const now = new Date();
    const {filmId} = useParams();

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
                        if(error.response.status == 404) {
                            navigate("/NotFound")
                        }
                    }
                );
        }


        getFilm();
    }, [filmId]);


    useEffect(() => {
        if(film?.directorId === undefined) {
            return
        }
        if(user?.id !== film?.directorId) {
            navigate('/films/' + filmId)
        }
    }, [film?.directorId]);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const moviePatchConfig = {
            headers: {
                'X-Authorization': user?.authToken,
            }
        };
        const movieImageConfig = {
            headers: {
                'X-Authorization': user?.authToken,
                'Content-Type': selectedImage?.type
            }
        };
        const data = new FormData(event.currentTarget);
        const releaseDate = film?.releaseDate !== data.get('releaseDate') ? new Date(new Date(data.get('releaseDate') as string).getTime() + 13 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19) : undefined;
        if (selectedImage?.type == 'image/png' || selectedImage?.type == 'image.jpg' || selectedImage?.type == 'image/jpeg' || selectedImage?.type == 'image/gif' || !selectedImage)
        {
            try {
                console.log(data.get('ageRating'));
                setErrorFlag(false);
                setErrorMessage("");
                await axios.patch("http://localhost:4941/api/v1/films/" + film?.filmId, {
                    title: data.get('title') !== film?.title ? data.get('title') : undefined,
                    description: data.get('description') !== film?.description ? data.get('description') : undefined,
                    releaseDate: releaseDate && new Date(releaseDate) > new Date() ? releaseDate : undefined,
                    genreId: data.get('genreId') && parseInt(data.get('genreId') as string) !== film?.genreId ? parseInt(data.get('genreId') as string) : undefined,
                    runtime: data.get('runtime') && parseInt(data.get('runtime') as string) !== film?.runtime ? parseInt(data.get('runtime') as string) : undefined,
                    ageRating: data.get('ageRating') !== '' ? (data.get('ageRating') !== film?.ageRating ? data.get('ageRating') : undefined) : 'TBC'
                }, moviePatchConfig);
                if (selectedImage) {
                    await axios.put("http://localhost:4941/api/v1/films/" + film?.filmId + "/image", selectedImage, movieImageConfig)
                }
                navigate("/films/" + film?.filmId);
            } catch (error: any) {
                setErrorFlag(true);
                if (error.response.status == 400) {
                    setErrorMessage("Bad Request. Invalid Information")
                } else if (error.response.status == 403) {
                    setErrorMessage("\t\n" +
                        "\n" +
                        "Forbidden. Only the director of an film may change it, cannot change the releaseDate since it has already passed, cannot edit a film that has a review placed, or cannot release a film in the past")
                } else {
                    setErrorMessage(error.toString());
                }
            }
        } else {
            setErrorFlag(true);
            setErrorMessage('Invalid Filetype');
        }
    }


    return (
        <div style={{width:'52vw', height:'100vh'}}>
            <NavBar/>
            <ThemeProvider theme={theme}>


                <Container component="main" maxWidth="xs">

                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'success.main',width:'60%', height:'10%'  }} alt={film?.title} src={"http://localhost:4941/api/v1/films/" + film?.filmId + "/image"} variant="rounded">
                        </Avatar>

                        <Typography component="h1" variant="h5">
                            {film && film.numReviews > 0 ? "Unable to edit a film that has been reviewed" : "Edit Film:"}
                        </Typography>
                        {errorFlag && (
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                {errorMessage}
                            </Alert>
                        )}
                        {film && (<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <div className={film.numReviews > 0 ? "disabled-form" : ""}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                        <TextField
                                            name="title"
                                            fullWidth
                                            id="title"
                                            label="Film Title"
                                            autoFocus
                                            defaultValue={film.title}
                                        />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="description"
                                        label="Description"
                                        name="description"
                                        multiline
                                        defaultValue={film.description}
                                        rows={4}
                                    />
                                </Grid>
                                <Grid item xs={12} sm ={6}>
                                    <PublishGenre defaultValue={film.genreId}/>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <PublishAgeRating defaultValue={film.ageRating}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="releaseDate"
                                        label="Release Date"
                                        name="releaseDate"
                                        type="datetime-local"
                                        disabled={new Date(film.releaseDate) < now}
                                        sx={{ width: '100%' }}
                                        defaultValue={film.releaseDate ? new Date(film.releaseDate).toISOString().slice(0, 16) : ''}
                                        inputProps={{ min: new Date(now.getTime() + 13 * 60 * 60 * 1000).toISOString().slice(0,19)}}
                                    />

                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="runtime"
                                        label="Runtime (minutes)"
                                        name="runtime"
                                        type="number"
                                        fullWidth
                                        defaultValue={film.runtime}
                                        sx={{ width: '100%', marginBottom: '20px' }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    {imageUrl && selectedImage && (
                                        <Box mt={1} textAlign="center" position="relative">
                                            <h2>Film Image Preview:</h2>
                                            <Button style={{ position: "absolute", top: 20, right: 85 }} onClick={()=>{
                                                setSelectedImage(null);
                                                if (ref.current) {
                                                    ref.current.value = '';
                                                }
                                            }}>
                                                <CancelIcon />
                                            </Button>
                                            <img src={imageUrl} alt="Current Film Image:" height="100px" />
                                        </Box>

                                    )}
                                    <Button variant="outlined" component="label" onClick={() => ref.current?.click()}>
                                        Upload New Film Image
                                    </Button>
                                    <input ref={ref} hidden accept=".jpg, .jpeg, .png, .gif" type="file" onChange={e => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            setSelectedImage(e.target.files[0]);
                                        }}}/>

                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Submit Film
                            </Button>
                            <Link href="/films" variant="body2">
                                Go Back
                            </Link>
                            </div>
                        </Box> )}
                    </Box>
                </Container>
            </ThemeProvider>
        </div>
    );
}
