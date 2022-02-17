import {
  forwardRef,
  ForwardRefRenderFunction,
  InputHTMLAttributes
} from 'react';

import { FieldError } from 'react-hook-form';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelFor: string;
  fillAttributes?: boolean;
  error?: FieldError;
  additionalStyles?: string;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { label, labelFor, fillAttributes, additionalStyles, error, ...rest },
  ref
) => {
  const inputAttributes = {
    id: labelFor
  };

  return (
    <div className={additionalStyles}>
      <label htmlFor={labelFor} className="sr-only">
        {label}
      </label>
      <input
        type="text"
        className={`
          bg-neutral-800
          px-4
          py-2
          w-full
          border-[1px]
          ${!!error ? 'border-red-600' : 'border-transparent'}
          rounded
        `}
        ref={ref}
        {...(fillAttributes ? inputAttributes : {})}
        {...rest}
      />

      {!!error && (
        <span
          className={`
        text-red-600
        text-sm
        mt-2
        inline-block
      `}
        >
          {error.message}
        </span>
      )}
    </div>
  );
};

export const Input = forwardRef(InputBase);
