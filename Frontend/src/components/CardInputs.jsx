const CardInput = ({
  formData,
  functionChange,
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
    </>
  );
};

export default CardInput;
