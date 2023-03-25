import React, { useEffect } from "react";
import HeaderMegaMenu from "../components/HeaderMegaMenu";
import { Box, Modal, Group, Divider } from "@mantine/core";
import TransactionForm from "../components/TransactionForm";
import { useDispatch } from "react-redux";
import { fireDb } from "../firebaseConfig";
import { showNotification } from "@mantine/notifications";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import TransactionTable from "../components/TransactionTable";
import moment from "moment";
import Analytics from "../components/Analytics";
import { useNavigate } from "react-router-dom";
import { RingProgress, Text, Progress } from "@mantine/core";


function Dashboard() {
  const navigate = useNavigate();

  const [view, setView] = React.useState("table");
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const [transactions, setTransactions] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [formMode, setFormMode] = React.useState("add");
  const [selectedTransaction, setSelectedTransaction] = React.useState({});
  const [activeHistoryCount, setActiveHistoryCount] = React.useState(0);
  const [processHistoryCount, setProcessHistoryCount] = React.useState(0);
  const [deniedHistoryCount, setDeniedHistoryCount] = React.useState(0);
  const [totalHistoryCount, setTotalHistoryCount] = React.useState(0);
  const [totalCompletedPercentage, setTotalCompletedPercentage] = React.useState(0);
  const [totalProcessPercentage, setTotalProcessPercentage] = React.useState(0);
  const [totalDeniedPercentage, setTotalDeniedPercentage] = React.useState(0);
  const [totalCouponsUsed, setTotalCouponsUsed] = React.useState(0);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [totalMin, setTotalMin] = React.useState(0);

  const getActiveStatusCount = async () => {
    const customersRef = collection(fireDb, 'customer');
    const customersSnapshot = await getDocs(customersRef);

    let activeCount = 0; // add this line
    let processCount = 0; // add this line
    let deniedCount = 0; // add this line
    let couponsUsed = 0; // add this line
    let totalPrice = 0;
    let totalMin = 0;


    // Loop through all customers
    customersSnapshot.forEach(async (customerDoc) => {
      dispatch(ShowLoading());
      const historyRef = collection(customerDoc.ref, 'history');

      // Query all history documents with status == 'active'
      const activeHistoryQry = query(historyRef, where('status', '==', 'completed'));
      const activeHistorySnapshot = await getDocs(activeHistoryQry);
      // Query all history documents with status == 'process'
      const processHistoryQry = query(historyRef, where('status', '==', 'process'));
      const processHistorySnapshot = await getDocs(processHistoryQry);
      // Query all history documents with status == 'process'
      const deniedHistoryQry = query(historyRef, where('status', '==', 'denied'));
      const deniedHistorySnapshot = await getDocs(deniedHistoryQry);

      let completedTotalPrice = 0;
      activeHistorySnapshot.forEach((doc) => {
        const data = doc.data();
        completedTotalPrice += data.totalPrice;
      });

      let completedTotalMin = 0;
      activeHistorySnapshot.forEach((doc) => {
        const data = doc.data();
        completedTotalMin += data.totalMins;
      });

      // Add completed total price to overall total price
      totalPrice += completedTotalPrice;
      totalMin += completedTotalMin;

      // Count active history documents and log to the console
      const activeHistoryCount = activeHistorySnapshot.size;
      activeCount += activeHistoryCount; // add this line
      const processHistoryCount = processHistorySnapshot.size;
      processCount += processHistoryCount; // add this line
      const deniedHistoryCount = deniedHistorySnapshot.size;
      deniedCount += deniedHistoryCount; // add this line

      let totalCount = activeCount + processCount + deniedCount;
      const totalCompletedPercentage = (activeCount / totalCount) * 100;
      const totalProcessPercentage = (processCount / totalCount) * 100;
      const totalDeniedPercentage = (deniedCount / totalCount) * 100;
      // update state
      setActiveHistoryCount(activeCount);
      setDeniedHistoryCount(deniedCount);
      setProcessHistoryCount(processCount);
      setTotalHistoryCount(totalCount);
      setTotalCompletedPercentage(totalCompletedPercentage);
      setTotalProcessPercentage(totalProcessPercentage);
      setTotalDeniedPercentage(totalDeniedPercentage);
      setTotalPrice(totalPrice);
      setTotalMin(totalMin);
      dispatch(HideLoading());
    });

    customersSnapshot.forEach(async (customerDoc) => {
      const couponRef = collection(customerDoc.ref, 'coupon');

      const couponUsedQry = query(couponRef, where('used', '==', true));
      const couponUsedSnapshot = await getDocs(couponUsedQry);

      const totalCouponsUsed = couponUsedSnapshot.size;
      couponsUsed += totalCouponsUsed; // add this line
      setTotalCouponsUsed(couponsUsed);
    });
  };

  useEffect(() => { // call this function inside useEffect
    getActiveStatusCount();
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
          Dashboard - Analytics
        </Text>

        <div>
          <Group mt={20}>
            <div className="total-transactions">
              <h1 className="card-title">
                Total Parks : {totalHistoryCount}
              </h1>
              <Divider my={20} />
              <p>Completed Parks : {activeHistoryCount}</p>
              <p>Active Parks : {processHistoryCount}</p>
              <p>Denied Parks : {deniedHistoryCount}</p>

              <Group>
                <RingProgress
                  label={
                    <Text size="xs" align="center">
                      Completed {totalCompletedPercentage.toFixed(2)}%
                    </Text>
                  }
                  roundCaps
                  sections={[
                    {
                      value: 100 - totalCompletedPercentage,
                    },
                    { value: totalCompletedPercentage, color: "teal" },
                  ]}
                />

                <RingProgress
                  label={
                    <Text size="xs" align="center">
                      Active {totalProcessPercentage.toFixed(2)}%
                    </Text>
                  }
                  roundCaps
                  sections={[
                    {
                      value: 100 - totalProcessPercentage,
                    },
                    { value: totalProcessPercentage, color: "yellow" },
                  ]}
                />
                <RingProgress
                  label={
                    <Text size="xs" align="center">
                      Denied {totalDeniedPercentage.toFixed(2)}%
                    </Text>
                  }
                  roundCaps
                  sections={[
                    {
                      value: 100 - totalDeniedPercentage,
                    },
                    { value: totalDeniedPercentage, color: "red" },
                  ]}
                />
              </Group>
            </div>

            <div className="total-turnover">
              <h1 className="card-title">Total Coupons Used : {totalCouponsUsed}</h1>
              <Divider my={20} />
              <h1 className="card-title">Total Money Charged : {totalPrice}₺</h1>
              <Divider my={20} />
              <h1 className="card-title">Total Parking Time : {totalMin} Minutes</h1>
            </div>
          </Group>
        </div>
      </div>


      <Modal
        size="lg"
        title={formMode === "add" ? "Vendor Ekle" : "Vendor Düzenle"}
        opened={showForm}
        onClose={() => setShowForm(false)}
        centered
      >
        <TransactionForm
          formMode={formMode}
          setFormMode={setFormMode}
          setShowForm={setShowForm}
          showForm={showForm}
          transactionData={selectedTransaction}
        />
      </Modal>
    </Box>
  );
}

export default Dashboard;
