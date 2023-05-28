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
import {useRef, useState} from "react";
import {Alert, AlertTitle, InputAdornment} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import axios from "axios";
import {useUserStore} from "../store";
import {useNavigate} from "react-router-dom";



function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            <Link color="inherit" href="/">
                Go Home
            </Link>{' '}
        </Typography>
    );
}

const theme = createTheme();

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const setUser = useUserStore(state => state.setUser);
    const navigate = useNavigate();
    const [imageExists, setImageExists] = useState(false);
    const ref = useRef<HTMLInputElement | null>(null);



    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        try {
            setErrorFlag(false);
            setErrorMessage("");
            const registerResult = await axios.post("https://seng365-reference-production.up.railway.app/api/v1/users/register", {
                "email": data.get('email'),
                "firstName": data.get('firstName'),
                "lastName": data.get('lastName'),
                "password": data.get('password'),
            });
            const {userId} = registerResult.data;

            const loginResult = await axios.post("https://seng365-reference-production.up.railway.app/api/v1/users/login", {
                "email": data.get('email'),
                "password": data.get('password'),
            });
            const userResult = await axios.get("https://seng365-reference-production.up.railway.app/api/v1/users/" + userId);

            const {data: userInfo} = userResult;
            const {token: authToken} = loginResult.data;
            const userImageConfig = {
                headers:{
                    'X-Authorization': authToken,
                    'Content-Type': selectedImage?.type
                }
            };
            if (selectedImage) {
                await axios.put("https://seng365-reference-production.up.railway.app/api/v1/users/" + userId + "/image", selectedImage, userImageConfig)
            }
            setUser({...userInfo, authToken, id:userId, email:data.get('email')});
            navigate("/films");
        } catch (error: any) {
            setErrorFlag(true);
            if (error.response.status == 400) {
                setErrorMessage("Password less than 6 characters, or email invalid.")
            }else if(error.response.status == 403) {
                setErrorMessage("Email already in use")
            } else {
                setErrorMessage(error.toString());
            }
        }
    }


    return (
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
                    <div>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <Avatar
                                sx={{
                                    m: 1,
                                    width: 150,
                                    height: 150,
                                    left: 5,
                                }}
                                src={
                                    selectedImage
                                        ? URL.createObjectURL(selectedImage)
                                        : undefined
                                }
                            />
                            <Button
                                sx={{
                                    position: 'center',
                                    bottom: 30,
                                    m: 1,
                                    fontSize: '0.7rem',
                                    padding: '4px 8px',
                                    minWidth: 'unset',
                                }}
                                variant="contained"
                                color="primary"
                                onClick={() => ref.current?.click()}
                            >
                                <input
                                    ref={ref}
                                    hidden
                                    accept=".jpg, .jpeg, .png, .gif"
                                    type="file"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            setSelectedImage(e.target.files[0]);
                                            setImageExists(true);
                                        }
                                    }}
                                />
                                Upload Profile Picture
                            </Button>
                        </div>
                        <div>
                            <Button
                                sx={{
                                    position: 'center',
                                    bottom: 30,
                                    m: 1,
                                    fontSize: '0.7rem',
                                    padding: '4px 8px',
                                    minWidth: 'unset',
                                }}
                                disabled={!imageExists}
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    setSelectedImage(null);
                                    setImageExists(false);
                                    if (ref.current) {
                                        ref.current.value = '';
                                    }
                                }}
                            >
                                Delete Image
                            </Button>
                        </div>
                    </div>

                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    {errorFlag && (
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {errorMessage}
                        </Alert>
                    )}
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address, must be valid"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password, min 6 characters"
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    autoComplete="new-password"
                                    InputProps={{

                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                                <Link href="/login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}
