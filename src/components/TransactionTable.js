import { Group, Table } from "@mantine/core";
import React from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { showNotification } from "@mantine/notifications";
import { deleteDoc, doc } from "firebase/firestore";
import { fireDb } from "../firebaseConfig";

function TransactionTable({
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
      await deleteDoc(doc(fireDb, `users/${user.id}/transactions`, id));
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
    }
  };

  const getRows = transactions.map((transaction) => (
    <tr key={transaction.park_name}>
      <td>{transaction.park_name}</td>
      <td>{transaction.park_description}</td>
      <td>{transaction.location}</td>
      <td>{moment(transaction.date).format("DD-MM-YYYY")}</td>
      <td>{transaction.active}</td>
      <td>{transaction.reference}</td>
      <td>
        <Group>
          <i
            className="ri-pencil-line"
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
          <th>Otopark Adı</th>
          <th>Açıklama</th>
          <th>Konum</th>
          <th>Eklenme Tarihi</th>
          <th>Aktif/Pasif</th>
        </tr>
      </thead>
      <tbody>{getRows}</tbody>
    </Table>
  );
}

export default TransactionTable;
