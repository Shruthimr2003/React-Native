import { View, StyleSheet } from "react-native";

export default function App() {

  const spokes = new Array(24).fill(null);

  return (
    <View style={styles.container}>

      <View style={styles.orange} />

      <View style={styles.white}>
        <View style={styles.chakra}>
          {spokes.map((_, i) => (
            <View
              key={i}
              style={[
                styles.spoke,
                { transform: [{ rotate: `${i * 500}deg` }] }
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.green} />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },

  orange: {
    backgroundColor: "orange",
    width: 300,
    height: 100
  },

  white: {
    backgroundColor: "white",
    width: 300,
    height: 100,
    justifyContent: "center",
    alignItems: "center"
  },

  green: {
    backgroundColor: "green",
    width: 300,
    height: 100
  },

  chakra: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "navy",
    justifyContent: "center",
    alignItems: "center"
  },

  spoke: {
    position: "absolute",
    width: 2,
    height: 25,
    backgroundColor: "navy"
  }

});