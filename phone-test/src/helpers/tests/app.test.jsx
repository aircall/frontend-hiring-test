import { render, screen } from '@testing-library/react';
import {
  clickOnCall,
  clickOnLogin,
  clickOnLogout,
  fillEmailAndPassword,
  goToLogin
} from './utils/actions';
import { App } from './utils/environment';
import {
  waitForCallDetailsPage,
  waitForCallList,
  waitForCallsHistoryPage,
  waitForLoginPage
} from './utils/waitFors';

describe('<App />', () => {
  it('should log in, tap on a call and see its details and finally log out', async () => {
    render(<App />);

    goToLogin();

    await waitForLoginPage();

    await fillEmailAndPassword('fjrodriguez.353@gmail.com', 'P4ssw0rd!');
    await clickOnLogin();

    await waitForCallsHistoryPage();
    await waitForCallList();
    await clickOnCall(screen.getByText('Voicemail'));

    await waitForCallDetailsPage();
    const callDetails = [
      'ID: 4eb15231-ff64-4b29-8a7a-db4588a666c3',
      'Type: voicemail',
      'Created at: Oct 23 - 07:29',
      'Direction: inbound',
      'From: +33112595244',
      'Duration: 00:37',
      'Is archived: false',
      'To: +33140027979',
      'Via: +33177174017',
      'Note 1: Aut corrupti recusandae commodi maiores sint iste sed facere.'
    ];
    callDetails.forEach(detail => {
      expect(screen.getByText(detail)).toBeInTheDocument();
    });

    clickOnLogout();
    await waitForLoginPage();
  });
});
