'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { useNavigate } from 'react-router';
// import { useUser } from '@/hooks/use-user';

const schema = zod.object({
  fname: zod.string().min(1, { message: 'First name is required' }),
  lname: zod.string().min(1, { message: 'Last name is required' }),
  phone_no: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(6, { message: 'Password should be at least 6 characters' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { fname: '', lname: '', phone_no: '', password: '' } satisfies Values;

export function SignUpForm(): React.JSX.Element {
  const navigate = useNavigate();

  // const { checkSession } = useUser();

  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      // const { error } = await authClient.signUp(values);

      // if (error) {
      //   setError('root', { type: 'server', message: error });
      //   setIsPending(false);
      //   return;
      // }

      // Refresh the auth state
      // await checkSession?.();

      // UserProvider, for this case, will not refresh the router
      // After refresh, GuestGuard will handle the redirect
      navigate(0)
    },
    [navigate, setError]
  );

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4">Sign up</Typography>
        <Typography color="text.secondary" variant="body2">
          Already have an account?{' '}
          <Link component={Link} href={paths.auth.signIn} underline="hover" variant="subtitle2">
            Sign in
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="fname"
            render={({ field }) => (
              <FormControl error={Boolean(errors.fname)}>
                <InputLabel>First name</InputLabel>
                <OutlinedInput {...field} label="First name" />
                {errors.fname ? <FormHelperText>{errors.fname.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="lname"
            render={({ field }) => (
              <FormControl error={Boolean(errors.lname)}>
                <InputLabel>Last Name</InputLabel>
                <OutlinedInput {...field} label="Last Name" />
                {errors.lname ? <FormHelperText>{errors.lname.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="phone_no"
            render={({ field }) => (
              <FormControl error={Boolean(errors.phone_no)}>
                <InputLabel>Phone Number</InputLabel>
                <OutlinedInput {...field} label="Phone Number" type="phone_no" />
                {errors.phone_no ? <FormHelperText>{errors.phone_no.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Password</InputLabel>
                <OutlinedInput {...field} label="Password" type="password" />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            Sign up
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
