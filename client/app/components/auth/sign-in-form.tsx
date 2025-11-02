import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { EyeSlashIcon } from "@phosphor-icons/react/dist/ssr/EyeSlash";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { useFetcher, useNavigate } from "react-router";
import type { Route } from "../../routes/auth/+types/sign-in";
import useUser from "@/stores/user";
// import { useUser } from '@/hooks/use-user';

const schema = zod.object({
    phone_no: zod
        .string({ error: "Only numbers allowed" })
        .regex(/^[0-9]*$/, { error: "Only Numbers allowed" })
        .max(10, { message: "Phone number must be ten digits long" })
        .min(10, { message: "Phone number must be ten digits long" })
        .refine((value) => Number(value.charAt(0)) >= 6, { error: "Phone number must be an Indian Number" }),
    password: zod
        .string()
        .min(8, { error: "Password must be at least 8 characters" })
        .max(16, { error: "Password must be at most 16 characters" })
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,}$/, {
            message: "Password must contain an uppercase letter, lowercase letter, and a special character",
        }),
});

type Values = zod.infer<typeof schema>;

// const defaultValues = { : "sofia@devias.io", password: "Secret1" } satisfies Values;

export function SignInForm(): React.JSX.Element {
    const navigate = useNavigate();

    // const { checkSession } = useUser();

    const [showPassword, setShowPassword] = React.useState<boolean>();

    const [isPending, setIsPending] = React.useState<boolean>(false);

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<Values>({
        resolver: zodResolver(schema), mode: "onChange",
        defaultValues:{ phone_no:"", password:"" },
    });
    const fetcher = useFetcher();
    const setUser = useUser((state)=> state.setUser);

    const onSubmit = React.useCallback(
        async (values: Values): Promise<void> => {
            try {
                setIsPending(true);

                const rawRes = await fetch(import.meta.env.VITE_API_URL + "/signin", {
                    method: "POST",
                    body: JSON.stringify(values),
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                // console.log(rawRes)

                const res = await rawRes.json();

                if (!res?.success) {
                    setError("root", { type: "server", message: res?.message || "Something went wrong with the server" });
                    setIsPending(false);
                    return;
                }else if(res?.success && res?.data){
                    setUser(res?.data)
                    navigate('/')
                }

                setIsPending(false);
            } catch (e) {
                console.log(e);
            }
        },
        [navigate, setError]
    );

    return (
        <Stack spacing={4}>
            <Stack spacing={1}>
                <Typography variant="h4">Sign in</Typography>
                <Typography color="text.secondary" variant="body2">
                    Don&apos;t have an account?{" "}
                    <Link component={Link} href={paths.auth.signUp} underline="hover" variant="subtitle2">
                        Sign up
                    </Link>
                </Typography>
            </Stack>

            <fetcher.Form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
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
                                <OutlinedInput
                                    {...field}
                                    endAdornment={
                                        showPassword ? (
                                            <EyeIcon
                                                cursor="pointer"
                                                fontSize="var(--icon-fontSize-md)"
                                                onClick={(): void => {
                                                    setShowPassword(false);
                                                }}
                                            />
                                        ) : (
                                            <EyeSlashIcon
                                                cursor="pointer"
                                                fontSize="var(--icon-fontSize-md)"
                                                onClick={(): void => {
                                                    setShowPassword(true);
                                                }}
                                            />
                                        )
                                    }
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                />
                                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                            </FormControl>
                        )}
                    />
                    {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
                    <Button disabled={isPending} type="submit" variant="contained">
                        Sign in
                    </Button>
                </Stack>
            </fetcher.Form>
        </Stack>
    );
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    console.log(formData);
}
