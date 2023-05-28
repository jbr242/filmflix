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
import {useEffect, useRef, useState} from "react";
import {Alert, AlertTitle, InputAdornment} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import axios from "axios";
import {useUserStore} from "../store";
import {useNavigate} from "react-router-dom";



function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            <Link color="inherit" href="/profile">
                Back To Profile
            </Link>{' '}
        </Typography>
    );
}

const theme = createTheme();

export default function EditUser() {
    const ref = useRef<HTMLInputElement | null>(null);

    const user = useUserStore(state => state.user)
    const [showPassword, setShowPassword] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [removeImage, setRemoveImage] = useState<boolean>(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const setUser = useUserStore(state => state.setUser);
    const navigate = useNavigate();

    const [imageExists, setImageExists] = useState(false);

    useEffect(() => {
        const checkImageExists = async () => {
            try {
                const response = await fetch(`https://seng365-reference-production.up.railway.app/api/v1/users/${user?.id}/image`);
                setImageExists(response.ok);
            } catch (error) {
                setImageExists(false);
            }
        };

        checkImageExists();
    }, [user]);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const userPatchConfig = {
            headers:{
                'X-Authorization': user?.authToken,
            }
        };
        try {
            setErrorFlag(false);
            setErrorMessage("");
            const updateUserInformationResult = await axios.patch("https://seng365-reference-production.up.railway.app/api/v1/users/" + user?.id, {
                ...(data.get('email') && data.get('email') !== user?.email && { email: data.get('email') }),
                ...(data.get('firstName') && data.get('firstName') !== user?.firstName && { firstName: data.get('firstName') }),
                ...(data.get('lastName') && data.get('lastName') !== user?.lastName && { lastName: data.get('lastName') }),
                ...(data.get('old-password') && { currentPassword: data.get('old-password') }),
                ...(data.get('new-password') && { password: data.get('new-password') })
            }, userPatchConfig);
            console.log(updateUserInformationResult)
            const userImageDeleteConfig = {
                headers:{
                    'X-Authorization': user?.authToken,
                }
            };
            const userImageConfig = {
                headers:{
                    'X-Authorization': user?.authToken,
                    'Content-Type': selectedImage?.type
                }
            };

            if(removeImage) {
                await axios.delete("https://seng365-reference-production.up.railway.app/api/v1/users/" + user?.id + "/image", userImageDeleteConfig)
            }
            if (selectedImage) {
                await axios.put("https://seng365-reference-production.up.railway.app/api/v1/users/" + user?.id + "/image", selectedImage, userImageConfig)
            }

            const userResult = await axios.get("https://seng365-reference-production.up.railway.app/api/v1/users/" + user?.id, userPatchConfig);
            const {data: userInfo} = userResult;
            setUser({...userInfo, id:user?.id, authToken:user?.authToken});
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
                                }}
                                alt={user?.firstName}
                                src={
                                    selectedImage
                                        ? URL.createObjectURL(selectedImage)
                                        : imageExists
                                            ? `https://seng365-reference-production.up.railway.app/api/v1/users/${user?.id}/image`
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
                                            setRemoveImage(false);
                                            setImageExists(true);
                                        }
                                    }}
                                />
                                Edit Profile Picture
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
                                    setRemoveImage(true);
                                    setImageExists(false);
                                    setSelectedImage(null);
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
                        Edit Information
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
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    defaultValue={user?.firstName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    defaultValue={user?.lastName}
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    defaultValue={user?.email}
                                    fullWidth
                                    id="email"
                                    label="Email Address, must be valid"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="old-password"
                                    label="Old Password"
                                    type={showPassword ? "text" : "password"}
                                    id="old-password"
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
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="new-password"
                                    label="New Password, min 6 characters"
                                    type={showPassword ? "text" : "password"}
                                    id="new-password"
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
                            Submit
                        </Button>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}
