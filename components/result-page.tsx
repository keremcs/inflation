"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

type Logs = {
  balances: number;
  expenditure: number;
  period: number;
  price: number;
}[];

export default function ResultPage({ data }: { data: Logs }) {
  const plain = data.map((item) => {
    return {
      period: item.period,
      money: parseFloat((item.balances + item.expenditure).toFixed(2)),
      expenditure: item.expenditure,
      price: item.price,
      eoverm: parseFloat(
        (item.expenditure / (item.balances + item.expenditure)).toFixed(2)
      ),
    };
  });

  const log = plain.map((item) => {
    return {
      period: item.period,
      money: parseFloat(Math.log(item.money).toFixed(2)),
      expenditure: parseFloat(Math.log(item.expenditure).toFixed(2)),
      price: parseFloat(Math.log(item.price).toFixed(2)),
    };
  });

  const growth = plain.map((item, index) => {
    if (index === 0) {
      return {
        period: 0,
        money: 0,
        price: 0,
      };
    }

    return {
      period: item.period,
      money: parseFloat(
        Math.log(item.money / plain[index - 1]?.money).toFixed(2)
      ),
      price: parseFloat(
        Math.log(item.price / plain[index - 1]?.price).toFixed(2)
      ),
    };
  });

  return (
    <>
      <div className="flex flex-wrap justify-center gap-16 scale-75 sm:scale-100">
        <LineChart
          width={400}
          height={400}
          data={log}
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
          <Legend verticalAlign="top" />
          <Line
            dot={false}
            type="monotone"
            dataKey="money"
            name="Money"
            stroke="#8884d8"
          />
          <Line
            dot={false}
            type="monotone"
            dataKey="price"
            name="Price"
            stroke="#82ca9d"
          />
        </LineChart>
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
          <Legend verticalAlign="top" />
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
      </div>
      <div className="flex flex-wrap justify-center gap-16 scale-75 sm:scale-100">
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
          <Legend verticalAlign="top" />
          <Line
            dot={false}
            type="monotone"
            dataKey="expenditure"
            name="Expenditure"
            stroke="#8884d8"
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
          <Legend verticalAlign="top" />
          <Line
            dot={false}
            type="monotone"
            dataKey="eoverm"
            name="Expenditure/Money"
            stroke="#8884d8"
          />
        </LineChart>
      </div>
    </>
  );
}
