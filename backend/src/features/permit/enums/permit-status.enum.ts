enum PermitStatus {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
  DUPLICATED = 3,
}

export const getPermitStatusLabel = (
  permitStatus: PermitStatus,
) => {
  switch (permitStatus) {
    case PermitStatus.PENDING:
      return "Pending";
    case PermitStatus.APPROVED:
      return "Approved";
    case PermitStatus.REJECTED:
      return "Rejected";
    case PermitStatus.DUPLICATED:
      return "Duplicated";
    default:
      return "Unknown";
  }
};

export const getPermitStatusEnums = () => {
  const enums = Object.entries(PermitStatus);
  const result = [];

  for (const [key, value] of enums) {
    if (typeof value === "number") {
      result.push({
        id: value,
        name: getPermitStatusLabel(+value),
      });
    }
  }
  return result;
};
export default PermitStatus;
