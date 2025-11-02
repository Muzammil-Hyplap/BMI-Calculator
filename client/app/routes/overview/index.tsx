import * as React from "react";
import Grid from "@mui/material/Grid";
import { config } from "@/config";
import { Budget } from "@/components/overview/budget";
import LatestBMIs, { type BMI } from "@/components/overview/latest-bmis";
import { Sales } from "@/components/overview/sales";
import { TasksProgress } from "@/components/overview/tasks-progress";
import { TotalCustomers } from "@/components/overview/total-customers";
import { TotalProfit } from "@/components/overview/total-profit";
import { Traffic } from "@/components/overview/traffic";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import type { Route } from "./+types";
import { paths } from "@/paths";
import { BMICalc } from "@/components/overview/bmi-calc";

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` };

export async function clientLoader({
    params,
}: Route.ClientLoaderArgs) {
    const data = await (await fetch(import.meta.env.VITE_API_URL + paths.api.get.bmi + '?limit=10')).json();

    return data?.data
}

export default function Page({loaderData}:Route.ComponentProps): React.JSX.Element {
    return (
        <DashboardLayout>
            <Grid container spacing={3}>
                {/* <Grid */}
                {/*     size={{ */}
                {/*         lg: 3, */}
                {/*         sm: 6, */}
                {/*         xs: 12, */}
                {/*     }} */}
                {/* > */}
                {/*     <Budget diff={12} trend="up" sx={{ height: "100%" }} value="$24k" /> */}
                {/* </Grid> */}
                {/* <Grid */}
                {/*     size={{ */}
                {/*         lg: 3, */}
                {/*         sm: 6, */}
                {/*         xs: 12, */}
                {/*     }} */}
                {/* > */}
                {/*     <TotalCustomers diff={16} trend="down" sx={{ height: "100%" }} value="1.6k" /> */}
                {/* </Grid> */}
                {/* <Grid */}
                {/*     size={{ */}
                {/*         lg: 3, */}
                {/*         sm: 6, */}
                {/*         xs: 12, */}
                {/*     }} */}
                {/* > */}
                {/*     <TasksProgress sx={{ height: "100%" }} value={75.5} /> */}
                {/* </Grid> */}
                {/* <Grid */}
                {/*     size={{ */}
                {/*         lg: 3, */}
                {/*         sm: 6, */}
                {/*         xs: 12, */}
                {/*     }} */}
                {/* > */}
                {/*     <TotalProfit sx={{ height: "100%" }} value="$15k" /> */}
                {/* </Grid> */}
                <Grid
                    size={{
                        lg: 6,
                        xs: 12,
                    }}
                >
                    <Sales
                        chartSeries={[
                            { name: 'This year', data: generateBMILineData(loaderData) },
                        ]}
                        sx={{ height: '100%' }}
                    />
                </Grid>
                {/* <Grid */}
                {/*     size={{ */}
                {/**/}
                {/*         lg: 4, */}
                {/*         md: 6, */}
                {/*         xs: 12, */}
                {/*     }} */}
                {/* > */}
                {/*     <Traffic chartSeries={[63, 15, 22]} labels={['Desktop', 'Tablet', 'Phone']} sx={{ height: '100%' }} /> */}
                {/* </Grid> */}
                <Grid
                    size={{
                        lg: 6,
                        md: 12,
                        xs: 12,
                    }}
                >
                    <BMICalc/>
                </Grid>
                <Grid
                    size={{
                        lg: 12,
                        md: 12,
                        xs: 12,
                    }}
                >
                    <LatestBMIs
                        loaderData={loaderData}
                    />
                </Grid>
            </Grid>
        </DashboardLayout>
    );
}

function generateBMILineData(loaderData:BMI[]){
    const data = [];
    const monthDataMap:Record<number, number> = {};

    loaderData.forEach((data:BMI)=>{
        const date = new Date(data.createdAt);
        monthDataMap[date.getMonth()] = data.bmi
    })

    let prevData = 0
    for(let i = 0; i < 12 ; i++){
        if(monthDataMap[i]){
            data.push(monthDataMap[i])
            prevData = monthDataMap[i]
            continue
        }

        data.push(prevData);
    }

    return data
}

