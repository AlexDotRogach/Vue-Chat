const phoneTemplate = (phone) => {
  let templatePhone = "";

  for (let i = 0; i < phone.length; i++) {
    switch (`${i}`) {
      case "0":
        templatePhone += "(";
        break;
      case "3":
        templatePhone += ") ";
        break;
      case "6":
        templatePhone += "-";
        break;
      case "8":
        templatePhone += "-";
        break;
    }

    templatePhone += phone[i];
  }

  return templatePhone;
};

export default phoneTemplate;
