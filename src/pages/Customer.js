import React, { useEffect } from "react";
import HeaderMegaMenu from "../components/HeaderMegaMenu";
import { Box, Card, Button, Modal, Group, Divider, Text } from "@mantine/core";
import TransactionForm from "../components/TransactionForm";
import { useDispatch } from "react-redux";
import { fireDb } from "../firebaseConfig";
import { showNotification } from "@mantine/notifications";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import moment from "moment";
import Analytics from "../components/Analytics";
import { useNavigate } from "react-router-dom";
import CustomerTable from "../components/CustomerTable";
import CustomerForm from "../components/CustomerForm";


function Customer() {
  const navigate = useNavigate();

  const [view, setView] = React.useState("table");
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const [transactions, setTransactions] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [formMode, setFormMode] = React.useState("add");
  const [selectedTransaction, setSelectedTransaction] = React.useState({});

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const qry = query(
        collection(fireDb, `customer`),
        orderBy("nameSurname", "desc"),
      );

      const response = await getDocs(qry);
      const data = response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTransactions(data);

      dispatch(HideLoading());
    } catch (error) {
      console.log(error);
      showNotification({
        title: "Error fetching transactions",
        color: "red",
      });
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box

    >
      <HeaderMegaMenu />

      <div className="container">
        <Text
          variant="gradient"
          gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
          sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
          ta="center"
          fz="xl"
          pl={15}
          fw={700}
        >
          Müşteriler
        </Text>
        <Card>
          <Divider mt={20} />
          {view === "table" && (
            <CustomerTable
              transactions={transactions}
              setSelectedTransaction={setSelectedTransaction}
              setFormMode={setFormMode}
              setShowForm={setShowForm}
              getData={getData}
            />
          )}
          {view === "analytics" && <Analytics transactions={transactions} />}
        </Card>
      </div>


      <Modal
        size="lg"
        title={formMode === "add" ? "Vendor Ekle" : "Park Geçmişi"}
        opened={showForm}
        onClose={() => setShowForm(false)}
        centered
      >
        <CustomerForm
          formMode={formMode}
          setFormMode={setFormMode}
          setShowForm={setShowForm}
          showForm={showForm}
          transactionData={selectedTransaction}
          getData={getData}
        />
      </Modal>
    </Box>
  );
}

export default Customer;
