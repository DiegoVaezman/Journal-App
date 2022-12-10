import { TurnedInNot } from '@mui/icons-material';
import {
    Drawer,
    Box,
    Toolbar,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    Grid,
    ListItemText,
} from '@mui/material';
import { useAppSelector } from '../../hooks';
import { SideBarItem } from './SideBarItem';

interface Props {
    drawerWidth: number;
}

export const SideBar = ({ drawerWidth }: Props) => {
    const { displayName } = useAppSelector((state) => state.auth);
    const { notes } = useAppSelector((state) => state.journal);
    return (
        <Box
            component='nav'
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
            <Drawer
                variant='permanent'
                open={true}
                sx={{
                    display: { xs: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                    },
                }}
            >
                <Toolbar>
                    <Typography variant='h6' noWrap component='div'>
                        {displayName}
                    </Typography>
                </Toolbar>
                <Divider />

                <List>
                    {notes.map((note) => (
                        <SideBarItem key={note.id} note={note} />
                    ))}
                </List>
            </Drawer>
        </Box>
    );
};
