import * as React from 'react';

import { config } from '@/config';
import { Layout } from '@/components/auth/layout';
import { SignUpForm } from '@/components/auth/sign-up-form';

export const metadata = { title: `Sign in | Auth | ${config.site.name}` };

export default function Page(): React.JSX.Element {
  return (
    <Layout>
        <SignUpForm />
    </Layout>
  );
}