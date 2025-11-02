'use client';

import React, { useEffect, useState } from 'react';
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

export interface SalesProps {
    chartSeries: { name: string; data: number[] }[];
    sx?: SxProps;
}

export function Sales({ chartSeries, sx }: SalesProps): React.JSX.Element {
    const chartOptions = useChartOptions();

    const [Chart, setChart] = React.useState<any>(null);

    React.useEffect(() => {
        import("react-apexcharts").then((mod) => {
            setChart(() => mod.default);
        });
    }, []);

    if (!Chart) return <p>Loading chart...</p>;
    return (
        <Card sx={sx}>
            <CardHeader
                action={
                    <Button color="inherit" size="small" startIcon={<ArrowClockwiseIcon fontSize="var(--icon-fontSize-md)" />}>
                        Sync
                    </Button>
                }
                title="BMI"
            />
            <CardContent>
                <Chart height={350} options={chartOptions} series={chartSeries} type="line" width="100%" />
            </CardContent>
            {/* <Divider /> */}
            {/* <CardActions sx={{ justifyContent: 'flex-end' }}> */}
            {/*     <Button color="inherit" endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />} size="small"> */}
            {/*         Overview */}
            {/*     </Button> */}
            {/* </CardActions> */}
        </Card>
    );
}

function useChartOptions(): ApexOptions {
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
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
