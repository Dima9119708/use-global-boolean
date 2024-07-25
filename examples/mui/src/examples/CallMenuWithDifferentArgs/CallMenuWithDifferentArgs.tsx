import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useGlobalBoolean, useRegisterBoolean } from 'use-global-boolean';

interface IMenu {
    target: HTMLElement;
    ai?: boolean;
    admin?: boolean;
}

const MuiMenuItem = () => {
    const [open, { onFalse, data }] = useRegisterBoolean<null | IMenu>('menu', false);

    return (
        <Menu anchorEl={data?.target} open={open} onClose={onFalse}>
            <MenuItem onClick={onFalse}>Profile</MenuItem>
            {data?.ai && (
                <MenuItem onClick={onFalse} sx={{ bgcolor: '#9c27b0' }}>
                    AI
                </MenuItem>
            )}
            {data?.admin && (
                <MenuItem onClick={onFalse} sx={{ bgcolor: '#1acdb8' }}>
                    Admin
                </MenuItem>
            )}
            <MenuItem onClick={onFalse}>My account</MenuItem>
            <MenuItem onClick={onFalse}>Logout</MenuItem>
        </Menu>
    );
};

const MuiButton1 = () => {
    const { onTrue } = useGlobalBoolean();

    return (
        <Button
            variant="contained"
            onClick={(event) => onTrue('menu', { target: event.currentTarget })}
        >
            Calling the basic menu
        </Button>
    );
};

const MuiButton2 = () => {
    const { onTrue } = useGlobalBoolean();

    return (
        <Button
            variant="contained"
            onClick={(event) => onTrue<IMenu>('menu', { target: event.currentTarget, ai: true })}
        >
            Calling a menu with the item "AI"
        </Button>
    );
};

const MuiButton3 = () => {
    const { onTrue } = useGlobalBoolean();

    return (
        <Button
            variant="contained"
            onClick={(event) => onTrue<IMenu>('menu', { target: event.currentTarget, admin: true })}
        >
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
