import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import Iconicicons from "react-native-vector-icons";
import { authStyles } from "@/assets/styles/auth.styles.js";
const styles = authStyles;
import { COLORS } from "@/constants/colors.js";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <View style={styles.scrollContent}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => setPendingVerification(false)}
            style={{ marginBottom: 20 }}
          >
            <Text style={{ color: COLORS.primary, fontSize: 16 }}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Verify your email</Text>

          {/* Error Box */}
          {error ? (
            <View style={styles.errorBox}>
              <Iconicicons
                name="alert-circle"
                size={20}
                color={COLORS.expense}
              />
              <Text style={styles.errorText}>{error}</Text>

              <TouchableOpacity onPress={() => setError("")}>
                <Iconicicons name="close" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Code Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={code}
              placeholder="Enter your verification code"
              placeholderTextColor={COLORS.textLight}
              onChangeText={(t) => setCode(t)}
            />
          </View>
          {/* Verify Button */}
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.authButton} onPress={onVerifyPress}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.scrollContent}>
        <Text style={styles.title}>Sign up</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            placeholderTextColor={COLORS.textLight}
            onChangeText={(email) => setEmailAddress(email)}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={password}
            placeholder="Enter password"
            placeholderTextColor={COLORS.textLight}
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>

        <TouchableOpacity style={styles.authButton} onPress={onSignUpPress}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Already have an account?</Text>
          <Link href="/sign-in">
            <Text style={styles.link}>Sign in</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
