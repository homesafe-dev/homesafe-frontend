import React from 'react';
import CreateUserForm from '../../components/CreateUserForm';

const CreateEmployer: React.FC = () => {
  return (
    <CreateUserForm
      userType="employer"
      title="Create New Employer"
      redirectPath="/admin/dashboard"
    />
  );
};

export default CreateEmployer;
