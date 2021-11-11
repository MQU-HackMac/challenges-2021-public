import React from "react";
import { useState } from "react";
import {StyleSheet, TextInput, View, ColorValue} from "react-native";
import {authStore, authed, deauthed, flipped} from "../stores/auth";

type PasswordInputProps = {
  password: string;
  setPassword: (text: string) => void;
  borderColour: ColorValue;
};

const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  setPassword,
  borderColour,
}) => {
  const [displayPassword, setDisplayPassword] = useState("");

  authStore.subscribe(() => {
    setDisplayPassword("");
  });

  return (
    <View style={{...styles.inputContainer, borderColor: borderColour}}>
      <TextInput
        style={styles.input}
        onChangeText={(text) => {
          setPassword(text)
          setDisplayPassword(text)
        }}
        value={displayPassword}
        placeholder="Password"
        placeholderTextColor="grey"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 5,
  },

  input: {
    color: "#fff",
    fontSize: 24,
    height: 50,
    margin: 12,
    paddingHorizontal: 12,
  },
});

export default PasswordInput;
