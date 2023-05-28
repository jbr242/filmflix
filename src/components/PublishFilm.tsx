import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useMemo, useRef, useState} from "react";
import {Alert, AlertTitle} from "@mui/material";
import axios from "axios";
import CancelIcon from '@mui/icons-material/Cancel';
import {useNavigate} from "react-router-dom";
import PublishGenre from "./PublishGenre";
import PublishAgeRating from "./PublishAgeRating";
import {useUserStore} from "../store";
import NavBar from "./NavBar";



const theme = createTheme();
export default function PublishFilm() {
    const ref = useRef<HTMLInputElement | null>(null);
    const user = useUserStore(state => state.user);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const imageUrl = useMemo(() => selectedImage ? URL.createObjectURL(selectedImage) : null, [selectedImage])
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const now = new Date();




    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const movieRegisterConfig = {
            headers:{
                'X-Authorization': user?.authToken,
            }
        };
        const movieImageConfig = {
            headers:{
                'X-Authorization': user?.authToken,
                'Content-Type': selectedImage?.type
            }
        };
        const data = new FormData(event.currentTarget);
        const releaseDate = new Date(new Date(data.get('releaseDate') as string).getTime() + 13 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0,19);
        if(selectedImage?.type == 'image/png' || selectedImage?.type == 'image.jpg' || selectedImage?.type == 'image/jpeg' || selectedImage?.type == 'image/gif')
        {

            try {
                setErrorFlag(false);
                setErrorMessage("");

                const registerResult = await axios.post("http://localhost:4941/api/v1/films", {
                    "title": data.get('title'),
                    "description": data.get('description'),
                    "releaseDate": releaseDate,
                    "genreId": parseInt(data.get('genreId') as string),
                    "runtime": data.get('runtime') ? parseInt(data.get('runtime') as string) : undefined,
                    "ageRating": data.get('ageRating') ? data.get('ageRating'): undefined,
                }, movieRegisterConfig);
                const {filmId} = registerResult.data;
                if (selectedImage) {
                    await axios.put("http://localhost:4941/api/v1/films/" + filmId + "/image", selectedImage, movieImageConfig)
                }
                navigate("/films/" + filmId);
            } catch (error: any) {
                setErrorFlag(true);
                if (error.response.status == 400) {
                    setErrorMessage("Invalid information")
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
        <div style={{width:'1280px',maxWidth:'90vw', height:'100vh'}}>
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
                    <Avatar sx={{ m: 1, bgcolor: 'success.main' }}>
                        <LockPersonOutlinedIcon />
                    </Avatar>

                    <Typography component="h1" variant="h5">
                        Publish Film
                    </Typography>
                    {errorFlag && (
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {errorMessage}
                        </Alert>
                    )}
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="title"
                                    required
                                    fullWidth
                                    id="title"
                                    label="Film Title"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="description"
                                    label="Description"
                                    name="description"
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                            <Grid item xs={12} sm ={6}>
                                <PublishGenre />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <PublishAgeRating />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="releaseDate"
                                    label="Release Date"
                                    name="releaseDate"
                                    type="datetime-local"
                                    sx={{ width: '100%' }}
                                    defaultValue={new Date(now.getTime() + 13 * 60 * 60 * 1000).toISOString().slice(0,19)}
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
                                    Upload Film Image *
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
                            disabled={!selectedImage}
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Submit Film
                        </Button>
                        <Link href="/films" variant="body2">
                            Go Back
                        </Link>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
        </div>
    );
}
