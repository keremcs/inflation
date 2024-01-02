"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";

type Logs = {
  balances: number;
  expenditure: number;
  period: number;
  price: number;
}[];

export default function ResultPage({
  apple,
  data,
  username,
}: {
  apple: number;
  data: Logs;
  username: string;
}) {
  const plain = data.map((item) => {
    return {
      period: item.period,
      money: item.balances,
      price: item.price,
      velocity: parseFloat(
        ((item.expenditure / item.balances) * 100).toFixed(2)
      ),
    };
  });

  const growth = plain.map((item, index) => {
    if (index === 0) {
      return {
        period: 0,
        money: 30,
        price: 30,
      };
    }

    return {
      period: item.period,
      money: parseFloat(
        ((item.money / plain[index - 1]?.money - 1) * 100).toFixed(2)
      ),
      price: parseFloat(
        ((item.price / plain[index - 1]?.price - 1) * 100).toFixed(2)
      ),
    };
  });

  const splitter = username.split(".");
  const firstName = splitter[0];
  const uniqueName = splitter[1];

  return (
    <>
      <div>
        {firstName}
        <span className="opacity-25">#{uniqueName}</span>
      </div>
      {apple > 0 && (
        <div className="flex gap-1">
          Your total apple consumption:
          <span className="text-red-500">{apple}</span> kg
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-16 scale-75 sm:scale-100">
        <LineChart
          width={400}
          height={400}
          data={growth}
          margin={{
            top: 20,
            right: 20,
            left: -20,
            bottom: 20,
          }}
        >
          <XAxis
            dataKey="period"
            label={{ value: "Period", position: "bottom" }}
          />
          <YAxis />
          <Tooltip contentStyle={{ background: "black" }} />
          <Legend verticalAlign="top" height={36} />
          <Line
            dot={false}
            type="monotone"
            dataKey="money"
            name="Money Growth"
            stroke="#8884d8"
          />
          <Line
            dot={false}
            type="monotone"
            dataKey="price"
            name="Inflation"
            stroke="#82ca9d"
          />
        </LineChart>
        <LineChart
          width={400}
          height={400}
          data={plain}
          margin={{
            top: 20,
            right: 20,
            left: -20,
            bottom: 20,
          }}
        >
          <XAxis
            dataKey="period"
            label={{ value: "Period", position: "bottom" }}
          />
          <YAxis />
          <Tooltip contentStyle={{ background: "black" }} />
          <Legend verticalAlign="top" height={36} />
          <Line
            dot={false}
            type="monotone"
            dataKey="velocity"
            name="Velocity"
            stroke="#8884d8"
          />
        </LineChart>
      </div>
      <div className="text-2xl py-2">TEDU ERU</div>
      <Button asChild variant="secondary">
        <a href="https://sites.google.com/view/erutedu/home">About us</a>
      </Button>
    </>
  );
}
