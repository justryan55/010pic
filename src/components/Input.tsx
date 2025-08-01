import React from "react";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ id, type = "text", placeholder, ...rest }, ref) => {
  return (
    <input
      ref={ref}
      id={id}
      type={type}
      placeholder={placeholder}
      {...rest}
      className="bg-white border border-white h-12 w-full h-[42px] px-4 placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
    />
  );
});

Input.displayName = "Input";

export default Input;

// import React from "react";

// type InputProps = {
//   id: string;
//   type: string;
//   placeholder: string;
//   value?: string;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
// };
// export default function Input({
//   id,
//   type,
//   placeholder,
//   onChange,
//   value,
// }: InputProps) {
//   return (
//     <input
//       id={id}
//       type={type}
//       placeholder={placeholder}
//       value={value}
//       onChange={onChange}
//       className="bg-white border border-white h-12 w-full h-[42px] px-4 placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
//     />
//   );
// }
