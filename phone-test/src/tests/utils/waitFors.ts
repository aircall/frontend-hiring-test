import { screen, waitFor } from '@testing-library/react';

export const waitForLoginPage = () => {
  return waitFor(() => {
    const loginButton = screen.getByText('Login');
    expect(loginButton).toBeInTheDocument();
  });
};

export const waitForCallsHistoryPage = () => {
  return waitFor(() => {
    const callsHistoryTitle = screen.getByText('Calls History');
    expect(callsHistoryTitle).toBeInTheDocument();
  });
};

export const waitForCallList = () => {
  return waitFor(() => {
    const voicemailCall = screen.getByText('Voicemail');
    expect(voicemailCall).toBeInTheDocument();
  });
};

export const waitForCallDetailsPage = () => {
  return waitFor(() => {
    const callDetailsTitle = screen.getByText('Call Details');
    expect(callDetailsTitle).toBeInTheDocument();
  });
};
