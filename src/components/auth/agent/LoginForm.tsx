import React from 'react';
import {
  AuthSplitPage,
  AuthHeader,
  AuthPrimaryButton,
} from '../shared/AuthLayout';

export default function AgentLoginForm() {
  return (
    <AuthSplitPage>
      <AuthHeader
        title="Agent sign in"
        subtitle="Agent login will be available soon."
      />
      <AuthPrimaryButton type="button" disabled>
        Coming soon
      </AuthPrimaryButton>
    </AuthSplitPage>
  );
}
