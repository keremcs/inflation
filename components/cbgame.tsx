"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// export default function CBGame() {
//   const [gameKey, setGameKey] = useState<number>(7);
//   const [gameMode, setGameMode] = useState<boolean>(true);
//   return (
//     <div className="flex flex-col items-center justify-center gap-3">
//       {gameMode ? (
//         <>
//           <div className="flex p-4 text-2xl md:text-4xl">
//             Interest Rate Version
//           </div>
//           <div className="flex gap-3">
//             <Button
//               variant="secondary"
//               onClick={() => {
//                 setGameMode(false);
//                 setGameKey(Math.random());
//               }}
//             >
//               Money Growth Version
//             </Button>
//             <Button
//               variant="secondary"
//               onClick={() => setGameKey(Math.random())}
//             >
//               Play Again
//             </Button>
//           </div>
//           <Game key={gameKey} mg={false} />
//         </>
//       ) : (
//         <>
//           <div className="flex p-4 text-2xl md:text-4xl">
//             Money Growth Version
//           </div>
//           <div className="flex gap-3">
//             <Button
//               variant="secondary"
//               onClick={() => {
//                 setGameMode(true);
//                 setGameKey(Math.random());
//               }}
//             >
//               Interest Rate Version
//             </Button>
//             <Button
//               variant="secondary"
//               onClick={() => setGameKey(Math.random())}
//             >
//               Play Again
//             </Button>
//           </div>
//           <Game key={gameKey} mg={true} />
//         </>
//       )}
//     </div>
//   );
// }

