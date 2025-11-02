import { zodResolver } from "@hookform/resolvers/zod"
import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import Icon from "@mui/material/Icon"
import InputLabel from "@mui/material/InputLabel"
import OutlinedInput from "@mui/material/OutlinedInput"
import Typography from "@mui/material/Typography"
import { border, height, Stack, useTheme, type SxProps } from "@mui/system"
import { ArrowClockwiseIcon } from "@phosphor-icons/react/dist/ssr/ArrowClockwise"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import z, { setErrorMap } from "zod"
import SaveIcon from '@mui/icons-material/Save';
import Snackbar from "@mui/material/Snackbar"
import { useNavigate } from "react-router"


export function BMICalc({ sx }: { sx?: SxProps }) {
    return (
        // action={
        //     <Button size="small" startIcon={<SaveIcon />}>
        //         Save
        //     </Button>
        // }
        <Card sx={sx}>
            <CardHeader
                title="BMI Calculator"
            />
            <CardContent>
                <BMICalcForm />
            </CardContent>

            {/* <Divider /> */}
            {/* <CardActions sx={{ justifyContent: 'flex-end' }}> */}
            {/*     <Button color="inherit" endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />} size="small"> */}
            {/*         Overview */}
            {/*     </Button> */}
            {/* </CardActions> */}
        </Card>
    )
}

const bmiCalcSchema = z.object({
    height: z.string().min(1, { error: 'Height is required' }).max(7).regex(/^[0-9]+\.?[0-9]{0,2}$/),
    weight: z.string().min(1, { error: 'Weight is required' }).max(7).regex(/^[0-9]+\.?[0-9]{0,2}$/),
})

type BmiCalc = z.infer<typeof bmiCalcSchema>

function BMICalcForm() {
    const { control, handleSubmit, formState: { isLoading, errors }, setError, getValues } = useForm<BmiCalc>({ resolver: zodResolver(bmiCalcSchema), mode: 'onChange' })
    const [bmi, setBMI] = useState<Number>(0);
    const theme = useTheme()
    const [successMessage, setSuccessMessage] = useState('')
    const [successOpen, setSuccessOpen] = useState(false)
    const navigate = useNavigate()

    const calculateBMI = () => {
        const weight = Number(getValues('weight'))
        const height = Number(getValues('height'))

        if (weight && height) {
            setBMI(weight / (height * height))
        }
    }

    const onSubmit = async (values: BmiCalc): Promise<void> => {
        try {
            const bodyObj  = {
                height: parseFloat(values.height),
                weight: parseFloat(values.weight)
            }
            const res = await(await fetch(import.meta.env.VITE_API_URL + '/bmi',{
                method:"POST",
                credentials:"include",
                body:JSON.stringify(bodyObj),
                headers:{
                    'Content-Type':'application/json'
                }
            })).json();

            if(res?.success){
                setSuccessMessage(res?.message || 'BMI added Successfully')
                setSuccessOpen(true)
                navigate(0)
                return;
            }

            setError("root", {message: res?.message || "Something went Wrong"})
        } catch (e) {
            console.log(e);
            setError("root", { message: 'Something went Wrong' });
        }
    }

    return (
        <Stack spacing={3}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                    <Controller
                        control={control}
                        name="height"
                        render={({ field }) => (
                            <FormControl error={Boolean(errors.height)}>
                                <InputLabel>Height</InputLabel>
                                <OutlinedInput {...field} label="Height" placeholder="in meters" type="text"
                                    onChange={(e) => {
                                        const regex = new RegExp(/^[0-9]*\.?[0-9]{0,2}$/)
                                        const val = e.target.value
                                        field.onChange(regex.test(val) ? val : field.value)
                                        calculateBMI()
                                    }}
                                />
                                {errors.height ? <FormHelperText>{errors.height.message}</FormHelperText> : null}
                            </FormControl>
                        )}
                    />

                    <Controller
                        control={control}
                        name="weight"
                        render={({ field }) => (
                            <FormControl error={Boolean(errors.weight)}>
                                <InputLabel>Weight</InputLabel>
                                <OutlinedInput {...field} label="Weight" placeholder="in kilos" type="text"
                                    onChange={(e) => {
                                        const regex = new RegExp(/^[0-9]*\.?[0-9]{0,2}$/)
                                        const val = e.target.value
                                        field.onChange(regex.test(val) ? val : field.value)
                                        calculateBMI()
                                    }}
                                />
                                {errors.weight ? <FormHelperText>{errors.weight.message}</FormHelperText> : null}
                            </FormControl>
                        )}
                    />

                    <Typography sx={{ border: '1px solid ' + theme.palette.divider, padding: '1em', borderRadius: '.55em' }}>
                        {bmi.toFixed(2)}
                    </Typography>

                    {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
                    <Button disabled={isLoading} type="submit" variant="outlined">
                        Save
                    </Button>
                </Stack>
            </form>
            <Snackbar
              anchorOrigin={{ vertical:'top', horizontal:'right' }}
              open={successOpen}
              message={successMessage}
              onClose={()=>setSuccessOpen(false)}
              key={'snack-bar-top-right'}
              autoHideDuration={1200}
            />
        </Stack>
    )
}
