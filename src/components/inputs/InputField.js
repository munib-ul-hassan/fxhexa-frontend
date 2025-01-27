import React from "react";

const InputField = ({
  className = "",
  label = "",
  placeholder = "Placeholder",
  type = "text",
  name = "name",
  value = "",
  onChange = () => {},
  required = false,
  height,
  multiple,
  labelColor = "text-slate-900 ",
  disabled,
  onBlur,
}) => {
  return (
    <div className={className}>
      {label && (
        <label
          className={`block mb-1 text-sm font-semibold font-montserrat ${labelColor} dark:text-slate-300`}
        >
          {label}
        </label>
      )}
      <input
        onBlur={onBlur}
        disabled={disabled}
        type={type}
        name={name}
        className={`bg-gray-50 dark:bg-gray-700 border-[2px] border-gray-300 text-gray-500 dark:text-gray-300 text-sm font-montserrat rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1 ${height}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        multiple={multiple}
      />
    </div>
  );
};

export default InputField;
