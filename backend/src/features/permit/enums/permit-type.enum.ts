enum PermitType {
  SICK = 0,
  PERMIT = 1,
  LEAVE = 2,
}

export const getPermitTypeLabel = (
  permitType: PermitType,
) => {
  switch (permitType) {
    case PermitType.SICK:
      return "Sick";
    case PermitType.PERMIT:
      return "Permit";
    case PermitType.LEAVE:
      return "Leave";
    default:
      return "Unknown";
  }
};

export const getPermitTypeEnums = () => {
  const enums = Object.entries(PermitType);
  const result = [];

  for (const [key, value] of enums) {
    if (typeof value === "number") {
      result.push({
        id: value,
        name: getPermitTypeLabel(+value),
      });
    }
  }
  return result;
};
export default PermitType;
