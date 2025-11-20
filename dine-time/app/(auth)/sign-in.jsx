import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import React from "react";
import { authStyles } from "@/assets/styles/auth.styles.js";
const styles = authStyles;
import { COLORS } from "@/constants/colors.js";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  // const [error, setError] = useState("");
  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.scrollContent}>
        <Text style={styles.title}>Sign In</Text>

        {/* Error Message */}
        {/* {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Text style={{ color: COLORS.textLight, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : null} */}

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Enter email"
            placeholderTextColor={COLORS.textLight}
            value={emailAddress}
            onChangeText={(txt) => setEmailAddress(txt)}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter password"
            placeholderTextColor={COLORS.textLight}
            secureTextEntry
            value={password}
            onChangeText={(txt) => setPassword(txt)}
          />
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.authButton} onPress={onSignInPress}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>
            Don’t have an account?{" "}
            <Link href="/sign-up">
              <Text style={styles.link}>Sign up</Text>
            </Link>
          </Text>
        </View>
      </View>
    </View>
    // <View>
    //   <Text>Sign in</Text>
    //   <TextInput
    //     autoCapitalize="none"
    //     value={emailAddress}
    //     placeholder="Enter email"
    //     onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
    //   />
    //   <TextInput
    //     value={password}
    //     placeholder="Enter password"
    //     secureTextEntry={true}
    //     onChangeText={(password) => setPassword(password)}
    //   />
    //   <TouchableOpacity onPress={onSignInPress}>
    //     <Text>Continue</Text>
    //   </TouchableOpacity>
    //   <View style={{ display: "flex", flexDirection: "row", gap: 3 }}>
    //     <Link href="/sign-up">
    //       <Text>Sign up</Text>
    //     </Link>
    //   </View>
    // </View>
  );
}
