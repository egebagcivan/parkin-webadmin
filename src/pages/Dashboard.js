import React, { useEffect } from "react";
import HeaderMegaMenu from "../components/HeaderMegaMenu";
import { Box, Modal, Group, Divider } from "@mantine/core";
import TransactionForm from "../components/TransactionForm";
import { useDispatch } from "react-redux";
import { fireDb } from "../firebaseConfig";
import { showNotification } from "@mantine/notifications";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { RingProgress, Text, Progress } from "@mantine/core";


function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
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
  const [totalVendors, setTotalVendors] = React.useState(0);
  const [activeVendors, setActiveVendors] = React.useState(0);
  const [passiveVendors, setPassiveVendors] = React.useState(0);
  const [activeVendorsPercentage, setActiveVendorsPercentage] = React.useState(0);
  const [passiveVendorsPercentage, setPassiveVendorsPercentage] = React.useState(0);

  const getVendorsDashboard = async () => {
    const vendorRef = collection(fireDb, 'vendor');
    const vendorSnapshot = await getDocs(vendorRef);

    let activeVendorCount = 0;
    let PassiveVendorCount = 0;
    let totalVendorCount = 0;

    vendorSnapshot.forEach(async (vendorDoc) => {
      const data = vendorDoc.data();
      if (data.active === true) {
        activeVendorCount += 1;
        totalVendorCount += 1;
      } else {
        PassiveVendorCount += 1;
        totalVendorCount += 1;
      }
    });
    setTotalVendors(totalVendorCount);
    setActiveVendors(activeVendorCount);
    setPassiveVendors(PassiveVendorCount);
    console.log(activeVendors, passiveVendors, totalVendors);

    const activePercentage = (activeVendorCount / totalVendorCount) * 100;
    const passivePercentage = (PassiveVendorCount / totalVendorCount) * 100;
    setActiveVendorsPercentage(activePercentage);
    setPassiveVendorsPercentage(passivePercentage);
  }

  const getActiveStatusCount = async () => {
    const customersRef = collection(fireDb, 'customer');
    const customersSnapshot = await getDocs(customersRef);

    let activeCount = 0;
    let processCount = 0;
    let deniedCount = 0;
    let couponsUsed = 0;
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
      activeCount += activeHistoryCount;
      const processHistoryCount = processHistorySnapshot.size;
      processCount += processHistoryCount;
      const deniedHistoryCount = deniedHistorySnapshot.size;
      deniedCount += deniedHistoryCount;

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
      couponsUsed += totalCouponsUsed;
      setTotalCouponsUsed(couponsUsed);
    });
  };

  useEffect(() => {
    getActiveStatusCount();
    getVendorsDashboard();
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
                Total Process : {totalHistoryCount}
              </h1>
              <Divider my={20} />
              <p>Completed Process : {activeHistoryCount}</p>
              <p>Active Process : {processHistoryCount}</p>
              <p>Denied Process : {deniedHistoryCount}</p>

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
              <h1 className="card-title">
                Total Parking Lots : {totalVendors}
              </h1>
              <Divider my={20} />
              <p>Active Parking Lots : {activeVendors}</p>
              <p>Passive Parking Lots : {passiveVendors}</p>

              <Group>
                <RingProgress
                  label={
                    <Text size="xs" align="center">
                      Active {activeVendorsPercentage.toFixed(2)}%
                    </Text>
                  }
                  roundCaps
                  sections={[
                    {
                      value: 100 - activeVendorsPercentage,
                    },
                    { value: activeVendorsPercentage, color: "teal" },
                  ]}
                />
                <RingProgress
                  label={
                    <Text size="xs" align="center">
                      Passive {passiveVendorsPercentage.toFixed(2)}%
                    </Text>
                  }
                  roundCaps
                  sections={[
                    {
                      value: 100 - passiveVendorsPercentage,
                    },
                    { value: passiveVendorsPercentage, color: "red" },
                  ]}
                />
              </Group>
            </div>

            <div className="total-third">
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
