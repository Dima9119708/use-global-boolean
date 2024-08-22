import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useBooleanController, useGlobalBoolean } from 'use-global-boolean';

interface IMenu {
    target: HTMLElement;
    ai?: boolean;
    admin?: boolean;
}

const MuiMenuItem = () => {
    const [open, { setFalse, data }] = useBooleanController<null | IMenu>('menu', false);

    return (
        <Menu anchorEl={data?.target} open={open} onClose={() => setFalse()}>
            <MenuItem onClick={() => setFalse()}>Profile</MenuItem>
            {data?.ai && (
                <MenuItem onClick={() => setFalse()} sx={{ bgcolor: '#9c27b0' }}>
                    AI
                </MenuItem>
            )}
            {data?.admin && (
                <MenuItem onClick={() => setFalse()} sx={{ bgcolor: '#1acdb8' }}>
                    Admin
                </MenuItem>
            )}
            <MenuItem onClick={() => setFalse()}>My account</MenuItem>
            <MenuItem onClick={() => setFalse()}>Logout</MenuItem>
        </Menu>
    );
};

const MuiButton1 = () => {
    const { setTrue } = useGlobalBoolean();

    return (
        <Button variant="contained" onClick={(event) => setTrue('menu', { target: event.currentTarget })}>
            Calling the basic menu
        </Button>
    );
};

const MuiButton2 = () => {
    const { setTrue } = useGlobalBoolean();

    return (
        <Button variant="contained" onClick={(event) => setTrue<IMenu>('menu', { target: event.currentTarget, ai: true })}>
            Calling a menu with the item "AI"
        </Button>
    );
};

const MuiButton3 = () => {
    const { setTrue } = useGlobalBoolean();

    return (
        <Button variant="contained" onClick={(event) => setTrue<IMenu>('menu', { target: event.currentTarget, admin: true })}>
            Calling a menu with the item "Admin"
        </Button>
    );
};

export default function CallMenuWithDifferentArgs() {
    return (
        <>
            <Stack direction="row" gap={2}>
                <MuiButton1 />
                <MuiButton2 />
                <MuiButton3 />
            </Stack>

            <MuiMenuItem />
        </>
    );
}
