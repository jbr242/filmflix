import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {useState} from "react";


const sortByValues = [
    { id: 'ALPHABETICAL_ASC', name: 'A-Z' },
    { id: 'ALPHABETICAL_DESC', name: 'Z-A' },
    { id: 'RELEASED_ASC', name: 'Oldest First' },
    { id: 'RELEASED_DESC', name: 'Newest First' },
    { id: 'RATING_ASC', name: 'Lowest Rated' },
    { id: 'RATING_DESC', name: 'Top Rated' },
];


const SortBy = ({ onFilterChange }: { onFilterChange: (filteredValues: string) => void }) => {
    const [sortBy, setSortBy] = useState("");


    const handleChange = (event: SelectChangeEvent<typeof sortBy>) => {
        const {
            target: { value },
        } = event;
        setSortBy(
            value
        );
        onFilterChange(value)
    };

    return (
        <Box sx={{ width: 300, maxWidth:'100%' }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={sortBy}
                    label="Sort By"
                    onChange={handleChange}
                >
                    {sortByValues.map((sortValue) => (
                        <MenuItem key={sortValue.id} value={sortValue.id}>
                            {sortValue.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    )
};


export default SortBy;