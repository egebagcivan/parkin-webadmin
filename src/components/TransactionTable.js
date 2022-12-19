import { Group, Table, Badge } from "@mantine/core";
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
      await deleteDoc(doc(fireDb, `vendors/`, id));
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
  const activeBadge = <Badge variant="gradient" gradient={{ from: 'teal', to: 'lime', deg: 105 }}>Aktif</Badge>
  const passiveBadge = <Badge variant="gradient" gradient={{ from: 'orange', to: 'red' }}>Pasif</Badge>

  function actPass(transaction){
    if(transaction.active === true){
      return activeBadge
    }else{
      return passiveBadge
    }
  }

  const getRows = transactions.map((transaction) => (
    <tr key={transaction.park_name}>
      <td>{transaction.park_name}</td>
      <td>{transaction.email}</td>
      <td>{transaction.manager_name}</td>
      <td>{transaction.latitude}, {transaction.longitude}</td>
      <td>{actPass(transaction)}</td>
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
          <th>Email</th>
          <th>menejer Adı</th>
          <th>Konum</th>
          <th>Aktif/Pasif</th>
        </tr>
      </thead>
      <tbody>{getRows}</tbody>
    </Table>
  );
}

export default TransactionTable;
