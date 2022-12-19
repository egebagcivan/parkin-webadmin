import React, { useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { useForm } from "@mantine/form";
import { Select, Stack, TextInput, Button, Group, Input, PasswordInput} from "@mantine/core";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { fireDb } from "../firebaseConfig";
import { showNotification } from "@mantine/notifications";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
function TransactionForm({
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
    if(formMode === "add")  {
      const auth = getAuth();
    const email = trasactionForm.values.email;
    createUserWithEmailAndPassword(auth, email, 123123)
    .then(async (userCredential) => {
      // Signed in 
      const user = userCredential.user;
      await setDoc(doc(fireDb, "vendors", user.uid), {
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
      if(formMode === "edit") 
      {
        const upRef = doc(fireDb, "vendors", transactionData.id);
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
      <form action="" onSubmit={onSubmit}>
        <Stack>
          <TextInput
            name="park_name"
            label="Otopark Adı"
            placeholder="Otopark Adını girin"
            {...trasactionForm.getInputProps("park_name")}
          />
          <TextInput
            name="park_name"
            label="E-Posta"
            placeholder="ornek@ornek.com"
            {...trasactionForm.getInputProps("email")}
          />
          <TextInput
            name="park_name"
            label="Menejer Adı"
            placeholder="Menejer Adı Girin"
            {...trasactionForm.getInputProps("manager_name")}
          />
          <TextInput
            name="IBAN"
            label="IBAN"
            placeholder="TRXXXX"
            {...trasactionForm.getInputProps("iban")}
          />
          <TextInput
            name="VKN"
            label="VKN"
            placeholder="VKN"
            {...trasactionForm.getInputProps("vkn")}
          />
            <TextInput
            name="Phone"
            label="Phone"
            placeholder="Phone"
            {...trasactionForm.getInputProps("phone")}
          />
          <Group position="apart" grow>
          <Input required
            name="location"
            label="Latitude"
            placeholder="Latitude"
            defaultValue={trasactionForm.values.latitude}
            onChange={(e) => { trasactionForm.setFieldValue('latitude', parseFloat(e.target.value)) }}
          />
          <Input required
            name="location"
            label="Longitude"
            defaultValue={trasactionForm.values.longitude}
            onChange={(e) => { trasactionForm.setFieldValue('longitude', parseFloat(e.target.value)) }}
            placeholder="Longitude"
          />
          </Group>
          <Group position="apart" grow>
            <Select
              name="active"
              label="Aktif/Pasif"
              placeholder="Aktif/Pasif"
              data={[
                { label: "Aktif", value: true },
                { label: "Pasif", value: false },
              ]}
              {...trasactionForm.getInputProps("active")}
            />
          </Group>
          <Button color="cyan" type="submit">
            {formMode === "add" ? "Otoparkı Ekle" : "Otoparkı Güncelle"}
          </Button>
        </Stack>
      </form>
    </div>
  );
}

export default TransactionForm;
