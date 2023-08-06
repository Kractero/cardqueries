'use client'

import React, { useState } from "react";

interface Props {
  child: React.ReactNode;
  name: string;
  max?: number;
  nullable?: boolean
}

interface InputData {
  include: boolean;
}

export function MultipleInput({ child, name, max, nullable }: Props) {
  const [inputs, setInputs] = useState<InputData[]>([{ include: true}]);

  const addInput = () => {
    if (max && inputs.length < max) {
      setInputs([...inputs, { include: true}]);
    }
    if (!max) setInputs([...inputs, { include: true}]);
  };

  const toggleInclude = (index: number) => {
    const updatedInputs = [...inputs];
    updatedInputs[index].include = !updatedInputs[index].include;
    setInputs(updatedInputs);
  };

  return (
    <div className="flex gap-4 items-center">
      <div className="flex flex-col gap-2">
        {inputs.map((input, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center gap-4">
              {nullable == undefined ? <div className="flex items-center justify-center flex-col">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    toggleInclude(index)
                  }}
                  className={`bg-red-600 h-6 w-6 transition duration-300 hover:scale-110 ${
                    input.include ? "opacity-50" : ""
                  }`}
                >
                  !
                </button>
              </div> : <div className="h-6 w-6 "></div>}
              {React.cloneElement(child as React.ReactElement<any>, {
                include: input.include,
                name: index > 0 ? `${name}${index}` : name,
                key: index,
                idx: index,
              })}
            </div>
          </React.Fragment>
        ))}
      </div>
      <button
        data-umami-event={`${name} row added`}
        className="text-lg bold"
        onClick={(e) => {
          e.preventDefault();
          addInput();
        }}
      >
        +
      </button>
    </div>
  );
}