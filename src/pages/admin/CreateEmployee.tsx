import React from 'react';
import CreateUserForm from '../../components/CreateUserForm';

const CreateEmployee: React.FC = () => {
  return (
    <CreateUserForm
      userType="employee"
      title="Create New Employee"
      redirectPath="/admin/dashboard"
    />
  );
};

export default CreateEmployee;
