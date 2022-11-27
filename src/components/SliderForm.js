import React, { useEffect } from "react";
import { useForm } from "@mantine/form";
import { Select, Stack, TextInput, Button, Group } from "@mantine/core";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { fireDb } from "../firebaseConfig";
import { showNotification } from "@mantine/notifications";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import moment from "moment";

function SliderForm({
  formMode,
  setFormMode,
  setShowForm,
  sliderData,
  getData,
}) {
  const dispatch = useDispatch();
  const slider = JSON.parse(localStorage.getItem("slider"));
  const sliderForm = useForm({
    initialValues: {
      img_url: "",
      date: "",
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      dispatch(ShowLoading());
      if(formMode === "add") 
      {
        await addDoc(
          collection(fireDb, `sliders`),
          sliderForm.values
        );
      }else{
        await setDoc(
          doc(fireDb, `sliders`, sliderData.id),
          sliderForm.values
        );
      }
    
      showNotification({
        title: formMode === "add" ? "Transaction added" : "Transaction updated",
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
      sliderForm.setValues(sliderData);
      sliderForm.setFieldValue(
        "date",
        moment(sliderData.date, "YYYY-MM-DD").format("YYYY-MM-DD")
      );
    }
  }, [sliderData]);

  return (
    <div>
      <form action="" onSubmit={onSubmit}>
        <Stack>
          <TextInput
            img_url="img_url"
            label="img_url"
            placeholder="Enter Transaction Name"
            {...sliderForm.getInputProps("img_url")}
          />
          <Group position="apart" grow>
            <Select
              name="type"
              label="Type"
              placeholder="Select Transaction Type"
              data={[
                { label: "Income", value: "income" },
                { label: "Expense", value: "expense" },
              ]}
              {...sliderForm.getInputProps("type")}
            />

            <Select
              name="category"
              label="Category"
              placeholder="Select Transaction Category"
              data={[
                { label: "Food", value: "food" },
                { label: "Transport", value: "transport" },
                { label: "Shopping", value: "shopping" },
                { label: "Entertainment", value: "entertainment" },
                { label: "Health", value: "health" },
                { label: "Education", value: "education" },
                { label: "Salary", value: "salary" },
                { label: "Freelance", value: "freelance" },
                { label: "Business", value: "Business" },
              ]}
              {...sliderForm.getInputProps("category")}
            />
          </Group>
          <Group grow>
            <TextInput
              name="amount"
              label="Amount"
              placeholder="Enter Transaction Amount"
              {...sliderForm.getInputProps("amount")}
            />

            <TextInput
              name="date"
              label="Date"
              type="date"
              placeholder="Enter Transaction Date"
              {...sliderForm.getInputProps("date")}
            />
          </Group>

          <TextInput
            name="reference"
            label="Reference"
            placeholder="Enter Transaction Reference"
            {...sliderForm.getInputProps("reference")}
          />

          <Button color="cyan" type="submit">
            {formMode === "add" ? "Add Transaction" : "Update Transaction"}
          </Button>
        </Stack>
      </form>
    </div>
  );
}

export default SliderForm;
