import React from 'react';
import CreateUserForm from '../../components/CreateUserForm';

const CreateAdmin: React.FC = () => {
  return (
    <CreateUserForm
      userType="admin"
      title="Create New Admin"
      redirectPath="/admin/admin-settings"
    />
  );
};

export default CreateAdmin;
