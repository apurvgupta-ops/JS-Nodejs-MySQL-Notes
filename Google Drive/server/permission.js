const rolePermissions = {
  Admin: ["*"],
  Manager: ["read:all_files", "read:users"],
  User: ["read:own_files", "write:own_files", "delete:own_files"],
};
