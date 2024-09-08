"use client";

import Link from "next/link";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useState, useEffect } from "react";
import generateProblem from "@/lib/math";

const digitsOptions = [2, 3, 4, 5, 6];
const operatorOptions = ["+", "-", "*"];
const unknownIndexOptions = [0, 1, 2, "r"];
const timeLimitOptions = [-1, 60, 40, 30, 20, 10, 5, 3];

export default function Home() {
  const [totalDigits, setTotalDigits] = useState(null);
  const [operator, setOperator] = useState(null);
  const [allowNegative, setAllowNegative] = useState(null);
  const [unknownIndex, setUnknownIndex] = useState(null);
  const [sfx, setSfx] = useState(null);
  const [timeLimit, setTimeLimit] = useState(null);
  const [example, setExample] = useState("");

  useEffect(() => {
    if (totalDigits !== null) localStorage.setItem("totalDigits", totalDigits);
  }, [totalDigits]);

  useEffect(() => {
    if (operator !== null) localStorage.setItem("operator", operator);
  }, [operator]);

  useEffect(() => {
    if (allowNegative !== null)
      localStorage.setItem("allowNegative", allowNegative);
  }, [allowNegative]);

  useEffect(() => {
    if (unknownIndex !== null)
      localStorage.setItem("unknownIndex", unknownIndex);
  }, [unknownIndex]);

  useEffect(() => {
    if (timeLimit !== null) localStorage.setItem("timeLimit", timeLimit);
  }, [timeLimit]);

  useEffect(() => {
    if (sfx !== null) localStorage.setItem("sfx", sfx);
  }, [sfx]);

  useEffect(() => {
    setTotalDigits(parseInt(localStorage.getItem("totalDigits")) || 4);
    setOperator(localStorage.getItem("operator") || "+");
    setAllowNegative(localStorage.getItem("allowNegative") === "true");
    // setUnknownIndex(parseInt(localStorage.getItem("unknownIndex")) || 2);
    setUnknownIndex(
      localStorage.getItem("unknownIndex") === "r"
        ? "r"
        : parseInt(localStorage.getItem("unknownIndex")) || 2
    );
    setTimeLimit(parseInt(localStorage.getItem("timeLimit")) || -1);
    setSfx(localStorage.getItem("sfx") === "true");
  }, []);

  useEffect(() => {
    if (
      totalDigits &&
      operator &&
      allowNegative !== null &&
      unknownIndex !== null
    )
      setExample(generateExample());
  }, [totalDigits, operator, allowNegative, unknownIndex]);

  function generateExample() {
    const { problem } = generateProblem(
      totalDigits % 2 === 0 ? totalDigits / 2 : (totalDigits + 1) / 2,
      totalDigits % 2 === 0 ? totalDigits / 2 : (totalDigits - 1) / 2,
      operator,
      allowNegative,
      unknownIndex === "r" ? Math.floor(Math.random() * 3) : unknownIndex
    );
    return problem;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 font-jbmono bg-background">
      <h1 className="text-2xl font-bold text-primary">math game</h1>
      <p className="text-muted-foreground text-center">
        decrust your quick math skills
      </p>
      <div className="flex flex-col items-center justify-center mt-6 w-3/4 md:w-1/2 lg:w-1/4">
        {/* <div className="flex flex-row items-center justify-center w-full">
          <div className="w-1/2 h-px bg-muted-foreground"></div>
          <div className="mx-4 text-muted-foreground text-center">or</div>
          <div className="w-1/2 h-px bg-muted-foreground"></div>
        </div> */}
        <div className="flex flex-col items-center justify-center w-full p-4 rounded-lg border">
          <h2 className="w-full text-left">config</h2>
          <button
            className="flex flex-row items-center justify-between w-full mt-4 px-4 py-2 rounded-lg border text-sm hover:bg-secondary active:bg-primary active:text-background transition-colors duration-100"
            onClick={() =>
              setOperator(
                (operator) =>
                  operatorOptions[
                    (operatorOptions.indexOf(operator) + 1) %
                      operatorOptions.length
                  ]
              )
            }
          >
            <span>operator</span>
            <span>{operator}</span>
          </button>
          <button
            className="flex flex-row items-center justify-between w-full mt-2 px-4 py-2 rounded-lg border text-sm hover:bg-secondary active:bg-primary active:text-background transition-colors duration-100"
            onClick={() =>
              setTotalDigits(
                (totalDigits) =>
                  digitsOptions[
                    (digitsOptions.indexOf(totalDigits) + 1) %
                      digitsOptions.length
                  ]
              )
            }
          >
            <span>max total digits</span>
            <span>{totalDigits}</span>
          </button>
          <button
            className="flex flex-row items-center justify-between w-full mt-2 px-4 py-2 rounded-lg border text-sm hover:bg-secondary active:bg-primary active:text-background transition-colors duration-100"
            onClick={() => setAllowNegative((allowNegative) => !allowNegative)}
          >
            <span>allow negatives</span>
            <span>{allowNegative ? "yes" : "no"}</span>
          </button>
          <button
            className="flex flex-row items-center justify-between w-full mt-2 px-4 py-2 rounded-lg border text-sm hover:bg-secondary active:bg-primary active:text-background transition-colors duration-100"
            onClick={() =>
              setUnknownIndex(
                (unknownIndex) =>
                  unknownIndexOptions[
                    (unknownIndexOptions.indexOf(unknownIndex) + 1) %
                      unknownIndexOptions.length
                  ]
              )
            }
          >
            <span>unknown index</span>
            <span>{unknownIndex === "r" ? "random" : unknownIndex + 1}</span>
          </button>
          <p
            className="text-muted-foreground text-left mt-4 w-full cursor-pointer select-none text-sm md:text-base"
            onClick={() => setExample(generateExample())}
          >
            e.g. {example}
          </p>
          <button
            className="flex flex-row items-center justify-between w-full mt-4 px-4 py-2 rounded-lg border text-sm hover:bg-secondary active:bg-primary active:text-background transition-colors duration-100"
            onClick={() =>
              setTimeLimit(
                (timeLimit) =>
                  timeLimitOptions[
                    (timeLimitOptions.indexOf(timeLimit) + 1) %
                      timeLimitOptions.length
                  ]
              )
            }
          >
            <span>time limit</span>
            <span>{timeLimit === -1 ? "ထ" : timeLimit + "s"}</span>
          </button>
          <button
            className="flex flex-row items-center justify-between w-full mt-2 px-4 py-2 rounded-lg border text-sm hover:bg-secondary active:bg-primary active:text-background transition-colors duration-100"
            onClick={() => setSfx((sfx) => !sfx)}
          >
            <span>ui sfx</span>
            <span>{sfx ? "on" : "off"}</span>
          </button>
        </div>
        <Button className="font-bold w-full mt-6" size="lg" asChild>
          <Link href={`/game?t=${timeLimit}`}>
            play <ArrowRight size={16} className="ml-2" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
