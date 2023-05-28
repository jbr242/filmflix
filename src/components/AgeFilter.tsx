import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import {useState} from "react";

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

const ageRatings = [
    'G',
    'PG',
    'M',
    'R13',
    'R16',
    'R18',
];

function getStyles(selectedAgeRating: string, ageRating: readonly string[], theme: Theme) {
    return {
        fontWeight:
            ageRating.indexOf(selectedAgeRating) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}
const AgeFilter = ({ onFilterChange }: { onFilterChange: (filteredValues: string[] | string) => void }) => {
    const theme = useTheme();
    const [ageRating, setAgeRating] = useState<string[]>([]);


    const handleChange = (event: SelectChangeEvent<typeof ageRating>) => {
        const {
            target: { value },
        } = event;
        setAgeRating(
            typeof value === 'string' ? value.split(',') : value,
        );
        onFilterChange(value)
    };

    return (
            <FormControl sx={{ width: 300, maxWidth:'100%' }}>
                <InputLabel id="ageRating-label">Age Rating</InputLabel>
                <Select
                    labelId="ageRating-label"
                    id="ageRating"
                    multiple
                    value={ageRating}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', gap: 0.5, overflow: 'auto' }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {ageRatings.map((selectedAgeRating) => (
                        <MenuItem
                            key={selectedAgeRating}
                            value={selectedAgeRating}
                            style={getStyles(selectedAgeRating, ageRating, theme)}
                        >
                            {selectedAgeRating}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
    )
};


export default AgeFilter;