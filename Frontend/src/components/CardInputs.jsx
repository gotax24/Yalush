const CardInput = ({
  formData,
  functionChange,
  errors,
  placeholder,
  maxLength,
  name,
  className,
  type,
  id,
}) => {
  return (
    <>
      <input
        id={id}
        className={className}
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData}
        maxLength={maxLength}
        onChange={functionChange}
      />
      {errors && <span className="error">{errors}</span>}
    </>
  );
};

export default CardInput;
