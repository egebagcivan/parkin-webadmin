import React, { useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";

import { useForm } from "@mantine/form";
import { Select, Stack, TextInput, Button, Group, Input, PasswordInput, Card, Image, Text, Badge, Pagination } from "@mantine/core";
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
        const customerData = custDoc.data();

        const histRef = collection(fireDb, 'customer', custDoc.id, 'history');
        const histSnapshot = getDocs(histRef).then((snapshot) => {
          snapshot.forEach(async (histDoc) => {
            const historyData = histDoc.data();
            if (historyData.customerId === transactionData.uid) {
              const vendorRef = collection(fireDb, 'vendor');
              const vendorQuery = query(vendorRef, where('vendorId', '==', historyData.vendorId));
              const vendorSnapshot = await getDocs(vendorQuery);
              const vendorData = vendorSnapshot.docs[0].data();
              const newData = { ...customerData, ...historyData, ...vendorData };
              setHistoryData((prevData) => [...prevData, newData].sort((a, b) => b.closedTime - a.closedTime));
            }
            dispatch(HideLoading());
          });
        }).catch((error) => {
          console.error(error);
        });
      });
    } catch (error) {
      console.error(error);
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

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(historyData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentItems = historyData.slice(startIndex, endIndex);
  return (
    <div>
      {currentItems.map((data, index) => (
        <div key={index}>
          <Card mb={10} shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Image
                src={data.imgList[0]}
                height={160}
                alt="Karşıyaka"
              />
            </Card.Section>

            <Group position="apart" mt="md" mb="xs">
              {data.parkName}
              {data.status === "denied" ? (
                <Badge color="pink" variant="light">
                  DENIED
                </Badge>
              ) : data.status === "process" ? (
                <Badge color="yellow" variant="light">
                  PROCESS
                </Badge>
              ) : (
                <Badge color="green" variant="light">
                  {data.totalPrice} ₺
                </Badge>
              )}
            </Group>

            {data.status === "denied" ? (
              <Text size="sm" color="dimmed">
                Total Minutes:  DENIED
              </Text>
            ) : data.status === "process" ? (
              <Text size="sm" color="dimmed">
                Total Minutes: IN PROCESS
              </Text>
            ) : (
              <Text size="sm" color="dimmed">
                Total Minutes: {data.totalMins}
              </Text>
            )}
            <Text size="sm" color="dimmed">
              Status: {data.status}
            </Text>
            <Text size="sm" color="dimmed">
              Date: {new Date(data.closedTime.seconds * 1000).toLocaleString()}
            </Text>
          </Card>
        </div>
      ))}

      {/* render pagination buttons */}
      <Pagination
        total={totalPages}
        current={currentPage}
        onChange={(page) => setCurrentPage(page)}
      />
    </div>
  );



}

export default CustomerForm;
