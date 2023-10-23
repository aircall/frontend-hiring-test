import { useState } from 'react';

import {
  Button,
  Form,
  FormItem,
  Grid,
  Icon,
  SpinnerOutlined,
  TextFieldInput
} from '@aircall/tractor';

import { useAuth } from '../../hooks/useAuth';
import { useCustomToast } from 'hooks/useCustomToast';

const LOGIN_REJECTED = 'LOGIN_REJECTED';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, status } = useAuth();
  const { showToast, removeToast } = useCustomToast();

  const onSubmit = async (email: string, password: string) => {
    try {
      await login({ username: email, password });
      removeToast(LOGIN_REJECTED);
    } catch (error) {
      showToast({
        id: LOGIN_REJECTED,
        message: 'Invalid email or password',
        variant: 'error'
      });
    }
  };

  return (
    <Form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(email, password);
      }}
      width="100%"
    >
      {/* <Button variant="primary" onClick={()=>showToast({id: LOGIN_REJECTED, message: 'Invalid email or password', variant: 'error'})}>Show Toast</Button> */}
      <Grid columnGap={4} rowGap={5} gridTemplateColumns="1fr">
        <FormItem label="Email" name="email">
          <TextFieldInput
            placeholder="job@aircall.io"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormItem>
        <FormItem label="Password" name="password">
          <TextFieldInput
            type="password"
            value={password}
            required
            onChange={e => setPassword(e.target.value)}
          />
        </FormItem>
        <FormItem>
          <Button block type="submit">
            {status === 'Loading' ? <Icon component={SpinnerOutlined} spin /> : 'Login'}
          </Button>
        </FormItem>
      </Grid>
    </Form>
  );
};

/* It doesn't work without hooks
function removeToast(LOGIN_REJECTED: string) {
  toasts.removeToast(LOGIN_REJECTED);
}

function showToast(arg0: { id: any; message: string; variant: NotificationVariants }) {
  toasts.showToast(arg0);
}
*/
