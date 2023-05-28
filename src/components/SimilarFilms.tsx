import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import axios from "axios";
import {useEffect, useState} from "react";
import {Card, CardContent, CardMedia, Paper} from "@mui/material";
import Box from "@mui/material/Box";
import {Link} from "react-router-dom";
import CSS from "csstype";

const filmCardStyles: CSS.Properties = {
    display: "inline-block",
    height: "328px",
    width: "30%",
    margin: "10px",
    padding: "0px",
};
type Props = {
    genreId: number | undefined
    directorId: number | undefined
    sourceFilmId: number | undefined
};



export default function SimilarFilms({ genreId, directorId, sourceFilmId }: Props) {
    const [similarFilms, setSimilarFilms] = useState<Array<Film>>([]);
    const [genres, setGenres] = useState<Array<Genre>>([]);

    const removeDuplicates = (films: Array<Film>) => {
        const uniqueFilms = [];
        const filmIds = new Set();
        for (let i = 0; i < films.length; i++) {
            const film = films[i];
            if (!filmIds.has(film.filmId) && film.filmId !== sourceFilmId) {
                uniqueFilms.push(film);
                filmIds.add(film.filmId);
            }
        }
        return uniqueFilms;
    };


    useEffect(() => {
        const getSimilarFilms = async () => {
            const url = `https://seng365-reference-production.up.railway.app/api/v1/films/`;
            const similarFilmsByGenre = await axios.get(url + "?genreIds="+genreId)
            const similarFilmsByDirector = await axios.get(url + "?directorId="+directorId)

            setSimilarFilms([...similarFilmsByDirector.data.films, ...similarFilmsByGenre.data.films]);

        }
        const getGenres = () => {
            axios.get("https://seng365-reference-production.up.railway.app/api/v1/films/genres")
                .then(
                    (response) => {
                        setGenres(response.data);
                    },

                );
        }

        if (sourceFilmId === undefined || genreId === undefined || directorId === undefined) {
            return;
        }
        getSimilarFilms();
        getGenres()

    }, [sourceFilmId, genreId, directorId]);



    const uniqueSimilarFilms = removeDuplicates(similarFilms);

    if(similarFilms.length === 0) {
        return(
            <div>
                <h2>
                    Similar Films ({uniqueSimilarFilms.length})
                </h2>
                There are currently no Similar Films
            </div>
        )
    }

    return (
        <Paper elevation={5} sx={{height: "50vh", width: "100%", overflow: "auto"}}>
            <h2>
                Similar Films ({uniqueSimilarFilms.length})
            </h2>
            {uniqueSimilarFilms.map((film, filmId) => (
                <Link to={"/films/" + film.filmId } >
                    <Card key={filmId} sx={filmCardStyles}>
                        <CardMedia
                            component="img"
                            height="200"
                            width="200"
                            sx={{objectFit: "cover"}}
                            image={"https://seng365-reference-production.up.railway.app/api/v1/films/" + film.filmId + "/image"}
                            alt="Auction hero"
                        />
                        <CardContent>
                            <Typography variant="h6">
                                {film.title}
                            </Typography>
                            <Typography variant="caption">
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    Id: {film.filmId}, Genre: {genres
                                    .filter((genre) => genre.genreId === film.genreId)
                                    .map((genre) => genre.name)
                                    .pop() || 'Unknown Genre'}, Age Rating: {film.ageRating}, Release Date: {new Date(film.releaseDate).toLocaleString()},
                                    Ratings: {film.rating},
                                    Director: {film.directorFirstName} {film.directorLastName}
                                    <Avatar
                                        alt={film.directorFirstName}
                                        src={"https://seng365-reference-production.up.railway.app/api/v1/users/" + film.directorId + "/image"}
                                    />
                                </Box>
                            </Typography>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </Paper>
    );
}