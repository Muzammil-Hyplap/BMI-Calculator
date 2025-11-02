import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { SignOutIcon } from '@phosphor-icons/react/dist/ssr/SignOut';
import { UserIcon } from '@phosphor-icons/react/dist/ssr/User';

import { paths } from '@/paths';
import useUser from '@/stores/user';
import { Link, useNavigate } from 'react-router';
// import { useNavigate } from 'react-router';
// import { authClient } from '@/lib/auth/client';
// import { logger } from '@/lib/default-logger';
// import { useUser } from '@/hooks/use-user';

export interface UserPopoverProps {
    anchorEl: Element | null;
    onClose: () => void;
    open: boolean;
}

export function UserPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
    const user = useUser(user => user)
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await (await(fetch(import.meta.env.VITE_API_URL + '/signout', {
                method:'POST',
                credentials:'include',
            }))).json();
            if(res?.success){
                navigate('/sign-in')
            }else{
                navigate(0)
            }
        } catch (e) { console.log(e) };
    }
    return (
        <Popover
            anchorEl={anchorEl}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            onClose={onClose}
            open={open}
            slotProps={{ paper: { sx: { width: '240px' } } }}
        >
            <Box sx={{ p: '16px 20px ' }}>
                <Typography variant="subtitle1">{user.fname} {user.lname}</Typography>
                <Typography color="text.secondary" variant="body2">
                    {user.email}
                </Typography>
            </Box>
            <Divider />
            <MenuList disablePadding sx={{ p: '8px', '& .MuiMenuItem-root': { borderRadius: 1 } }}>
                {/* <MenuItem  href={paths.dashboard.settings} onClick={onClose}> */}
                {/*   <ListItemIcon> */}
                {/*     <GearSixIcon fontSize="var(--icon-fontSize-md)" /> */}
                {/*   </ListItemIcon> */}
                {/*   Settings */}
                {/* </MenuItem> */}
                {/* <MenuItem  href={paths.dashboard.account} onClick={onClose}> */}
                {/*   <ListItemIcon> */}
                {/*     <UserIcon fontSize="var(--icon-fontSize-md)" /> */}
                {/*   </ListItemIcon> */}
                {/*   Profile */}
                {/* </MenuItem> */}
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <SignOutIcon fontSize="var(--icon-fontSize-md)" />
                    </ListItemIcon>
                    Sign out
                </MenuItem>
            </MenuList>
        </Popover>
    );
}
