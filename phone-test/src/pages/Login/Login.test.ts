import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { MockedProvider, MockedProviderProps } from "@apollo/client/testing";
import { LOGIN } from "../../gql/mutations";
import { LoginPage } from "./Login";
import { CallDetailsPage } from "../CallDetails";
import { LoginForm } from "./LoginForm";
import { FormState } from "./Login.decl";
import { CallsListPage } from "../CallsList";

const mocks = 
        {
            request: {
                query: LOGIN,
                variables: {
                  username: "test@aircall",
                  password: "12345"
                }
        },
        result: {
            data: {
                access_token: "abcde",
                refresh_token: '123abc',
                user: {
                    id: "test@aircall",
                    username: "test@aircall"
                },
            }
          }
    };
it("callDetails renders without error", async()=> {
    
    const MockProps: MockedProviderProps = {
        mocks: [],
        addTypename: false,
        children: CallDetailsPage()
        
    }
    const mockProvider = new MockedProvider(MockProps)
    mockProvider.render()
})

it("should render without error", () => {
    const MockProps: MockedProviderProps = {
        mocks: [mocks],
        addTypename: false,
        children: LoginPage
        
    }
    const mockProvider = new MockedProvider(MockProps)
    mockProvider.render()
    
  });

  it("should trigger submit button", () => {
    const onSubmit = jest.fn()
    const formstate: FormState = 'Idle'
    const MockProps: MockedProviderProps = {
        mocks: [mocks],
        addTypename: false,
        children: LoginForm,
        childProps: {
            onSubmit: onSubmit,
            formstate: formstate
        }    
    }
    const mockProvider = new MockedProvider(MockProps)
    mockProvider.render()
    screen.getByRole('button').click()
    expect(onSubmit).toHaveBeenCalled()
    
  });

  it("callDList check", async()=> {
    
    const MockProps: MockedProviderProps = {
        mocks: [],
        addTypename: false,
        children: CallsListPage()
        
    }
    const mockProvider = new MockedProvider(MockProps)
    mockProvider.render()
    expect(await screen.findAllByText("ERROR")).toBeInTheDocument()
})