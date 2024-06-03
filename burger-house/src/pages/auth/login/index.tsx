import { Form, Formik } from 'formik';
import Alert from '../../../components/shared/alert';
import Button from '../../../components/shared/button';
import FormInput from '../../../components/shared/form-input';
import Heading from '../../../components/shared/heading';
import useAlert from '../../../hooks/use-alert';
import classes from './login.module.scss';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { loginInputSchema } from '../../../utils/schemas/auth/login';
import { useRouter } from 'next/router';
import { trpc } from '../../../utils/trpc';
import { NextPageWithLayout } from '../../_app';
import BaseLayout from '../../../layouts/base-layout';
import Seo from '../../../components/shared/seo';

const LoginPage: NextPageWithLayout = ({}) => {
  const context = trpc.useContext();
  const { setAlert, showAlert, alertMessage, alertType } = useAlert();
  const router = useRouter();
  const { mutate, isLoading } = trpc.auth.login.useMutation({
    onSuccess(data) {
      console.log('Login successful:', data);
      context.auth.user.setData(data);
      localStorage.setItem('user', JSON.stringify(data));
    },
    onError(error) {
      console.error('Login error:', error);
      setAlert('danger', error.message || "We couldn't log you in");
    },
    onSettled(data, error) {
      if (error) {
        console.error('Login error:', error);
        setAlert('danger', error.message || "We couldn't log you in");
      } else if (data) {
        console.log('Login successful:', data);
        context.auth.user.setData(undefined, data);
        localStorage.setItem('user', JSON.stringify(data));

        const redirect = (router.query.redirect as string) || '/menu';
        router.replace(redirect);
      } else {
        console.error('Login request failed for unknown reason');
        setAlert('danger', "We couldn't log you in. Please try again later.");
      }
    },
  });

  return (
    <>
      <Seo title="Login" />
      {showAlert && (
        <Alert position="top-center" variant="dark" type={alertType}>
          {alertMessage}
        </Alert>
      )}
      <div className={classes.root}>
        <Formik
          onSubmit={(values, actions) => {
            console.log('Form values:', values);
            mutate(values);
            actions.resetForm();
          }}
          initialValues={{ email: '', password: '' }}
          validationSchema={toFormikValidationSchema(loginInputSchema)}
        >
          <Form className={classes.form} autoComplete="off">
            <div className={classes['form-content']}>
              <Heading
                className={classes.heading}
                weight="regular"
                color="primary"
                variant="h2"
              >
                Login
              </Heading>
              <FormInput name="email" type="email" label="Email Address" />
              <FormInput name="password" type="password" label="Password" />

              <Button className="u-w-100" type="submit">
                {isLoading ? 'Loading...' : 'Login'}
              </Button>
            </div>
          </Form>
        </Formik>
      </div>
    </>
  );
};

LoginPage.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;

export default LoginPage;
