const HandleInputChange = (name, value, setState) => {
  setState((prevInfo) => ({
    ...prevInfo,
    [name]: value,
  }));
};

export default HandleInputChange;
