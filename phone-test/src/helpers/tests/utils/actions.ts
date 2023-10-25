import { act, prettyDOM, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { router } from '../../../configurations/router';

export const see = (element: HTMLElement) => console.log(prettyDOM(element));

const user = userEvent.setup();

export const goToLogin = () => {
  act(() => {
    router.navigate('/login');
  });
};

export const fillEmailAndPassword = async (email: string, password: string) => {
  const emailInput = await screen.findByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  await user.type(emailInput, email);
  await user.type(passwordInput, password);
};

export const clickOnLogin = async () => {
  const loginButton = await screen.findByText('Login');
  await user.click(loginButton);
};

export const clickOnCall = async (callItem: HTMLElement) => {
  await user.click(callItem);
};

export const clickOnLogout = async () => {
  const logoutButton = await screen.findByText('Logout');
  await user.click(logoutButton);
};
