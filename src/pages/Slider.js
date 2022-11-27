import React, { useEffect } from "react";
import HeaderMegaMenu from "../components/HeaderMegaMenu";
import { Box, Card, Button, Modal, Group, Divider, Text } from "@mantine/core";
import SliderForm from "../components/SliderForm";
import { useDispatch } from "react-redux";
import { fireDb } from "../firebaseConfig";
import { showNotification } from "@mantine/notifications";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import SliderTable from "../components/SliderTable";
import Filters from "../components/Filters";
import moment from "moment";
import Analytics from "../components/Analytics";
import { useNavigate } from "react-router-dom";


function Slider() {
  const navigate = useNavigate();
  const [view, setView] = React.useState("table");
  const [filters, setFilters] = React.useState({
    type: "",
    frequency: "365",
    dateRange: [],
  });
  const slider = JSON.parse(localStorage.getItem("slider"));
  const dispatch = useDispatch();
  const [sliders, setSliders] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [formMode, setFormMode] = React.useState("add");
  const [selectedSlider, setSelectedSlider] = React.useState({});

  const getWhereConditions = () => {
    const tempConditions = [];

    // type condition
    if (filters.type !== "") {
      tempConditions.push(where("type", "==", filters.type));
    }

    // frequency condition
    if (filters.frequency !== "custom-range") {
      if (filters.frequency === "7") {
        tempConditions.push(
          where("date", ">=", moment().subtract(7, "days").format("YYYY-MM-DD"))
        );
      } else if (filters.frequency === "30") {
        tempConditions.push(
          where(
            "date",
            ">=",
            moment().subtract(30, "days").format("YYYY-MM-DD")
          )
        );
      } else if (filters.frequency === "365") {
        tempConditions.push(
          where(
            "date",
            ">=",
            moment().subtract(365, "days").format("YYYY-MM-DD")
          )
        );
      }
    } else {
      const fromDate = moment(filters.dateRange[0]).format("YYYY-MM-DD");
      const toDate = moment(filters.dateRange[1]).format("YYYY-MM-DD");
      tempConditions.push(where("date", ">=", fromDate));
      tempConditions.push(where("date", "<=", toDate));
    }
    return tempConditions;
  };

  const getData = async () => {
    try {
      const whereConditions = getWhereConditions();
      dispatch(ShowLoading());
      const qry = query(
        collection(fireDb, `sliders`),
        orderBy("date", "desc"),
        ...whereConditions
      );

      const response = await getDocs(qry);
      const data = response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSliders(data);

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
  }, [filters]);

  return (
    <Box>

      <HeaderMegaMenu/>
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
      Slider
    </Text>
        <Card>
          <div className="flex justify-between items-end">
            <div>
              <Filters
                filters={filters}
                setFilters={setFilters}
                getData={getData}
              />
            </div>
            <Group>
              <Button
                color="green"
                onClick={() => {
                  setShowForm(true);
                  setFormMode("add");
                }}
              >
                Slider Ekle
              </Button>
            </Group>
          </div>
          <Divider mt={20}/>
          {view === "table" && (
            <SliderTable
              sliders={sliders}
              setSelectedSlider={setSelectedSlider}
              setFormMode={setFormMode}
              setShowForm={setShowForm}
              getData={getData}
            />
          )}
          {view === "analytics" && <Analytics sliders={sliders} />}
        </Card>
      </div>

      <Modal
        size="lg"
        title={formMode === "add" ? "Add Transaction" : "Edit Transaction"}
        opened={showForm}
        onClose={() => setShowForm(false)}
        centered
      >
        <SliderForm
          formMode={formMode}
          setFormMode={setFormMode}
          setShowForm={setShowForm}
          showForm={showForm}
          sliderData={selectedSlider}
          getData={getData}
        />
      </Modal>
    </Box>
  );
}

export default Slider;
