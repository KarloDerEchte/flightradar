/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { NextResponse } from "next/server";

import { InfluxDB } from "@influxdata/influxdb-client";
export async function GET() {
  const org = `KarloHosting`;

  const token = process.env.INFLUX_TOKEN;
  const url = "http://de-hy-internal-01:8086";
  const client = new InfluxDB({ url, token }).getQueryApi(org);
  const lastData = [];
await new Promise<void>((resolve, reject) => {
    client.queryRows(
        `from(bucket: "Flightradar")
            |> range(start: -1m)
            |> filter(fn: (r) => r["_measurement"] == "flight_data")
            |> filter(fn: (r) => r["_field"] == "altitude" or r["_field"] == "lon" or r["_field"] == "lat" or r["_field"] == "speed" or r["_field"] == "squawk" or r["_field"] == "heading")
            |> group(columns: ["flight_id", "_field"])
            |> last()
            |> pivot(rowKey: ["flight_id"], columnKey: ["_field"], valueColumn: "_value")
            |> yield(name: "latest_per_flight")`,
        {
            next(row) {
                lastData.push(row);
            },
            error(error) {
                console.error("Query error", error);
                reject(error);
            },
            complete() {
                console.log("Query completed");
                resolve();
            },
        }
    );
});
  
  return NextResponse.json({ data: lastData }, { status: 200 });
}
