import React from "react";

export type Props<T extends React.SelectHTMLAttributes<HTMLSelectElement>["value"]> = {
  value?: T;
  onChange: (value: T) => void;
  candidates: Array<T>;
};

export const SimpleSelect = <T extends React.SelectHTMLAttributes<HTMLSelectElement>["value"]>(
  props: Props<T>
) => {
  return (
    <select value={props.value} onChange={(e) => props.onChange(e.target.value as T)}>
      {props.candidates.map((candidate, index) => (
        <option key={index} value={candidate}>
          {candidate}
        </option>
      ))}
    </select>
  );
};