function DataTable(props: {
  version: string;
  p: number;
  i0: number;
  i1?: number;
  i2?: number;
  i3?: number;
  i4?: number;
  o0?: number;
  o1?: number;
  o2?: number;
  o3?: number;
  o4?: number;
  r0?: number;
  r1?: number;
  r2?: number;
  r3?: number;
  r4?: number;
  hidden?: string;
}) {
  return (
    <div className="flex px-6">
      <table className="table-auto border text-center text-xs sm:text-xl md:text-2xl">
        <thead>
          <tr>
            <th className="p-3">Period</th>
            <th className="p-3">{props.version}</th>
            <th className="p-3">Inflation</th>
            <th className="p-3">Output Gap</th>
          </tr>
        </thead>
        <tbody className="break-all">
          <tr className="bg-secondary">
            <td>0</td>
            <td>{props.r0}%</td>
            <td>{props.i0}%</td>
            <td>{props.o0 ?? 0}%</td>
          </tr>
          {props.p > 1 && (
            <tr>
              <td>1</td>
              <td className={props.hidden}>{props.r1}%</td>
              <td className={props.hidden}>{props.i1}%</td>
              <td className={props.hidden}>{props.o1}%</td>
            </tr>
          )}
          {props.p > 2 && (
            <tr className="bg-secondary">
              <td>2</td>
              <td className={props.hidden}>{props.r2}%</td>
              <td className={props.hidden}>{props.i2}%</td>
              <td className={props.hidden}>{props.o2}%</td>
            </tr>
          )}
          {props.p > 3 && (
            <tr>
              <td>3</td>
              <td className={props.hidden}>{props.r3}%</td>
              <td className={props.hidden}>{props.i3}%</td>
              <td className={props.hidden}>{props.o3}%</td>
            </tr>
          )}
          {props.p === 5 && (
            <tr className="bg-secondary">
              <td>4</td>
              <td className={props.hidden}>{props.r4}%</td>
              <td className={props.hidden}>{props.i4}%</td>
              <td className={props.hidden}>{props.o4}%</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function CBGame(props: { mg: boolean }) {
  const initialValues = {
    period: 1,
    inflation0: 8,
    inflation1: 0,
    inflation2: 0,
    inflation3: 0,
    inflation4: 0,
    og0: 0,
    og1: 0,
    og2: 0,
    og3: 0,
    og4: 0,
    rate0: 9,
    rate1: 0,
    rate2: 0,
    rate3: 0,
    rate4: 0,
    score: 7,
    bestScore: 7,
  };

  const initialStats = {
    games: 0,
    average: 0,
    maxScore: 0,
  };

  const getGameState =
    localStorage.getItem("gameState") ?? JSON.stringify(initialValues);
  const gameState: typeof initialValues = JSON.parse(getGameState);

  const getStats =
    localStorage.getItem("stats") ?? JSON.stringify(initialStats);
  const stats: typeof initialStats = JSON.parse(getStats);

  const [period, setPeriod] = useState<number>(gameState.period);
  const [inflation0, setInflation0] = useState<number>(gameState.inflation0);
  const [inflation1, setInflation1] = useState<number>(gameState.inflation1);
  const [inflation2, setInflation2] = useState<number>(gameState.inflation2);
  const [inflation3, setInflation3] = useState<number>(gameState.inflation3);
  const [inflation4, setInflation4] = useState<number>(gameState.inflation4);
  const [og0, setOg0] = useState<number>(gameState.og0);
  const [og1, setOg1] = useState<number>(gameState.og1);
  const [og2, setOg2] = useState<number>(gameState.og2);
  const [og3, setOg3] = useState<number>(gameState.og3);
  const [og4, setOg4] = useState<number>(gameState.og4);
  const [rate0, setRate0] = useState<number>(gameState.rate0);
  const [rate1, setRate1] = useState<number>(gameState.rate1);
  const [rate2, setRate2] = useState<number>(gameState.rate2);
  const [rate3, setRate3] = useState<number>(gameState.rate3);
  const [rate4, setRate4] = useState<number>(gameState.rate4);
  const [score, setScore] = useState<number>(gameState.score);
  const [bestScore, setBestScore] = useState<number>(gameState.bestScore);
  const [gameStats, setGameStats] = useState(stats);

  const iRandom = () => {
    const rand = parseFloat((Math.random() * 10).toFixed(2));
    const min1 = rand < 1 ? 1 : rand;
    setInflation0(min1);
    const nir = parseFloat((min1 + 1).toFixed(2));
    setRate0(nir);
  };

  const mgRandom = () => {
    const rand = parseFloat((Math.random() * 10).toFixed(2));
    const imin1 = rand < 1 ? 1 : rand;
    setInflation0(imin1);
  };

  function irFormula(r: number, i: number) {
    const og = i - r + 1;
    const inf = i + og;
    const tog = parseFloat(og.toFixed(2));
    const tinf = parseFloat(inf.toFixed(2));
    return { tog, tinf };
  }

  function mgFormula(m: number, i: number, o: number) {
    const inf = (0.25 * i + 0.75 * (2 * m + o)) / 1.75;
    const og = m - inf + o;
    const tinf = parseFloat(inf.toFixed(2));
    const tog = parseFloat(og.toFixed(2));
    return { tinf, tog };
  }

  const result = (inf: number, og: number) => {
    const calc =
      200 -
      Math.pow(inflation1 - 2, 2) -
      Math.pow(inflation2 - 2, 2) -
      Math.pow(inflation3 - 2, 2) -
      Math.pow(inf - 2, 2) +
      5 * og1 +
      5 * og2 +
      5 * og3 +
      5 * og;
    const min0 = calc < 0 ? 0 : calc;
    setScore(min0);

    const res1 = irFormula(2 * inflation0 - 1, inflation0);
    const res2 = irFormula(3, res1.tinf);
    const res3 = irFormula(3, res2.tinf);
    const res4 = irFormula(0.5, res3.tinf);
    const findBestScore =
      200 -
      Math.pow(res1.tinf - 2, 2) -
      Math.pow(res2.tinf - 2, 2) -
      Math.pow(res3.tinf - 2, 2) -
      Math.pow(res4.tinf - 2, 2) +
      5 * res1.tog +
      5 * res2.tog +
      5 * res3.tog +
      5 * res4.tog;
    setBestScore(findBestScore);

    if (!props.mg) {
      const wizard = {
        games: stats.games + 1,
        average:
          (stats.average * stats.games + min0 / findBestScore) /
          (stats.games + 1),
        maxScore: min0 > stats.maxScore ? min0 : stats.maxScore,
      };
      setGameStats(wizard);
      localStorage.setItem("stats", JSON.stringify(wizard));
    }

    localStorage.setItem(
      "gameState",
      JSON.stringify({
        ...gameState,
        period: 5,
        inflation4: inf,
        og4: og,
        rate4: rate4,
        score: min0,
        bestScore: findBestScore,
      })
    );

    return setPeriod(5);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {period === 1 && (
        <>
          {!props.mg && (
            <div>Neutral real rate is assumed to be 1 per cent</div>
          )}
          <div>Inflation target is 2 per cent</div>
          <DataTable
            version={props.mg ? "Money Growth" : "Nominal Interest Rate"}
            p={period}
            i0={inflation0}
            r0={props.mg ? inflation0 : rate0}
            o0={og0}
          />
          {/* <Button variant="secondary" onClick={props.mg ? mgRandom : iRandom}>
            <div className="mr-2">🎲</div> initial conditions
          </Button> */}
          <div className="text-red-500 md:text-2xl">
            Your rate decision: {rate1}%
          </div>
          <div className="flex flex-row gap-3 max-w-[190px]">
            <Input
              id="r1"
              placeholder="Enter rate"
              type="number"
              onChange={(e) => {
                if (e.target.value !== "") {
                  setRate1(parseFloat(e.target.value));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const data = props.mg
                    ? mgFormula(rate1, inflation0, og0)
                    : irFormula(rate1, inflation0);
                  setInflation1(data.tinf);
                  setOg1(data.tog);
                  setPeriod(2);
                  localStorage.setItem(
                    "gameState",
                    JSON.stringify({
                      ...gameState,
                      period: 2,
                      inflation1: data.tinf,
                      og1: data.tog,
                      rate1: rate1,
                    })
                  );
                }
              }}
            />
            <Button
              onClick={() => {
                const data = props.mg
                  ? mgFormula(rate1, inflation0, og0)
                  : irFormula(rate1, inflation0);
                setInflation1(data.tinf);
                setOg1(data.tog);
                setPeriod(2);
                localStorage.setItem(
                  "gameState",
                  JSON.stringify({
                    ...gameState,
                    period: 2,
                    inflation1: data.tinf,
                    og1: data.tog,
                    rate1: rate1,
                  })
                );
              }}
            >
              Next
            </Button>
          </div>
        </>
      )}
      {period === 2 && (
        <>
          <DataTable
            version={props.mg ? "Money Growth" : "Nominal Interest Rate"}
            p={period}
            i0={inflation0}
            i1={inflation1}
            o0={og0}
            o1={og1}
            r0={props.mg ? inflation0 : rate0}
            r1={rate1}
          />
          <div className="text-red-500 md:text-2xl">
            Your rate decision: {rate2}%
          </div>
          <div className="flex flex-row gap-3 max-w-[190px]">
            <Input
              id="r2"
              placeholder="Enter rate"
              type="number"
              onChange={(e) => {
                if (e.target.value !== "") {
                  setRate2(parseFloat(e.target.value));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const data = props.mg
                    ? mgFormula(rate2, inflation1, og1)
                    : irFormula(rate2, inflation1);
                  setInflation2(data.tinf);
                  setOg2(data.tog);
                  setPeriod(3);
                  localStorage.setItem(
                    "gameState",
                    JSON.stringify({
                      ...gameState,
                      period: 3,
                      inflation2: data.tinf,
                      og2: data.tog,
                      rate2: rate2,
                    })
                  );
                }
              }}
              autoFocus
            />
            <Button
              onClick={() => {
                const data = props.mg
                  ? mgFormula(rate2, inflation1, og1)
                  : irFormula(rate2, inflation1);
                setInflation2(data.tinf);
                setOg2(data.tog);
                setPeriod(3);
                localStorage.setItem(
                  "gameState",
                  JSON.stringify({
                    ...gameState,
                    period: 3,
                    inflation2: data.tinf,
                    og2: data.tog,
                    rate2: rate2,
                  })
                );
              }}
            >
              Next
            </Button>
          </div>
        </>
      )}
      {period === 3 && (
        <>
          <DataTable
            version={props.mg ? "Money Growth" : "Nominal Interest Rate"}
            p={period}
            i0={inflation0}
            i1={inflation1}
            i2={inflation2}
            o0={og0}
            o1={og1}
            o2={og2}
            r0={props.mg ? inflation0 : rate0}
            r1={rate1}
            r2={rate2}
          />
          <div className="text-red-500 md:text-2xl">
            Your rate decision: {rate3}%
          </div>
          <div className="flex flex-row gap-3 max-w-[190px]">
            <Input
              id="r3"
              placeholder="Enter rate"
              type="number"
              onChange={(e) => {
                if (e.target.value !== "") {
                  setRate3(parseFloat(e.target.value));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const data = props.mg
                    ? mgFormula(rate3, inflation2, og2)
                    : irFormula(rate3, inflation2);
                  setInflation3(data.tinf);
                  setOg3(data.tog);
                  setPeriod(4);
                  localStorage.setItem(
                    "gameState",
                    JSON.stringify({
                      ...gameState,
                      period: 4,
                      inflation3: data.tinf,
                      og3: data.tog,
                      rate3: rate3,
                    })
                  );
                }
              }}
              autoFocus
            />
            <Button
              onClick={() => {
                const data = props.mg
                  ? mgFormula(rate3, inflation2, og2)
                  : irFormula(rate3, inflation2);
                setInflation3(data.tinf);
                setOg3(data.tog);
                setPeriod(4);
                localStorage.setItem(
                  "gameState",
                  JSON.stringify({
                    ...gameState,
                    period: 4,
                    inflation3: data.tinf,
                    og3: data.tog,
                    rate3: rate3,
                  })
                );
              }}
            >
              Next
            </Button>
          </div>
        </>
      )}
      {period === 4 && (
        <>
          <DataTable
            version={props.mg ? "Money Growth" : "Nominal Interest Rate"}
            p={period}
            i0={inflation0}
            i1={inflation1}
            i2={inflation2}
            i3={inflation3}
            o0={og0}
            o1={og1}
            o2={og2}
            o3={og3}
            r0={props.mg ? inflation0 : rate0}
            r1={rate1}
            r2={rate2}
            r3={rate3}
          />
          <div className="text-red-500 md:text-2xl">
            Your rate decision: {rate4}%
          </div>
          <div className="flex flex-row gap-3 max-w-[190px]">
            <Input
              id="r4"
              placeholder="Enter rate"
              type="number"
              onChange={(e) => {
                if (e.target.value !== "") {
                  setRate4(parseFloat(e.target.value));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const data = props.mg
                    ? mgFormula(rate4, inflation3, og3)
                    : irFormula(rate4, inflation3);
                  setInflation4(data.tinf);
                  setOg4(data.tog);
                  result(data.tinf, data.tog);
                }
              }}
              autoFocus
            />
            <Button
              onClick={() => {
                const data = props.mg
                  ? mgFormula(rate4, inflation3, og3)
                  : irFormula(rate4, inflation3);
                setInflation4(data.tinf);
                setOg4(data.tog);
                result(data.tinf, data.tog);
              }}
            >
              Next
            </Button>
          </div>
        </>
      )}
      {period === 5 && (
        <>
          <DataTable
            version={props.mg ? "Money Growth" : "Interest Rate"}
            p={period}
            i0={inflation0}
            i1={inflation1}
            i2={inflation2}
            i3={inflation3}
            i4={inflation4}
            o0={og0}
            o1={og1}
            o2={og2}
            o3={og3}
            o4={og4}
            r0={props.mg ? inflation0 : rate0}
            r1={rate1}
            r2={rate2}
            r3={rate3}
            r4={rate4}
          />
          <div className="break-all text-2xl sm:text-4xl text-center font-bold">
            {score > 0 ? (
              <div className="flex flex-row gap-2">
                Score:
                <span className="flex text-green-500">
                  {parseFloat(score.toFixed(2))}
                </span>
                {!props.mg && (
                  <span className="flex items-center text-base">
                    {score / bestScore >= 1 ? (
                      "🎉 Best Score!"
                    ) : (
                      <span className="flex items-center text-base">
                        ({parseFloat(((score / bestScore) * 100).toFixed(1))}%)
                      </span>
                    )}
                  </span>
                )}
              </div>
            ) : (
              <div>
                Score: <span className="text-red-500">0</span>
              </div>
            )}
          </div>
          {!props.mg && gameStats && (
            <div className="flex text-center text-xs sm:text-base gap-3 px-3">
              <div className="flex flex-col items-center">
                <div className="flex">Total Games</div>
                <div className="flex text-xl sm:text-2xl">
                  {gameStats.games}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex">Total Performance</div>
                <div className="flex text-xl sm:text-2xl">
                  {(gameStats.average * 100).toFixed(1)}%
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex">Maximum Score</div>
                <div className="flex text-xl sm:text-2xl">
                  {gameStats.maxScore.toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
