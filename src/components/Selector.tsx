import * as React from 'react';


interface SelectorProps<T>{
  options: T[];
  defaultValue: T;
  onChange: (value:T)=>void;
}
export const Selector = <T extends string>({options, onChange, ...props}:SelectorProps<T>) => (
  <select onChange={ e => {onChange(e.target.value as T)} } {...props}>
    {options.map(op => 
      <option key={op} value={op}>{op}</option>
    )}
  </select>
)
