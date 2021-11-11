import CryptoES from "crypto-es";
import React from "react";
import {useState} from "react";
import {useEffect} from "react";
import {StyleSheet, Text, ScrollView, ColorValue} from "react-native";
import { API_URL } from "../config";
import {authStore} from "../stores/auth";

type MessageBoxProps = {
  borderColour: ColorValue;
  password: string;
};

const MessageBox: React.FC<MessageBoxProps> = ({borderColour, password}) => {
  const [text, setText] = useState<string[]>([]);
  const [i, setI] = useState(0);

  authStore.subscribe(() => {
    setI(0);
    setText([]);
  });

  useEffect(() => {
    const interval = setInterval(
      (i) => {
        getText()
          .then((name) => {
            if (authStore.getState().authed) {
              const decrypted = CryptoES.AES.decrypt(name, password).toString(
                CryptoES.enc.Utf8,
              );

              setText([...text, decrypted]);
            } else {
              setText([...text, name]);
            }

            setI(i + 1);
          })
          .catch((error) => {
            console.log(error);
          });
      },
      1000,
      i,
    );

    return () => clearInterval(interval);
  }, [text, i]);

  async function getText() {
    const res = await fetch(`${API_URL}/flag/${i}`);
    const json = await res.json();
    return json.message;
  }

  return (
    <ScrollView
      style={{
        ...styles.messageContainer,
        borderColor: borderColour,
      }}
    >
      {text.map((i, key) => {
        return (
          <Text key={key} style={styles.messageText}>
            {i}
          </Text>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 5,
    height: "40%",
    minHeight: 150,
    maxHeight: "40%"
  },

  messageText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "monospace",
    textAlign: "center",
  },
});

export default MessageBox;
