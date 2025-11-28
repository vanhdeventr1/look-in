enum UserRoleEnum {
  USER = 0,
  HIRING_MANAGER = 1,
  EMPLOYEE = 2,
  INTERN = 3,
}

export const getUserRoleEnumLabel = (userRoleEnum: UserRoleEnum) => {
  switch (userRoleEnum) {
    case UserRoleEnum.USER:
      return "User";
    case UserRoleEnum.HIRING_MANAGER:
      return "Hiring Manager";
    case UserRoleEnum.EMPLOYEE:
      return "Employee";
    case UserRoleEnum.INTERN:
      return "Intern";
    default:
      return "Unknown";
  }
};

export const getUserRoleEnums = () => {
  const enums = Object.entries(UserRoleEnum);
  const result = [];

  for (const [key, value] of enums) {
    if (typeof value === "number") {
      result.push({
        id: value,
        name: getUserRoleEnumLabel(+value),
      });
    }
  }
  return result;
};

export default UserRoleEnum;
