import { Group, Table } from "@mantine/core";
import React from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { showNotification } from "@mantine/notifications";
import { deleteDoc, doc } from "firebase/firestore";
import { fireDb } from "../firebaseConfig";

function SliderTable({
  sliders,
  setSelectedSlider,
  setFormMode,
  setShowForm,
  getData,
}) {
  const dispatch = useDispatch();
  const slider = JSON.parse(localStorage.getItem("slider"));
  const deleteSlider = async (id) => {
    try {
      dispatch(ShowLoading());
      await deleteDoc(doc(fireDb, `sliders`, id));
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

  const getRows = sliders.map((slider) => (
    <tr key={slider.img_url}>
      <td>{slider.img_url}</td>
      <td>{moment(slider.date).format("DD-MM-YYYY")}</td>
      <td>
        <Group>
          <i
            className="ri-pencil-line"
            onClick={() => {
              setSelectedSlider(sliders);
              setFormMode("edit");
              setShowForm(true);
            }}
          ></i>
          <i
            className="ri-delete-bin-line"
            onClick={() => {
              deleteSlider(slider.id);
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
          <th>Aktif/Pasif</th>
          <th>Eklenme Tarihi</th>
          <th>Slider URL</th>
          <th>Bitiş Tarihi</th>
        </tr>
      </thead>
      <tbody>{getRows}</tbody>
    </Table>
  );
}

export default SliderTable;
