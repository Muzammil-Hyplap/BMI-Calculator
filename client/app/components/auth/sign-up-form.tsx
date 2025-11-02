'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import z, { z as zod } from 'zod';

import { paths } from '@/paths';
import { useNavigate } from 'react-router';

export const registerSchema = z
    .object({
        fname: z.string().trim().min(1, { error: "Last Name is required" }).max(50),
        lname: z.string().trim().min(1, { error: "Last Name is required" }).max(50),
        email: z.email().trim(),
        phone_no: z
            .string()
            .trim()
            .min(1, { error: "Phone Number is required" })
            .max(10)
            .regex(/^[0-9]{10}$/),
        password: z
            .string()
            .trim()
            .min(1, { error: "Password is required" })
            .min(8)
            .max(16)
            .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,}$/),
        confirm_password: z.string().trim().min(1, { error: "Confirm Password is required" }),
    })

    // .superRefine((data, ctx) => {
    //     if (data.confirm_password !== data.password) {
    //         ctx.addIssue({
    //             code: "custom",
    //             message: "Passwords do not match",
    //             path: ["confirm_password"],
    //         });
    //     }
    // });


type Values = zod.infer<typeof registerSchema>;

export function SignUpForm(): React.JSX.Element {
    const navigate = useNavigate();
    const [isPending, setIsPending] = React.useState<boolean>(false);

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<Values>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            password:"",
            confirm_password:"",
            fname:"",
            lname:"",
            email:"",
            phone_no:"",
        },
    });

    const onSubmit = React.useCallback(
        async (values: Values): Promise<void> => {
            try {
                setIsPending(true);

                const formData = new FormData(document.getElementById("sign-up-form") as HTMLFormElement);
                const rawRes = await fetch(import.meta.env.VITE_API_URL + "/signup", {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                });
                // console.log(rawRes)

                const res = await rawRes.json();

                if (!res?.success) {
                    setIsPending(true);

                    setError("root", { type: "server", message: res?.message || "Something went wrong with the server" });
                    setIsPending(false);
                    return;
                } else if (res?.success && res?.data) {
                    // setUser(res?.data)
                    navigate(paths.auth.signIn)
                }

                setIsPending(false);
            } catch (e) {
                console.log(e);
            }
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

            <form onSubmit={handleSubmit(onSubmit)} id="sign-up-form" encType='multiplart/form-data'>
                <Stack spacing={2}>
                    <FormControl>
                        <InputLabel>Avatar</InputLabel>
                        <OutlinedInput label="Avatar" type="file" name="avatar" />
                        {/* {errors.fname ? <FormHelperText>{errors.fname.message}</FormHelperText> : null} */}
                    </FormControl>
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
                        name="email"
                        render={({ field }) => (
                            <FormControl error={Boolean(errors.email)}>
                                <InputLabel>Email</InputLabel>
                                <OutlinedInput {...field} label="Email"  />
                                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
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

                    <Controller
                        control={control}
                        name="confirm_password"
                        render={({ field }) => (
                            <FormControl error={Boolean(errors.confirm_password)}>
                                <InputLabel>Confirm Password</InputLabel>
                                <OutlinedInput {...field} label="Confirm Password" type="password" />
                                {errors.confirm_password ? <FormHelperText>{errors.confirm_password.message}</FormHelperText> : null}
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
