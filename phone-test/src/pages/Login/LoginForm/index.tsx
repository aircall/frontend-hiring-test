import { useState } from 'react';

import {
  Button,
  Form,
  FormItem,
  Grid,
  Icon,
  SpinnerOutlined,
  TextFieldInput,
  useToast
} from '@aircall/tractor';
import { FormState } from '../Login.decl';
import { isFormValid } from './isFormValid';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  formState: FormState;
}

export const LoginForm = ({ onSubmit, formState }: LoginFormProps) => {
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Form
      onSubmit={e => {
        e.preventDefault();

        if (!isFormValid(email, password)) {
          toast.showToast({
            variant: 'error',
            icon: true,
            message:
              'Enter a valid email in the format name@example.com, and a password with at least one digit.'
          });

          return;
        }

        onSubmit(email, password);
      }}
      width="100%"
    >
      <Grid columnGap={4} rowGap={5} gridTemplateColumns="1fr">
        <FormItem label="Email" name="email">
          <TextFieldInput
            type="email"
            placeholder="job@aircall.io"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormItem>
        <FormItem label="Password" name="password">
          <TextFieldInput
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </FormItem>
        <FormItem>
          <Button block type="submit">
            {formState === 'Pending' ? <Icon component={SpinnerOutlined} spin /> : 'Login'}
          </Button>
        </FormItem>
      </Grid>
    </Form>
  );
};
