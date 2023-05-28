import {ChangeEvent, Fragment, useEffect, useState} from "react";
import axios from "axios";
import {
    Alert,
    AlertTitle,
    Card,
    CardContent,
    CardMedia,
    Pagination,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import CSS from "csstype";
import ResponsiveAppBar from "./NavBar";
import {Link} from "react-router-dom";
import AgeFilter from "./AgeFilter";
import GenreFilter from "./GenreFilter";
import Box from "@mui/material/Box";
import SortBy from "./SortBy";
import Avatar from "@mui/material/Avatar";

const filmCardStyles: CSS.Properties = {
    display: "inline-block",
    height: "45%",
    width: "30%",
    margin: "10px",
    padding: "0px",
};
const searchCardStyle: CSS.Properties = {
    display: "inline-block",
    height: "100%",
    width: "100%",
    marginTop: "10px",
    padding: "0px",

};
const filmsPerPage = 6;
const Films = () => {
    const [films, setFilms] = useState<Array<Film>>([]);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [genreInput, setGenreInput] = useState<Array<number>>([]);
    const [ageInput, setAgeInput] = useState<Array<string>>([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const startIndex = (page - 1) * filmsPerPage;
    const [genres, setGenres] = useState<Array<Genre>>([]);
    const [sortBy, setSortBy] = useState("");

    useEffect(() => {
        getFilms();
        getGenres();
    }, [page, searchInput, genreInput, ageInput, sortBy]);

    const getFilms = () => {

        const params = new URLSearchParams();

        if (searchInput.length !== 0) {
            params.set("q", searchInput);
        }
        if (genreInput.length !== 0) {
            genreInput.forEach((genre) => {
                params.append("genreIds", String(genre));
            });
        }
        if (ageInput.length !== 0) {
            ageInput.forEach((age) => {
                params.append("ageRatings", String(age));
            });
        }
        if (sortBy.length !== 0) {
            params.set("sortBy", String(sortBy));
        }
        params.set("startIndex", String(startIndex));
        params.set("count", String(filmsPerPage));

        const url = `https://seng365-reference-production.up.railway.app/api/v1/films?${params.toString()}`;
        axios.get(url)
            .then(
                (response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setFilms(response.data.films);
                    setPageCount(Math.ceil(response.data.count / 6));
                },
                (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                }
            );
    };


    const getGenres = () => {
        axios.get("https://seng365-reference-production.up.railway.app/api/v1/films/genres")
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

    const handleSearchChange = (e: any) => {
        e.preventDefault();
        setSearchInput(e.target.value);
        getFilms();
        setPage(1)
    };
    const handlePageChange = (_: ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    const handleGenreFilterChange = (filteredValues: number | number[]) => {
        if (typeof filteredValues === 'number') {
            setGenreInput([filteredValues]); // Wrap the single number in an array
        } else {
            setGenreInput(filteredValues);
        }
        getFilms();
        setPage(1)
    };

    const handleAgeFilterChange = (filteredValues: string | string[]) => {
        if (typeof filteredValues === 'string') {
            setAgeInput([filteredValues]); // Wrap the single number in an array
        } else {
            setAgeInput(filteredValues);
        }
        getFilms();
        setPage(1)
    };

    const handleSortByChange = (filteredValues: string) => {
        setSortBy(filteredValues);
        getFilms();
        setPage(1)
    };


    return (
        <div style={{width:'1280px',maxWidth:'90vw'}}>
            <Fragment>
                <ResponsiveAppBar/>
            </Fragment>
            {errorFlag && (
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>
            )}
            <Card key={0} sx={searchCardStyle}>
                <CardContent>
                    <TextField sx={{width: '100%'}} id="filled-basic" label="Search film" variant="outlined"
                               onChange={handleSearchChange} value={searchInput}/>
                </CardContent>
                <CardContent sx={{display: "flex", maxWidth: "100%", justifyContent: "space-around", alignItems: "center"}}>
                        <AgeFilter onFilterChange={handleAgeFilterChange}/>
                        <GenreFilter onFilterChange={handleGenreFilterChange}/>
                        <SortBy onFilterChange={handleSortByChange}/>
                </CardContent>
            </Card>

            <Paper elevation={1} sx={{height: "75vh", width: "100%", overflow: "auto"}}>
                {films.map((film) => (
                    <Link to={"/films/" + film.filmId}>
                        <Card key={film.filmId} sx={filmCardStyles}>
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
            <Card sx={searchCardStyle}>
                <CardContent sx={{display: "flex", justifyContent: "center"}}>
                    <Pagination showFirstButton showLastButton count={pageCount} page={page} onChange={handlePageChange}/>
                </CardContent>
            </Card>

        </div>
    );
};

export default Films;
