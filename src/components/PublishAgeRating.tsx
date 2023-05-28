import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';
import Button from "@mui/material/Button";

const ageRatings = ['G', 'PG', 'M', 'R13', 'R16', 'R18'];

interface PublishAgeRatingProps {
    defaultValue?: string;
}

const PublishAgeRating = ({ defaultValue }: PublishAgeRatingProps) => {
    const [ageRating, setAgeRating] = useState<string>(defaultValue || '');

    const handleChange = (event: SelectChangeEvent) => {
        setAgeRating(event.target.value as string);
    };

    const handleClearSelection = () => {
        setAgeRating('');
    };

    return (
        <FormControl sx={{ width: '100%' }}>
            <InputLabel id="age-rating-label">Age Rating *</InputLabel>
            <Select
                labelId="age-rating-label"
                id="ageRating"
                name="ageRating"
                value={ageRating}
                required
                onChange={handleChange}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: '30vh',
                            overflow: 'auto',
                        },
                    },
                }}
            >
                {ageRatings.map((rating) => (
                    <MenuItem value={rating} key={rating}>
                        {rating}
                    </MenuItem>
                ))}
            </Select>
                <Button onClick={handleClearSelection} disabled={!ageRating}>Clear Selection</Button>
        </FormControl>
    );
};

export default PublishAgeRating;
