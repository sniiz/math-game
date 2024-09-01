"use client";

import { ArrowLeft, ArrowRight, Delete } from "lucide-react";

import { useEffect, useState, Suspense } from "react";

import { Button } from "@/components/ui/button";

import generateProblem from "@/lib/math";
import { useParams, useSearchParams } from "next/navigation";

function Home() {
  const searchParams = useSearchParams();
  // const totalDigitsInit = parseInt(searchParams.get("d")) || 4;
  // const operatorInit = ["+", "-", "*"][searchParams.get("o") || 0];
  // const allowNegativeInit = searchParams.get("n") === "1";
  // const unknownIndexInit = parseInt(searchParams.get("u")) || 2;
  const timeLimitInit = parseInt(searchParams.get("t")) || -1;
  // const timeLimitInit = 20;

  const [isWrong, setIsWrong] = useState(false);

  const [problem, setProblem] = useState("");
  const [answer, setAnswer] = useState("");
  const [userAnswer, setUserAnswer] = useState("");

  const [correct, setCorrect] = useState(0);

  const [gameOver, setGameOver] = useState(false);

  // const [totalDigits, setTotalDigits] = useState(totalDigitsInit);
  // const [operator, setOperator] = useState(operatorInit);
  // const [allowNegative, setAllowNegative] = useState(allowNegativeInit);
  // const [unknownIndex, setUnknownIndex] = useState(unknownIndexInit);
  const [timeLimit, setTimeLimit] = useState(timeLimitInit);

  const [totalDigits, setTotalDigits] = useState(4);
  const [operator, setOperator] = useState("+");
  const [allowNegative, setAllowNegative] = useState(false);
  const [unknownIndex, setUnknownIndex] = useState(2);

  useEffect(() => {
    setTotalDigits(parseInt(localStorage.getItem("totalDigits") || "4"));
    setOperator(localStorage.getItem("operator") || "+");
    setAllowNegative(localStorage.getItem("allowNegative") === "true");
    setUnknownIndex(parseInt(localStorage.getItem("unknownIndex") || "2"));
    // setTimeLimit(parseInt(localStorage.getItem("timeLimit") || "-1"));
  }, []);

  const [deadline, setDeadline] = useState(0);
  const [now, setNow] = useState(0);

  const [fastestSolve, setFastestSolve] = useState({});

  useEffect(() => {
    const { problem, answer } = generateProblem(
      // totalDigits / 2,
      // totalDigits / 2,
      totalDigits % 2 === 0 ? totalDigits / 2 : (totalDigits + 1) / 2,
      totalDigits % 2 === 0 ? totalDigits / 2 : (totalDigits - 1) / 2,
      operator,
      allowNegative,
      unknownIndex === "r" ? Math.floor(Math.random() * 2) : unknownIndex
    );

    setProblem(problem);
    setAnswer(answer);
    setUserAnswer("");
    setDeadline(timeLimit === -1 ? null : Date.now() + timeLimit * 1000);
    setCorrect(0);
    // setGameOver(false);
  }, [totalDigits, operator, allowNegative, unknownIndex]);

  const checkAnswer = (ua) => {
    if (parseInt(ua) === answer) {
      setCorrect((c) => c + 1);
      setUserAnswer("");

      const solveTime =
        timeLimit === -1 ? 0 : (timeLimit * 1000 - (deadline - now)) / 1000;
      if (solveTime < fastestSolve.time || !fastestSolve.time) {
        setFastestSolve({ time: solveTime, problem });
      }

      const { problem: newProblem, answer: newAnswer } = generateProblem(
        totalDigits % 2 === 0 ? totalDigits / 2 : (totalDigits + 1) / 2,
        totalDigits % 2 === 0 ? totalDigits / 2 : (totalDigits - 1) / 2,
        operator,
        allowNegative,
        unknownIndex === "r" ? Math.floor(Math.random() * 3) : unknownIndex
      );
      setProblem(newProblem);
      setAnswer(newAnswer);
      setIsWrong(false);

      if (timeLimit !== -1) {
        setDeadline(Date.now() + timeLimit * 1000);
      }
    } else {
      if (ua.length === 0) return;
      if (ua.length >= answer.toString().length) {
        setIsWrong(true);
      } else {
        setIsWrong(false);
      }
    }
  };

  useEffect(() => {
    if (deadline !== null) {
      const interval = setInterval(() => {
        setNow(Date.now());
        if (now >= deadline) {
          setGameOver(true);
          clearInterval(interval);
        }
      }, 10);
      return () => clearInterval(interval);
    }
  }, [deadline, now]);

  const typeNumber = (number) => {
    if (isNaN(number) && number !== "-") return;
    setUserAnswer(userAnswer + number);
    checkAnswer(userAnswer + number);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      console.log(event.key);
      if (event.key === "Enter") {
        checkAnswer();
      } else if (event.key === "Backspace") {
        setUserAnswer(userAnswer.slice(0, -1));
        checkAnswer(userAnswer.slice(0, -1));
      } else if (!isNaN(event.key) || event.key === "-") {
        typeNumber(isNaN(event.key) ? event.key : parseInt(event.key));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [userAnswer]);

  if (gameOver) {
    return (
      <main className="flex h-screen flex-col items-center justify-center p-4 font-jbmono bg-background text-center">
        <div className="text-4xl font-bold text-primary mb-2">
          you got {correct} correct {correct === 0 && ":("}
        </div>
        {fastestSolve.time && (
          <div className="text-muted-foreground">
            fastest solve: {fastestSolve.problem} ({fastestSolve.time}s)
          </div>
        )}
        <div className="mt-6 w-3/4 md:w-1/2 lg:w-1/4 flex flex-col items-center justify-center">
          <Button
            className="px-4 py-2 rounded-lg flex items-center justify-center space-x-2 mt-6 w-full"
            onClick={() => {
              window.location.reload();
            }}
          >
            <span>play again</span>
            <ArrowRight />
          </Button>
          <Button
            className="px-4 py-2 rounded-lg flex items-center justify-center space-x-2 mt-2 w-full"
            onClick={() => {
              window.location.href = "/";
            }}
            variant="outline"
          >
            <ArrowLeft />
            <span>back to menu</span>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col items-center justify-between p-4 font-jbmono bg-background">
      {timeLimit !== -1 && (
        <div className="sticky top-0 w-full flex flex-row items-center justify-start h-8 font-bold">
          <div
            className="bg-primary-foreground text-background px-2 py-1 rounded-sm flex items-center justify-end transition-colors duration-100"
            style={{
              backgroundColor: (deadline - now) / 1000 < 5 ? "red" : "#f0f0f0",
              color: (deadline - now) / 1000 < 5 ? "black" : "#000",
              width: `${((deadline - now) / 1000 / timeLimit) * 100}%`,
            }}
          >
            {((deadline - now) / 1000 / timeLimit) * 100 > 25
              ? `${((deadline - now) / 1000).toFixed(
                  deadline - now < 5000 ? 2 : 1
                )}`
              : "⠀"}
          </div>
          {((deadline - now) / 1000 / timeLimit) * 100 < 25 && (
            <div
              className="text-primary-foreground ml-4"
              style={{
                color: (deadline - now) / 1000 < 5 ? "red" : "inherit",
              }}
            >
              {((deadline - now) / 1000).toFixed(2)}
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground mt-12">problem {correct + 1}</p>
        <div className="flex flex-row items-center justify-center space-x-4">
          {problem &&
            problem.split(" ").map((part, index) => {
              if (part === "?") {
                return (
                  <div
                    key={index}
                    className="text-4xl font-bold text-primary p-2 border"
                    style={{
                      backgroundColor: isWrong ? "red" : "inherit",
                      color: isWrong ? "black" : "inherit",
                    }}
                  >
                    {userAnswer || "?"}
                  </div>
                );
              }
              return (
                <div key={index} className="text-4xl font-bold text-primary">
                  {part}
                </div>
              );
            })}
        </div>
      </div>
      {/* keypad */}
      <div
        className="grid grid-cols-3 h-1/2 select-none w-full lg:w-1/2 xl:w-1/3 sticky bottom-0 pb-4 gap-2"
        tabIndex={-1}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "-", "0"].map((number) => (
          <button
            key={number}
            className="group w-full h-full"
            onMouseDown={() => typeNumber(number)}
            tabIndex={-1}
          >
            <div className="h-full rounded-lg border text-primary flex items-center justify-center group-hover:bg-secondary group-active:bg-primary group-active:text-background transition-all duration-75">
              <span className="text-2xl font-bold">{number}</span>
            </div>
          </button>
        ))}
        <button
          className="group w-full h-full"
          onClick={() => {
            setUserAnswer((prev) => prev.slice(0, -1));
            checkAnswer(userAnswer.slice(0, -1));
          }}
          tabIndex={-1}
        >
          <div className="h-full rounded-lg border text-primary flex items-center justify-center group-hover:bg-secondary group-active:bg-primary group-active:text-background transition-all duration-75">
            <Delete />
          </div>
        </button>
      </div>
    </main>
  );
}

export default function HomeWrapper() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Home />
    </Suspense>
  );
}
