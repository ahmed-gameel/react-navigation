import {
  createNavigationContainerRef,
  createNavigatorFactory,
  ParamListBase,
  StackRouter,
  useNavigationBuilder,
} from '@react-navigation/core';
import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Button, Text } from 'react-native';

import window from '../__mocks__/window';
import NavigationContainer from '../NavigationContainer';
import useLinkingOnConditionalRender from '../useLinkingOnConditionalRender';

Object.assign(global, window);

// We want to use the web version of useLinking
// eslint-disable-next-line import/extensions
jest.mock('../useLinking', () => require('../useLinking.tsx').default);

it('should schedule a state to be handled on conditional linking', async () => {
  const createStackNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => (
          <div key={route.key}>{descriptors[route.key].render()}</div>
        ))}
      </NavigationContent>
    );
  });

  const Stack = createStackNavigator();

  const TestScreen = ({ route }: any): any => <Text>{route.name}</Text>;
  const SignInScreen = ({ route, signIn }: any): any => {
    const fn = useLinkingOnConditionalRender();
    return (
      <>
        <Text>{route.name}</Text>
        <Button
          title="sign in"
          onPress={() => {
            fn();
            signIn();
          }}
        />
      </>
    );
  };

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: 'home',
        Profile: 'profile',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const App = () => {
    const [isSignedIn, setSignedIn] = React.useState(false);

    return (
      <NavigationContainer ref={navigation} linking={linking}>
        <Stack.Navigator>
          {isSignedIn ? (
            <>
              <Stack.Screen name="Home" component={TestScreen} />
              <Stack.Screen name="Profile" component={TestScreen} />
            </>
          ) : (
            <Stack.Screen name="SignIn">
              {(props) => (
                <SignInScreen signIn={() => setSignedIn(true)} {...props} />
              )}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

  const { queryByText, findByText } = render(<App />);

  expect(queryByText('SignIn')).not.toBeNull();

  fireEvent.press(await findByText(/sign in/i));

  expect(queryByText('SignIn')).toBeNull();
  expect(queryByText('Home')).not.toBeNull();
});
