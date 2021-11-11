import React from "react";
import {StyleSheet, View, ColorValue, Text} from "react-native";

type TitleProps = {
  title: string;
  colour: ColorValue;
  fontSize: number;
};

const Title: React.FC<TitleProps> = ({title, colour, fontSize}) => {
  return (
    <View style={styles.titleContainer}>
      <Text style={{...styles.title, color: colour, fontSize: fontSize}}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    // marginTop: 100,
    // paddingHorizontal: 20,
    // paddingBottom: 40,
  },

  title: {
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Title;
