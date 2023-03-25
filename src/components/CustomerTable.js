import { Group, Table, Badge } from "@mantine/core";
import React from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { showNotification } from "@mantine/notifications";
import { deleteDoc, doc } from "firebase/firestore";
import { fireDb } from "../firebaseConfig";

function CustomerTable({
  transactions,
  setSelectedTransaction,
  setFormMode,
  setShowForm,
  getData,
}) {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const deleteTransaction = async (id) => {
    try {
      dispatch(ShowLoading());
      await deleteDoc(doc(fireDb, `customer/`, id));
      dispatch(HideLoading());
      showNotification({
        title: "Transaction deleted",
        color: "green",
      });
      getData();
    } catch (error) {
      dispatch(HideLoading());
      showNotification({
        title: "Error deleting transaction",
        color: "red",
      });
      console.log(error);
    }
  };

  //Aktif Pasif Badge
  const activeBadge = <Badge variant="gradient" gradient={{ from: 'teal', to: 'lime', deg: 105 }}>Onaylı</Badge>
  const passiveBadge = <Badge variant="gradient" gradient={{ from: 'orange', to: 'red' }}>Onaylı değil</Badge>

  function actPass(transaction) {
    if (transaction.verified === true) {
      return activeBadge
    } else {
      return passiveBadge
    }
  }
  const getRows = transactions.map((transaction) => (
    <tr key={transaction.nameSurname}>
      <td>{transaction.nameSurname}</td>
      <td>{transaction.email}</td>
      <td>{transaction.phone}</td>
      <td>{actPass(transaction)}</td>
      <td>
        <Group>
          <i
            className="ri-history-line"
            onClick={() => {
              setSelectedTransaction(transaction);
              setFormMode("edit");
              setShowForm(true);
            }}
          ></i>
          <i
            className="ri-delete-bin-line"
            onClick={() => {
              deleteTransaction(transaction.id);
            }}
          ></i>
        </Group>
      </td>
    </tr>
  ));

  return (
    <Table verticalSpacing="md" fontSize="sm" striped>
      <thead>
        <tr>
          <th>Ad Soyad</th>
          <th>Email</th>
          <th>Telefon</th>
          <th>Onay</th>
        </tr>
      </thead>
      <tbody>{getRows}</tbody>
    </Table>
  );
}

export default CustomerTable;
