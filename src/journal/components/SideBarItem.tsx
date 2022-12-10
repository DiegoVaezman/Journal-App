import {
    Grid,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import React from 'react';
import { TurnedInNot } from '@mui/icons-material';
import { Note, setActiveNote } from '../../store/journal/journalSlice';
import { useMemo } from 'react';
import { useAppDispatch } from '../../hooks';

interface Props {
    note: Note;
}

export const SideBarItem = ({ note }: Props) => {
    const { id, title, body } = note;
    const dispatch = useAppDispatch();
    const newTitle = useMemo(() => {
        return title.length > 17 ? title.substring(0, 17) + '...' : title;
    }, [title]);
    const newBody = useMemo(() => {
        return body.length > 60 ? body.substring(0, 60) + '...' : body;
    }, [body]);

    const onClickItem = () => {
        dispatch(setActiveNote(note));
    };
    return (
        <ListItem key={id} disablePadding>
            <ListItemButton onClick={onClickItem}>
                <ListItemIcon>
                    <TurnedInNot />
                </ListItemIcon>
                <Grid container>
                    <ListItemText primary={newTitle} />
                    <ListItemText secondary={newBody} />
                </Grid>
            </ListItemButton>
        </ListItem>
    );
};
