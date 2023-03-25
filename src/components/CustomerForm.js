import React, { useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { useForm } from "@mantine/form";
import { Select, Stack, TextInput, Button, Group, Input, PasswordInput, Card, Image, Text, Badge } from "@mantine/core";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { fireDb } from "../firebaseConfig";
import { showNotification } from "@mantine/notifications";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
function CustomerForm({
  formMode,
  setFormMode,
  setShowForm,
  transactionData,
  getData,
}) {
  const dispatch = useDispatch();
  const trasactionForm = useForm({
    initialValues: {
      park_name: "",
      iban: "",
      email: "",
      phone: "",
      vkn: "",
      password: "",
      manager_name: "",
      latitude: null,
      longitude: null,
      active: null,
    },
  });
  const onSubmit = async (event) => {
    event.preventDefault();
    if (formMode === "add") {
      const auth = getAuth();
      const email = trasactionForm.values.email;
      createUserWithEmailAndPassword(auth, email, 123123)
        .then(async (userCredential) => {
          // Signed in 
          const user = userCredential.user;
          await setDoc(doc(fireDb, "vendor", user.uid), {
            vendor_id: user.uid,
            email: trasactionForm.values.email,
            iban: trasactionForm.values.iban,
            phone: trasactionForm.values.phone,
            vkn: trasactionForm.values.vkn,
            park_name: trasactionForm.values.park_name,
            manager_name: trasactionForm.values.manager_name,
            latitude: trasactionForm.values.latitude,
            longitude: trasactionForm.values.longitude,
            active: trasactionForm.values.active,
          });
          sendPasswordResetEmail(auth, email)
            .then(() => {
              console.log("email sent")
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorCode, errorMessage)
              // ..
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage)
        });
    }

    try {
      dispatch(ShowLoading());
      if (formMode === "edit") {
        const upRef = doc(fireDb, "vendor", transactionData.id);
        await updateDoc(upRef, {
          email: trasactionForm.values.email,
          iban: trasactionForm.values.iban,
          phone: trasactionForm.values.phone,
          vkn: trasactionForm.values.vkn,
          park_name: trasactionForm.values.park_name,
          manager_name: trasactionForm.values.manager_name,
          latitude: trasactionForm.values.latitude,
          longitude: trasactionForm.values.longitude,
          active: trasactionForm.values.active,
        });
      }

      showNotification({
        title: formMode === "add" ? "OtoparK Eklendi" : "Otopark Güncellendi",
        color: "green",
      });
      dispatch(HideLoading());
      getData()
      setShowForm(false);
    } catch (error) {
      showNotification({
        title: formMode === "add" ? "Error adding transaction" : "Error updating transaction",
        color: "red",
      });
      dispatch(HideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    if (formMode === "edit") {
      trasactionForm.setValues({
        park_name: transactionData.park_name,
        iban: transactionData.iban,
        email: transactionData.email,
        manager_name: transactionData.manager_name,
        latitude: transactionData.latitude,
        longitude: transactionData.longitude,
        active: transactionData.active,
        vkn: transactionData.vkn,
        phone: transactionData.phone,
      });
    }
  }, [transactionData]);

  return (
    <div>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Image
            src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            height={160}
            alt="Norway"
          />
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>Norway Fjord Adventures</Text>
          <Badge color="pink" variant="light">
            On Sale
          </Badge>
        </Group>

        <Text size="sm" color="dimmed">
          With Fjord Tours you can explore more of the magical fjord landscapes with tours and
          activities on and around the fjords of Norway
        </Text>

        <Button variant="light" color="blue" fullWidth mt="md" radius="md">
          Book classic tour now
        </Button>
      </Card>
    </div>
  );
}

export default CustomerForm;
