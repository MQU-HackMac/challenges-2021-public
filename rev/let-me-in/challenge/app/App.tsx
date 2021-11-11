import {StatusBar} from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  View,
  Modal,
  Pressable,
  Button,
  Text,
} from "react-native";
import {Icon} from "react-native-elements";
import MessagesBox from "./components/MessagesBox";
import PasswordInput from "./components/PasswordInput";
import PasswordSubmitButton from "./components/PasswordSubmitButton";
import Title from "./components/Title";

const primaryColour = "#e64747";

export default function App() {
  const [password, setPassword] = React.useState("");
  const [authed, setAuthed] = React.useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {authed ? (
        <KeyboardAvoidingView
          behavior="padding"
          style={{
            padding: 20,
            width: "100%",
            height: "100%",
          }}
        >
          <StatusBar style="inverted" />

          <View style={{width: "20%", top: 50, position: "absolute"}}>
            <Pressable
              android_ripple={{
                color: primaryColour,
                borderless: true,
                radius: 40,
              }}
              onPress={() => setAuthed(false)}
            >
              <Icon name="arrow-back" color={primaryColour} size={40} />
            </Pressable>
          </View>

          <View
            style={{marginTop: 80, paddingHorizontal: 20, paddingBottom: 40}}
          >
            <Title title="FlagCrypt" colour={primaryColour} fontSize={64} />
          </View>

          <MessagesBox borderColour={primaryColour} password={password} />

          <PasswordInput
            password={password}
            setPassword={setPassword}
            borderColour={primaryColour}
          />

          <PasswordSubmitButton
            colour={primaryColour}
            text="Submit Password"
            password={password}
          />
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.enterContainer}>
          <Title title="Press to Enter" colour={primaryColour} fontSize={64} />
          <Title
            title="The password is password"
            colour={primaryColour}
            fontSize={32}
          />
          <Pressable
            style={styles.enterButton}
            android_ripple={{
              color: primaryColour,
              borderless: true,
              radius: 300,
            }}
            hitSlop={50}
            onPress={() => {
              setAuthed(false);

              if (!authed) {
                alert('You are not allowed in!')
              }
            }}
          >
            <Title title="Enter" colour={primaryColour} fontSize={32} />
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    alignItems: "center",
  },
  enterContainer: {
    flex: 1,
    paddingVertical: 150,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  enterButton: {
    backgroundColor: "#222",
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
