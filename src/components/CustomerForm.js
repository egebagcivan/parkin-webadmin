import React, { useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";

import { useForm } from "@mantine/form";
import { Select, Stack, TextInput, Button, Group, Input, PasswordInput, Card, Image, Text, Badge } from "@mantine/core";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
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
  const [customerList, setCustomerList] = useState([]);
  const trasactionForm = useForm({
    initialValues: {
      nameSurname: "",
      email: "",
      uid: ""
    },
  });

  const [historyData, setHistoryData] = useState([]);

  const getRequest = async () => {
    try {
      dispatch(ShowLoading());
      const custRef = collection(fireDb, 'customer');
      const custSnapshot = await getDocs(custRef);

      custSnapshot.forEach((custDoc) => {
        const dataa = custDoc.data();

        const histRef = collection(fireDb, 'customer', custDoc.id, 'history');
        const histSnapshot = getDocs(histRef).then((snapshot) => {
          snapshot.forEach((histDoc) => {
            const data = histDoc.data();
            //console.log(data); // log the requestId field
            if (data.customerId == transactionData.uid) {
              setHistoryData((prevData) => [...prevData, data].sort((a, b) => b.closedTime - a.closedTime));
            }
          });
        }).catch((error) => {
          console.error(error);
        });
      });
      dispatch(HideLoading());
    } catch (error) {
      console.error(error);
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    getRequest();
  }, []);

  useEffect(() => {
    if (formMode === "edit") {
      trasactionForm.setValues({
        nameSurname: transactionData.nameSurname,
        email: transactionData.email
      });
    }
  }, [transactionData]);

  return (
    <div>
      {historyData.map((data, index) => (
        <div key={index}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/heryerpark-ms.appspot.com/o/vendorImage%2F0BGQoIHIRtFitJ4jq96B-1.png?alt=media&token=606857d0-81a3-45e7-bad8-c5a5f827db93"
                height={160}
                alt="Karşıyaka"
              />
            </Card.Section>

            <Group position="apart" mt="md" mb="xs">
              {data.parkName}
              <Badge color="pink" variant="light">
                {data.totalPrice} ₺
              </Badge>
            </Group>

            <Text size="sm" color="dimmed">
              Total Minutes: {data.totalMins}
            </Text>
            <Text size="sm" color="dimmed">
              Status: {data.status}
            </Text>
            <Text size="sm" color="dimmed">
              Date: {new Date(data.closedTime.seconds * 1000).toLocaleString()}
            </Text>

            <Button variant="light" color="blue" fullWidth mt="md" radius="md">
              Book classic tour now
            </Button>
          </Card>
        </div>
      ))}
    </div>
  );

}

export default CustomerForm;
