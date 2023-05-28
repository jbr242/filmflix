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
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {useUserStore} from "../store";
import InfoIcon from '@mui/icons-material/Info';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';

type Props = {
    userId: number | undefined
};



export default function UsersFilms({ userId }: Props) {
    const user = useUserStore(state => state.user)
    const [userFilms, setUserFilms] = useState<Array<Film>>([]);
    const [genres, setGenres] = useState<Array<Genre>>([]);
    const [openDialogId, setOpenDialogId] = React.useState<number | null>(null);

    const handleClickOpen = (filmId: number) => {
        setOpenDialogId(filmId);
    };

    const handleClose = () => {
        setOpenDialogId(null);
    };

    const handleDeleteYes = async (filmId: number) => {
        const movieDeleteConfig = {
            headers:{
                'X-Authorization': user?.authToken,
            }
        };
        setOpenDialogId(null);
        await axios.delete(`https://seng365-reference-production.up.railway.app/api/v1/films/` + filmId, movieDeleteConfig);
        try {
            const response = await axios.get(`https://seng365-reference-production.up.railway.app/api/v1/films/?directorId=${userId}`);
            setUserFilms(response.data.films);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        const getUserFilms = async () => {
            const url = `https://seng365-reference-production.up.railway.app/api/v1/films/`;
            const userFilmsResponse = await axios.get(url + "?directorId="+userId)

            setUserFilms(userFilmsResponse.data.films);

        }
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
        getUserFilms();
    }, [userId]);




    if(userFilms.length === 0) {
        return(
            <div>
                <h2>
                    Your Films ({userFilms.length})
                </h2>
                You have not published any films
            </div>
        )
    }

    return (
        <List sx={{ width: '99%', maxHeight:'100%', bgcolor: 'background.paper', overflow:'auto'}}>
            <h2>Your Films ({userFilms.length})</h2>
            {userFilms.map((film) => (
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
                                        <Button
                                            component={Link}
                                            to={`/films/${film.filmId}/edit`}
                                            variant="outlined"
                                            color="primary"
                                            sx={{ marginLeft: '1rem' }}
                                        >
                                            <EditIcon />
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            sx={{ marginLeft: '1rem' }}
                                            onClick={() => handleClickOpen(film.filmId)}
                                        >
                                            <DeleteForeverIcon/>
                                        </Button>
                                        <Dialog
                                            open={openDialogId === film.filmId}
                                            onClose={handleClose}
                                            aria-labelledby={`alert-dialog-title-${film.filmId}`}
                                            aria-describedby={`alert-dialog-description-${film.filmId}`}
                                        >
                                            <DialogTitle id={`alert-dialog-title-${film.filmId}`}>
                                                {"Delete film " + film.title + "?"}
                                            </DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id={`alert-dialog-description-${film.filmId}`}>
                                                    This will permanently delete your film, are you sure?
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleClose}>No</Button>
                                                <Button onClick={() => handleDeleteYes(film.filmId)} autoFocus>
                                                    Yes
                                                </Button>
                                            </DialogActions>
                                        </Dialog>

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