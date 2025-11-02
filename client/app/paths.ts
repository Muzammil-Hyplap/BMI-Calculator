export const paths = {
  home: '/',
  auth: { signIn: '/sign-in', signUp: '/sign-up'},
  dashboard: {
    overview: '/',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
  },
  api:{
      get:{
          bmi:'/bmi',
      }
  },
  errors: { notFound: '/errors/not-found' },
} as const;
