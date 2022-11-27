import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";

import { Select, Stack, TextInput, Button, Group } from "@mantine/core";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { fireDb } from "../firebaseConfig";
import { showNotification } from "@mantine/notifications";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import moment from "moment";
function TransactionForm({
  formMode,
  setFormMode,
  setShowForm,
  transactionData,
  getData,
}) {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const trasactionForm = useForm({
    initialValues: {
      park_name: "",
      park_description: "",
      location: "",
      rating: "",
      active: "",
      date:"",
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      dispatch(ShowLoading());
      if(formMode === "add") 
      {
        await addDoc(
          collection(fireDb, `vendors`),
          trasactionForm.values
        );
      }else{
        await setDoc(
          doc(fireDb, `vendors`, transactionData.id),
          trasactionForm.values
        );
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
    }
  };

  useEffect(() => {
    if (formMode === "edit") {
      trasactionForm.setValues(transactionData);
      trasactionForm.setFieldValue(
        "date",
        moment(transactionData.date, "YYYY-MM-DD").format("YYYY-MM-DD")
      );
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
            name="description"
            label="Açıklama"
            placeholder="Açıklama Girin"
            {...trasactionForm.getInputProps("park_description")}
          />
          <Group position="apart" grow>
            <Select
              name="active"
              label="Aktif/Pasif"
              placeholder="Aktif/Pasif"
              data={[
                { label: "Aktif", value: "true" },
                { label: "Pasif", value: "false" },
              ]}
              {...trasactionForm.getInputProps("active")}
            />

          <TextInput
            name="location"
            label="Konum"
            placeholder="Konum Girin"
            {...trasactionForm.getInputProps("location")}
          />
          </Group>
          <Group grow>
            <TextInput
              name="date"
              label="Tarih"
              type="date"
              placeholder="Enter Transaction Date"
              {...trasactionForm.getInputProps("date")}
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
