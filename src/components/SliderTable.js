import { Group, Table, Badge, Image } from "@mantine/core";
import React from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { showNotification } from "@mantine/notifications";
import { deleteDoc, doc, Timestamp } from "firebase/firestore";
import { fireDb } from "../firebaseConfig";


function SliderTable({
  sliders,
  setSelectedSlider,
  setFormMode,
  setShowForm,
  getData,
}) {
  const dispatch = useDispatch();
  const slider = JSON.parse(localStorage.getItem("banners"));
  const deleteSlider = async (id) => {
    try {
      dispatch(ShowLoading());
      await deleteDoc(doc(fireDb, `banners/`, id));
      dispatch(HideLoading());
      showNotification({
        title: "Slider başarıyla silindi",
        color: "green",
      });
      getData();
    } catch (error) {
      dispatch(HideLoading());
      showNotification({
        title: "Silinirken hata oluştu",
        color: "red",
      });
    }
  };

  //Aktif Pasif Badge
  const activeBadge = <Badge variant="gradient" gradient={{ from: 'teal', to: 'lime', deg: 105 }}>Aktif</Badge>
  const passiveBadge = <Badge variant="gradient" gradient={{ from: 'orange', to: 'red' }}>Pasif</Badge>

  function actPass(slider){
    if(slider.active === true){
      return activeBadge
    }else{
      return passiveBadge
    }
  }

  const getRows = sliders.map((slider) => (
    <tr key={slider.banner_url}>
      <td>{moment(slider.added_date.toDate()).format('MMMM Do YYYY')}</td>
      <td><Image  
        radius="md"
        width={200}
        height={80}
        fit="contain" 
        src={slider.banner_url}/></td>
      <td>{moment(slider.finish_date.toDate()).format('MMMM Do YYYY')}</td>
      <td>{actPass(slider)}</td>
      <td>
        <Group>
          <i
            className="ri-pencil-line"
            onClick={() => {
              setSelectedSlider(slider);
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
          <th>Eklenme Tarihi</th>
          <th>Slider Resmi</th>
          <th>Bitiş Tarihi</th>
          <th>Aktif/Pasif</th>
        </tr>
      </thead>
      <tbody>{getRows}</tbody>
    </Table>
  );
}

export default SliderTable;
