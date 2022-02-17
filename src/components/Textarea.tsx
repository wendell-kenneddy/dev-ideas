import {
  forwardRef,
  ForwardRefRenderFunction,
  TextareaHTMLAttributes
} from 'react';

import { FieldError } from 'react-hook-form';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  labelFor: string;
  fillAttributes?: boolean;
  error?: FieldError;
  additionalStyles?: string;
}

const TextareaBase: ForwardRefRenderFunction<
  HTMLTextAreaElement,
  TextareaProps
> = (
  { label, labelFor, fillAttributes, additionalStyles, error, ...rest },
  ref
) => {
  const textareaAttributes = {
    id: labelFor
  };

  return (
    <div className={additionalStyles}>
      <label htmlFor={labelFor} className="sr-only">
        {label}
      </label>
      <textarea
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
        {...(fillAttributes ? textareaAttributes : {})}
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

export const Textarea = forwardRef(TextareaBase);
