"use client";

export default function Consume({
  period,
  price,
}: {
  period: number;
  price: number;
}) {
  if (period > 0) {
    localStorage.setItem(`price${period - 1}`, price.toFixed(2));
    const consumed = localStorage.getItem(`demand${period - 1}`);
    const pasti = localStorage.getItem(`price${period - 2}`) ?? "0";
    const inflation = parseFloat(
      ((price / parseFloat(pasti) - 1) * 100).toFixed(0)
    );
    return (
      <>
        <div className="flex items-center gap-1">
          Last period&apos;s apple price:
          {period > 1 && (
            <>
              <span>{parseFloat(price.toFixed(2))}</span>
              <span
                className={`text-xs sm:text-lg ${
                  inflation > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {inflation}%
              </span>
            </>
          )}
        </div>
        <div>
          You consumed {parseFloat((Number(consumed) / price).toFixed(2))} kg
          apple
        </div>
      </>
    );
  } else {
    return;
  }
}
