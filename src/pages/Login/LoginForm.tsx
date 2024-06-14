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

import { FormState } from './Login.decl';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  formState: FormState;
}

export const LoginForm = ({ onSubmit, formState }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(email, password);
      }}
      width="100%"
    >
      <Grid columnGap={4} rowGap={5} gridTemplateColumns="1fr">
        <FormItem label="Email" name="email">
          <TextFieldInput
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
