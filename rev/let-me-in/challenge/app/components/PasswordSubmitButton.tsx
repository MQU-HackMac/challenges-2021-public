import React from "react";
import {useState} from "react";
import {StyleSheet, View, ColorValue, Button, Alert} from "react-native";
import { API_URL } from "../config";
import {authStore, authed, deauthed, flipped} from "../stores/auth";

type PasswordSubmitButtonProps = {
  text: string;
  colour: ColorValue;
  password: string;
};

const PasswordSubmitButton: React.FC<PasswordSubmitButtonProps> = ({
  text,
  password,
  colour,
}) => {
  const [buttonColour, setButtonColour] = useState<ColorValue>(colour);

  authStore.subscribe(() => {
    if (authStore.getState().authed) {
      setButtonColour("#329F5B");
    } else {
      setButtonColour(colour);
    }
  });

  async function checkPassword() {
    const res = await fetch(`${API_URL}/checkPass`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({password: password}),
    });

    return res.status === 200;
  }

  return (
    <View style={{paddingVertical: 20}}>
      <Button
        onPress={async () => {
          const authPassed = await checkPassword();
          if (authPassed === true) {
            authStore.dispatch(authed());
          } else {
            authStore.dispatch(deauthed());
          }
        }}
        title={text}
        color={buttonColour}
        accessibilityLabel={text}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default PasswordSubmitButton;
