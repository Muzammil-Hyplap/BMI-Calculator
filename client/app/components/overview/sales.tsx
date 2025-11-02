'use client';

import React, { useCallback, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import { ArrowClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import type { ApexOptions } from 'apexcharts';
import Input from '@mui/material/Input';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { generateBMILineData } from '@/routes/overview';
import { Form } from 'react-router';

export interface SalesProps {
    chartSeries: { name: string; data: number[] }[];
    labels: string[],
    sx?: SxProps;
}

export function Sales({ chartSeries, labels, sx }: SalesProps): React.JSX.Element {
    const [Chart, setChart] = React.useState<any>(null);
    const [chartData, setChartData] = useState(chartSeries);
    const [chartLabels, setChartLabels] = useState(labels);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [readyMade, setReadyMade] = useState('');

    const chartOptions = useChartOptions(chartLabels);

    const handleChartFilter = async () => {
        try {
            const query: string[] = ['limit=10', `sd=${startDate}`, `ed=${endDate}`, `readyMade=${readyMade}`];
            const res = await (await fetch(import.meta.env.VITE_API_URL + '/bmi?' + query.join("&"))).json()
            console.log(query)

            if (res?.success && res?.data) {
                const { data, labels } = generateBMILineData(res.data)
                setChartData([{ name: "This Year", data }]);
                setChartLabels(labels);
            }
        } catch (e) {
            console.log(e);
        }
    }

    React.useEffect(() => {
        import("react-apexcharts").then((mod) => {
            setChart(() => mod.default);
        });
    }, []);

    if (!Chart) return <p>Loading chart...</p>;
    return (
        <Card sx={sx}>

            <CardHeader
                title="BMI"
            />

            <CardContent>
                <Chart height={350} options={chartOptions} series={chartData} type="line" width="100%" />
            </CardContent>
            {/* <Divider /> */}
            {/* <CardActions sx={{ justifyContent: 'flex-end' }}> */}
            {/*     <Button color="inherit" endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />} size="small"> */}
            {/*         Overview */}
            {/*     </Button> */}
            {/* </CardActions> */}

            <Form>
                <CardActions sx={{ padding: "2em", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", gap: ".5em", alignItems: "end" }}>
                        <FormControl >
                            <div style={{ display: "flex", gap: ".5em", alignItems: "end" }}>
                                <Typography color='primary'>
                                    Custom:
                                </Typography>
                                <Input type="date" id="sd" value={startDate} onChange={(e) => setStartDate(e.currentTarget.value)} />
                            </div>
                        </FormControl>
                        -
                        <FormControl >
                            <div style={{ display: "flex", gap: ".5em", alignItems: "end" }}>
                                <Input type="date" id="ed" value={endDate} onChange={(e) => setEndDate(e.currentTarget.value)} />
                            </div>
                        </FormControl>

                    </div>

                    <FormControl sx={{ minWidth: 150 }}>
                        <select style={{ padding: '1em' }} value={readyMade} onChange={(e) => setReadyMade(e.target.value as string)} id="readymade-filter">
                            <option value="" hidden>Select an option</option>
                            <option value="10">Last 10 Days</option>
                            <option value="30">Last month</option>
                            <option value="90">Last 3 month</option>
                            <option value="180">Last 6 month</option>
                        </select>
                    </FormControl>

                    <Button type='button' variant='outlined' style={{ marginLeft: 0 }} sx={{ margin: 0, marginTop: "2em" }} onClick={handleChartFilter}>Submit</Button>
                    <Button type='reset' variant='outlined' sx={{ margin: 0, marginTop: "2em" }} onClick={() => {
                        setStartDate('')
                        setEndDate('')
                        setReadyMade('')
                    }}>Reset</Button>
                </CardActions>
            </Form>
        </Card>
    );
}

function useChartOptions(labels: string[]): ApexOptions {
    const theme = useTheme();

    return {
        chart: { background: 'transparent', stacked: false, toolbar: { show: false } },
        colors: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.25)],
        dataLabels: { enabled: false },
        fill: { opacity: 1, type: 'solid' },
        grid: {
            borderColor: theme.palette.divider,
            strokeDashArray: 2,
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } },
        },
        legend: { show: false },
        plotOptions: { bar: { columnWidth: '40px' } },
        stroke: { colors: [theme.palette.primary.main], show: true, width: 2 },
        theme: { mode: theme.palette.mode },
        xaxis: {
            axisBorder: { color: theme.palette.divider, show: true },
            axisTicks: { color: theme.palette.divider, show: true },
            categories: labels,
            labels: { offsetY: 5, style: { colors: theme.palette.text.secondary } },
        },
        yaxis: {
            labels: {
                formatter: (value) => (value > 0 ? `${value}` : `${value}`),
                offsetX: -10,
                style: { colors: theme.palette.text.secondary },
            },
        },
    };
}
