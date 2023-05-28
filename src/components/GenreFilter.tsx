import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import {useEffect, useState} from "react";
import axios from "axios";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(selectedGenre: number, genre: readonly number[], theme: Theme) {
    return {
        fontWeight:
            genre.indexOf(selectedGenre) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}
const GenreFilter = ({ onFilterChange }: { onFilterChange: (filteredValues: number[] | number) => void }) => {
    const theme = useTheme();
    const [genre, setGenre] = useState<number[]>([]);
    const [genres, setGenres] = useState<Array<Genre>>([]);


    useEffect(() => {
        getGenres();
    }, []);

    const handleChange = (event: SelectChangeEvent<typeof genre>) => {
        const {
            target: { value },
        } = event;
        const setGenreValue = typeof value === 'string' ? value.split(',').map((v) => Number(v)) : value;
        setGenre(
            setGenreValue
        );
        onFilterChange(setGenreValue);
    };
    const getGenres = () => {
        axios.get("http://localhost:4941/api/v1/films/genres")
            .then((response) => {
                setGenres(response.data);
            });
    }


    return (
            <FormControl sx={{ width: 300, maxWidth:'100%' }}>
                <InputLabel id="genre-label">Genre</InputLabel>
                <Select
                    labelId="genre-label"
                    id="genre"
                    multiple
                    value={genre}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', gap: 0.5, overflow: 'auto' }}>
                            {selected.map((value) => (
                                <Chip key={value} label={genres.find((genre) => genre.genreId === value)?.name} />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {genres.map((selectedGenre) => (
                        <MenuItem
                            key={selectedGenre.name}
                            value={selectedGenre.genreId}
                            style={getStyles(selectedGenre.genreId, genre, theme)}
                        >
                            {selectedGenre.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
    )
};


export default GenreFilter;