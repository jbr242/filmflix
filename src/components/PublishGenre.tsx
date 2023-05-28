import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState } from "react";
import axios from "axios";

interface PublishGenreProps {
    defaultValue?: number;
}

const PublishGenre = ({ defaultValue }: PublishGenreProps) => {
    const [genre, setGenre] = useState<Genre | undefined>();
    const [genres, setGenres] = useState<Array<Genre>>([]);

    useEffect(() => {
        getGenres();
    }, []);

    const getGenres = () => {
        axios.get("http://localhost:4941/api/v1/films/genres")
            .then((response) => {
                setGenres(response.data);
            });
    };

    const handleChange = (event: SelectChangeEvent) => {
        const selectedGenreId = Number(event.target.value);
        const selectedGenre = genres.find((genre) => genre.genreId === selectedGenreId);
        setGenre(selectedGenre);
    };

    useEffect(() => {
        if (defaultValue) {
            const selectedGenre = genres.find((genre) => genre.genreId === defaultValue);
            setGenre(selectedGenre);
        }
    }, [defaultValue, genres]);

    return (
        <FormControl sx={{ width: '100%' }}>
            <InputLabel id="genre-label">Genre *</InputLabel>
            <Select
                labelId="genre-label"
                id="genreId"
                name="genreId"
                value={genre ? `${genre.genreId}` : ''}
                required
                onChange={handleChange}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: '30vh',
                            overflow: "auto"
                        }
                    }
                }}
            >
                {genres.map((selectedGenre) => (
                    <MenuItem value={selectedGenre.genreId} key={selectedGenre.genreId}>
                        {selectedGenre.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default PublishGenre;
