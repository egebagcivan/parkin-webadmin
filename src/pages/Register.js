import React from "react";
import { useForm } from "@mantine/form";
import {
  Button,
  Card,
  Divider,
  Stack,
  TextInput,
  Title,
  Anchor,
} from "@mantine/core";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { fireDb } from "../firebaseConfig";
import cryptojs from "crypto-js";
import { showNotification } from "@mantine/notifications";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

function Register() {
  const dispatch = useDispatch();
  const registerForm = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      // check if user already exists based on email
      dispatch(ShowLoading());
      const qry = query(
        collection(fireDb, "admins"),
        where("email", "==", registerForm.values.email)
      );
      const existingUsers = await getDocs(qry);

      if (existingUsers.size > 0) {
        console.log(existingUsers);
        showNotification({
          title: "User already exists",
          color: "red",
        });
        return;
      } else {
        // encrypt password
        const encryptedPassword = cryptojs.AES.encrypt(
          registerForm.values.password,
          "sheymoney-lite"
        ).toString();
        const response = await addDoc(collection(fireDb, "admins"), {
          ...registerForm.values,
          password: encryptedPassword,
        });
        if (response.id) {
          showNotification({
            title: "User created successfully",
            color: "green",
          });
        } else {
          showNotification({
            title: "Something went wrong",
            color: "red",
          });
        }
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      showNotification({
        title: "Something went wrong",
        color: "red",
      });
    }
  };
  return (
    <div className="flex h-screen justify-center items-center auth">
      <Card
        sx={{
          width: 400,
          padding: "sm",
        }}
        shadow="lg"
        withBorder
      >
        <Title order={2} mb={5} color='gray'>
           SHEYMONEY - REGISTER
        </Title>
        <Divider variant="dotted" color="gray" />
        <form action="" onSubmit={onSubmit}>
          <Stack mt={5}>
            <TextInput
              label="Name"
              placeholder="Enter your name"
              name="name"
              {...registerForm.getInputProps("name")}
            />
            <TextInput
              label="Email"
              placeholder="Enter your email"
              name="email"
              {...registerForm.getInputProps("email")}
            />
            <TextInput
              label="Password"
              placeholder="Enter your password"
              name="password"
              type="password"
              {...registerForm.getInputProps("password")}
            />
            <Button type="submit" color="teal">
              Register
            </Button>
            <Anchor href="/login"
              color='teal'
            >Already have an account? Login</Anchor>
          </Stack>
        </form>
      </Card>
    </div>
  );
}

export default Register;
